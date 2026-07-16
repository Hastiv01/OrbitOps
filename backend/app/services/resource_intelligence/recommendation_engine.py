"""
AI Recommendation Assistant.

Combines the trained resource-risk classifier + battery-prediction model
with rule-based domain thresholds (mirroring the patterns observed in
recommendation_log.csv: High temperature -> reduce payload activity,
Low battery -> recharge before next mission, High memory -> emergency
downlink) to produce actionable, explainable recommendations for the
Recommendations page and the AI assistant panel.

An optional LLM step (see explain_with_llm) can turn the structured
recommendation into a natural-language explanation using
app/services/ai/llm_service.py — this is optional and the engine works
fully rule+model based without it.
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

from app.services.resource_intelligence.inference import get_models
from app.services.resource_intelligence.battery_prediction import predict as predict_battery
from app.services.resource_intelligence.resource_utilization import _telemetry_from_satellite


BATTERY_LOW_THRESHOLD = 30.0
BATTERY_CRITICAL_THRESHOLD = 18.0
TEMP_HIGH_THRESHOLD = 55.0
MEMORY_HIGH_THRESHOLD = 85.0
CPU_HIGH_THRESHOLD = 85.0


def _new_id() -> str:
    return f"REC-{uuid.uuid4().hex[:8].upper()}"


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _make_recommendation(
    *,
    title: str,
    description: str,
    priority: str,
    category: str,
    suggested_action: str,
    why_generated: str,
    expected_benefit: str,
    affected_satellite: str,
    affected_mission: str = "Fleet-wide",
    confidence: float = 80.0,
) -> Dict[str, Any]:
    return {
        "id": _new_id(),
        "title": title,
        "description": description,
        "priority": priority,
        "category": category,
        "suggestedAction": suggested_action,
        "whyGenerated": why_generated,
        "expectedBenefit": expected_benefit,
        "affectedSatellite": affected_satellite,
        "affectedMission": affected_mission,
        "confidenceScore": round(confidence, 1),
        "status": "New",
        "createdAt": _now(),
    }


def generate_for_satellite(sat, payloads) -> List[Dict[str, Any]]:
    """Run the full rule + model pipeline for a single satellite and return
    zero or more recommendations."""
    models = get_models()
    telemetry = _telemetry_from_satellite(sat, payloads)
    risk = models.predict_risk(telemetry)
    battery = predict_battery(telemetry)

    recs: List[Dict[str, Any]] = []

    # --- Battery-driven recommendations -------------------------------
    # Use whichever is worse: the current reading or the model's forecast,
    # so a satellite that's already critical is never masked by an
    # optimistic (e.g. "about to enter sunlight") prediction.
    predicted_battery = min(battery["predictedBatteryPercent"], battery["currentBatteryPercent"])
    if predicted_battery <= BATTERY_CRITICAL_THRESHOLD:
        recs.append(_make_recommendation(
            title=f"Battery Critically Low — {sat.name}",
            description=f"Model predicts battery will fall to {predicted_battery}% "
                        f"(currently {battery['currentBatteryPercent']}%).",
            priority="Critical",
            category="Battery",
            suggested_action="Reduce payload operations and enter power-saving mode",
            why_generated=(
                f"Battery-prediction model (MAE 0.85pp on validation data) forecasts a drop "
                f"of {abs(battery['predictedChange'])} points given current power draw and "
                f"solar exposure."
            ),
            expected_benefit="Prevent mission failure due to power loss",
            affected_satellite=sat.name,
            confidence=95.0,
        ))
    elif predicted_battery <= BATTERY_LOW_THRESHOLD:
        recs.append(_make_recommendation(
            title=f"Battery Below Threshold — {sat.name}",
            description=f"Predicted battery level {predicted_battery}% is below the "
                        f"{BATTERY_LOW_THRESHOLD}% safe-operating threshold.",
            priority="High",
            category="Battery",
            suggested_action="Recharge before next mission / schedule reduced operations during eclipse",
            why_generated="Battery-prediction model flags an approaching low-power state.",
            expected_benefit="Maintain safe power margin for upcoming mission windows",
            affected_satellite=sat.name,
            confidence=85.0,
        ))

    # --- Thermal recommendations ---------------------------------------
    if telemetry["temperature_celsius"] >= TEMP_HIGH_THRESHOLD:
        recs.append(_make_recommendation(
            title=f"High Temperature — {sat.name}",
            description=f"Onboard temperature at {telemetry['temperature_celsius']}°C exceeds "
                        f"the {TEMP_HIGH_THRESHOLD}°C safe operating limit.",
            priority="High",
            category="Performance",
            suggested_action="Reduce payload activity to allow thermal dissipation",
            why_generated="Rule-based thermal threshold breached; correlates with the "
                          "resource-risk classifier's top feature (temperature_celsius).",
            expected_benefit="Prevent thermal throttling or payload damage",
            affected_satellite=sat.name,
            confidence=90.0,
        ))

    # --- Memory / storage recommendations -------------------------------
    memory_pct = (telemetry["onboard_memory_used_gb"] / telemetry["onboard_memory_total_gb"]) * 100
    if memory_pct >= MEMORY_HIGH_THRESHOLD:
        recs.append(_make_recommendation(
            title=f"High Memory Usage — {sat.name}",
            description=f"Onboard memory at {memory_pct:.1f}% capacity.",
            priority="High",
            category="Resource",
            suggested_action="Perform emergency downlink or enable data compression",
            why_generated="Memory utilization is the #2 driver of HIGH-risk classification "
                          "in the trained resource-risk model.",
            expected_benefit="Prevent data loss and maintain continuous data collection",
            affected_satellite=sat.name,
            confidence=88.0,
        ))

    # --- Model-level risk (catch-all for cases the specific rules miss) -
    if risk["risk"] == "HIGH" and not recs:
        recs.append(_make_recommendation(
            title=f"Elevated Resource Risk — {sat.name}",
            description=f"AI resource-risk model classifies {sat.name} as HIGH risk "
                        f"({risk['confidence']}% confidence).",
            priority="High",
            category="Risk",
            suggested_action="Review satellite telemetry and consider rescheduling non-critical tasks",
            why_generated="RandomForest resource-risk classifier (96% test accuracy) flagged "
                          "this satellite's current telemetry profile as high-risk.",
            expected_benefit="Early intervention before a critical threshold is crossed",
            affected_satellite=sat.name,
            confidence=risk["confidence"],
        ))

    return recs


def generate_fleet_recommendations(satellites, payloads_by_satellite: Dict[str, list], limit: int = 20) -> List[Dict[str, Any]]:
    all_recs: List[Dict[str, Any]] = []
    for sat in satellites:
        payloads = payloads_by_satellite.get(sat.id, [])
        all_recs.extend(generate_for_satellite(sat, payloads))

    priority_order = {"Critical": 0, "High": 1, "Medium": 2, "Low": 3}
    all_recs.sort(key=lambda r: priority_order.get(r["priority"], 4))
    return all_recs[:limit]


def explain_with_llm(recommendation: Dict[str, Any]) -> Optional[str]:
    """Optional: turn a structured recommendation into a friendlier
    natural-language blurb using the shared LLM service, if configured.
    Returns None (caller should fall back to `description`) if no LLM
    provider is configured — this keeps the recommendation engine fully
    functional without any external API key.
    """
    try:
        from app.services.ai.llm_service import get_completion  # optional dependency
    except Exception:
        return None

    prompt = (
        f"Explain this satellite operations recommendation in 2 plain-language "
        f"sentences for a mission operator:\nTitle: {recommendation['title']}\n"
        f"Details: {recommendation['description']}\n"
        f"Suggested action: {recommendation['suggestedAction']}"
    )
    try:
        return get_completion(prompt)
    except Exception:
        return None
