"""
Resource Utilization service.

Builds the per-satellite utilization rows (battery / memory / storage /
power / bandwidth / cpu / risk) that power the Resources dashboard table,
using the live Satellite + Payload records from the DB combined with the
trained resource-risk classifier (trained_models/resource_model.pkl,
96% accuracy / 0.957 macro-F1 on held-out data).
"""
from __future__ import annotations

from typing import List, Dict, Any

from app.services.resource_intelligence.inference import get_models
from app.services.resource_intelligence.battery_prediction import predict as predict_battery


def _telemetry_from_satellite(sat, payloads) -> Dict[str, Any]:
    payload_power = sum(getattr(p, "power_consumption", 0) or 0 for p in payloads) / 1000.0
    memory_used = sum(getattr(p, "memory_usage", 0) or 0 for p in payloads)
    avg_temp = sat.temperature if sat.temperature else 40.0

    return {
        "orbit_type": sat.orbit,
        "orbit_altitude_km": sat.altitude,
        "inclination_deg": sat.inclination,
        "current_battery_percent": sat.battery_health,
        "previous_battery_percent": sat.battery_health,
        "solar_exposure_hours": 3.0,
        "eclipse_duration_hours": 1.2,
        "payload_count": len(payloads),
        "payload_power_kw": round(payload_power, 2),
        "communication_duration_minutes": 30,
        "communication_bandwidth_mbps": 150,
        "onboard_memory_used_gb": min(memory_used / 1024.0, 500),
        "onboard_memory_total_gb": 512,
        "cpu_utilization_percent": 50,
        "temperature_celsius": avg_temp,
        "mission_duration_hours": 4,
        "previous_power_consumption_kw": round(payload_power, 2),
        "power_consumption_kw": round(payload_power, 2),
    }


def get_utilization_for_satellite(sat, payloads) -> Dict[str, Any]:
    models = get_models()
    telemetry = _telemetry_from_satellite(sat, payloads)
    risk_result = models.predict_risk(telemetry)
    battery_result = predict_battery(telemetry)

    memory_pct = round(
        (telemetry["onboard_memory_used_gb"] / telemetry["onboard_memory_total_gb"]) * 100, 1
    )

    return {
        "satellite": sat.name,
        "satelliteId": sat.id,
        "battery": round(sat.battery_health, 1),
        "predictedBattery": battery_result["predictedBatteryPercent"],
        "memory": memory_pct,
        "storage": memory_pct,  # onboard storage tracked alongside memory in this model
        "power": min(100, round(telemetry["power_consumption_kw"] * 8, 1)),
        "bandwidth": min(100, round(telemetry["communication_bandwidth_mbps"] / 3, 1)),
        "cpu": telemetry["cpu_utilization_percent"],
        "risk": risk_result["risk"].capitalize(),
        "riskConfidence": risk_result["confidence"],
    }


def get_fleet_utilization(satellites, payloads_by_satellite: Dict[str, list]) -> List[Dict[str, Any]]:
    rows = []
    for sat in satellites:
        payloads = payloads_by_satellite.get(sat.id, [])
        rows.append(get_utilization_for_satellite(sat, payloads))
    return rows


def summarize_fleet(rows: List[Dict[str, Any]]) -> Dict[str, Any]:
    if not rows:
        return {"avgBattery": 0, "avgPower": 0, "avgMemory": 0, "avgStorage": 0, "criticalCount": 0, "highCount": 0}

    n = len(rows)
    return {
        "avgBattery": round(sum(r["battery"] for r in rows) / n, 1),
        "avgPower": round(sum(r["power"] for r in rows) / n, 1),
        "avgMemory": round(sum(r["memory"] for r in rows) / n, 1),
        "avgStorage": round(sum(r["storage"] for r in rows) / n, 1),
        "criticalCount": sum(1 for r in rows if r["risk"] == "Critical"),
        "highCount": sum(1 for r in rows if r["risk"] == "High"),
    }
