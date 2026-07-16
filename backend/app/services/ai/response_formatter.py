"""Formats raw model / LLM outputs into the shapes the frontend expects."""
from typing import Dict, Any, List


def format_recommendation_for_frontend(rec: Dict[str, Any]) -> Dict[str, Any]:
    """Ensure a recommendation dict has every field the React
    RecommendationDetail type expects, filling safe defaults for any the
    engine didn't set."""
    defaults = {
        "estimatedResourceSaving": "N/A",
        "estimatedBatterySaving": "N/A",
        "estimatedTimeSaving": "N/A",
        "appliedAt": None,
        "appliedBy": None,
    }
    return {**defaults, **rec}


def format_recommendations(recs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    return [format_recommendation_for_frontend(r) for r in recs]


def format_battery_prediction(pred: Dict[str, Any], satellite_name: str) -> Dict[str, Any]:
    return {
        "satellite": satellite_name,
        "currentBattery": pred["currentBatteryPercent"],
        "predictedBattery": pred["predictedBatteryPercent"],
        "change": pred["predictedChange"],
        "trend": "declining" if pred["predictedChange"] < -1 else (
            "improving" if pred["predictedChange"] > 1 else "stable"
        ),
        "source": pred["modelSource"],
    }
