"""
Loads the trained battery-prediction and resource-risk models once per
process and exposes simple predict_* helpers used by the service layer.

Models are trained by training/train_battery_model.py and
training/train_resource_model.py and saved to trained_models/. This module
never trains anything itself — it only loads the artifacts.
"""
from __future__ import annotations

import os
import logging
from functools import lru_cache

import joblib
import pandas as pd

from app.core.config import settings
from app.services.resource_intelligence.feature_engineering import build_feature_matrix

logger = logging.getLogger(__name__)


class ResourceIntelligenceModels:
    """Singleton-style holder for the two trained models + their scalers."""

    def __init__(self, models_dir: str):
        self.models_dir = models_dir
        self.available = False
        self.battery_model = None
        self.battery_scaler = None
        self.resource_model = None
        self.resource_scaler = None
        self.label_encoder = None
        self._load()

    def _path(self, name: str) -> str:
        return os.path.join(self.models_dir, name)

    def _load(self):
        try:
            self.battery_model = joblib.load(self._path("battery_model.pkl"))
            self.battery_scaler = joblib.load(self._path("scaler.pkl"))
            self.resource_model = joblib.load(self._path("resource_model.pkl"))
            self.resource_scaler = joblib.load(self._path("resource_scaler.pkl"))
            self.label_encoder = joblib.load(self._path("resource_label_encoder.pkl"))
            self.available = True
            logger.info("Resource Intelligence models loaded from %s", self.models_dir)
        except FileNotFoundError as exc:
            # Backend can still boot without models (e.g. before first
            # training run); endpoints fall back to rule-based heuristics.
            logger.warning(
                "Could not load AI models from %s (%s). "
                "Run training/train_battery_model.py and "
                "training/train_resource_model.py first.",
                self.models_dir,
                exc,
            )

    def predict_battery(self, telemetry: dict) -> float:
        if not self.available:
            return _fallback_battery_estimate(telemetry)
        df = pd.DataFrame([telemetry])
        X = self.battery_scaler.transform(build_feature_matrix(df))
        pred = float(self.battery_model.predict(X)[0])
        return max(0.0, min(100.0, pred))

    def predict_risk(self, telemetry: dict) -> dict:
        if not self.available:
            return _fallback_risk_estimate(telemetry)
        df = pd.DataFrame([telemetry])
        X = self.resource_scaler.transform(build_feature_matrix(df))
        pred = self.resource_model.predict(X)[0]
        proba = self.resource_model.predict_proba(X)[0]
        label = self.label_encoder.inverse_transform([pred])[0]
        confidence = round(float(max(proba)) * 100, 1)
        return {"risk": label, "confidence": confidence}


def _fallback_battery_estimate(telemetry: dict) -> float:
    """Simple physics-flavored heuristic used only if the trained model
    artifacts are missing, so the API never hard-fails."""
    current = telemetry.get("current_battery_percent", 60)
    power = telemetry.get("power_consumption_kw", 3)
    duration = telemetry.get("mission_duration_hours", 4)
    solar = telemetry.get("solar_exposure_hours", 2)
    drain = power * duration * 1.2
    charge = solar * 3.5
    return max(0.0, min(100.0, current - drain + charge))


def _fallback_risk_estimate(telemetry: dict) -> dict:
    battery = telemetry.get("current_battery_percent", 60)
    temp = telemetry.get("temperature_celsius", 35)
    cpu = telemetry.get("cpu_utilization_percent", 40)
    if battery < 25 or temp > 60 or cpu > 90:
        return {"risk": "HIGH", "confidence": 60.0}
    if battery < 45 or temp > 48 or cpu > 75:
        return {"risk": "MEDIUM", "confidence": 55.0}
    return {"risk": "LOW", "confidence": 60.0}


@lru_cache(maxsize=1)
def get_models() -> ResourceIntelligenceModels:
    return ResourceIntelligenceModels(settings.ML_MODELS_PATH)
