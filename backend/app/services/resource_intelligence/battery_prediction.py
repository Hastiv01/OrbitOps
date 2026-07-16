"""
Battery Prediction service.

Wraps the trained GradientBoostingRegressor (trained_models/battery_model.pkl,
MAE ≈ 0.85 percentage points on held-out test data) to answer two questions
the frontend needs:

1. Given a satellite's current telemetry, what will its battery level be
   at the end of the current/next mission window? -> predict()
2. What does the battery trajectory look like over the next N hours, so we
   can draw the "Prediction Snapshot" / forecast charts on the Resources
   page? -> forecast()
"""
from __future__ import annotations

from typing import List, Dict, Any

from app.services.resource_intelligence.inference import get_models

DEFAULT_TELEMETRY = {
    "orbit_type": "LEO",
    "orbit_altitude_km": 420,
    "inclination_deg": 51,
    "solar_exposure_hours": 3.0,
    "eclipse_duration_hours": 1.2,
    "payload_count": 2,
    "payload_power_kw": 3.5,
    "communication_duration_minutes": 30,
    "communication_bandwidth_mbps": 150,
    "onboard_memory_used_gb": 250,
    "onboard_memory_total_gb": 512,
    "cpu_utilization_percent": 50,
    "temperature_celsius": 40,
    "mission_duration_hours": 4,
    "previous_power_consumption_kw": 3.0,
    "power_consumption_kw": 3.2,
}


def _merged(telemetry: Dict[str, Any]) -> Dict[str, Any]:
    merged = {**DEFAULT_TELEMETRY, **telemetry}
    merged.setdefault("previous_battery_percent", merged.get("current_battery_percent", 60))
    return merged


def predict(telemetry: Dict[str, Any]) -> Dict[str, Any]:
    """Predict remaining battery percent for a single point-in-time reading."""
    models = get_models()
    merged = _merged(telemetry)
    predicted = models.predict_battery(merged)
    current = merged.get("current_battery_percent", 60)

    return {
        "currentBatteryPercent": round(float(current), 1),
        "predictedBatteryPercent": round(predicted, 1),
        "predictedChange": round(predicted - current, 1),
        "modelSource": "trained" if models.available else "heuristic-fallback",
    }


def forecast(telemetry: Dict[str, Any], hours: int = 12) -> List[Dict[str, Any]]:
    """
    Roll the single-step model forward hour-by-hour to build a short-term
    trajectory. Each step feeds the previous step's prediction back in as
    the new "current_battery_percent", which is how the mission-window
    model was trained to be used (one decision horizon at a time).
    """
    models = get_models()
    state = _merged(telemetry)
    points = []
    battery = state.get("current_battery_percent", 60)

    for h in range(hours + 1):
        points.append({"hour": h, "batteryPercent": round(battery, 1)})
        state["previous_battery_percent"] = battery
        state["current_battery_percent"] = battery
        state["mission_duration_hours"] = 1
        battery = models.predict_battery(state)

    return points


def hours_to_threshold(telemetry: Dict[str, Any], threshold: float = 20.0, max_hours: int = 48) -> int | None:
    """How many hours until battery is predicted to cross a critical
    threshold, given current conditions hold steady. Returns None if it
    doesn't cross within max_hours."""
    points = forecast(telemetry, hours=max_hours)
    for p in points:
        if p["batteryPercent"] <= threshold:
            return p["hour"]
    return None
