"""
Lightweight, framework-free inference helper. This is what
train_battery_model.py / train_resource_model.py implicitly test; the
FastAPI backend has its own (near-identical) copy under
backend/app/services/resource_intelligence/inference.py that wraps this
same logic behind the API.

Run directly for a quick smoke test:
    python training/inference.py
"""
import os
import joblib
import pandas as pd

from feature_engineering import build_feature_matrix

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "trained_models")


class ResourceIntelligenceModel:
    def __init__(self, models_dir: str = MODELS_DIR):
        self.battery_model = joblib.load(os.path.join(models_dir, "battery_model.pkl"))
        self.battery_scaler = joblib.load(os.path.join(models_dir, "scaler.pkl"))
        self.resource_model = joblib.load(os.path.join(models_dir, "resource_model.pkl"))
        self.resource_scaler = joblib.load(os.path.join(models_dir, "resource_scaler.pkl"))
        self.label_encoder = joblib.load(os.path.join(models_dir, "resource_label_encoder.pkl"))

    def predict_battery(self, telemetry: dict) -> float:
        df = pd.DataFrame([telemetry])
        X = self.battery_scaler.transform(build_feature_matrix(df))
        return float(self.battery_model.predict(X)[0])

    def predict_risk(self, telemetry: dict) -> dict:
        df = pd.DataFrame([telemetry])
        X = self.resource_scaler.transform(build_feature_matrix(df))
        pred = self.resource_model.predict(X)[0]
        proba = self.resource_model.predict_proba(X)[0]
        label = self.label_encoder.inverse_transform([pred])[0]
        confidence = float(max(proba))
        return {"risk": label, "confidence": round(confidence * 100, 1)}


SAMPLE_TELEMETRY = {
    "orbit_type": "LEO",
    "orbit_altitude_km": 420,
    "inclination_deg": 51,
    "current_battery_percent": 42,
    "solar_exposure_hours": 3.1,
    "eclipse_duration_hours": 1.4,
    "payload_count": 3,
    "payload_power_kw": 4.8,
    "communication_duration_minutes": 45,
    "communication_bandwidth_mbps": 220,
    "onboard_memory_used_gb": 380,
    "onboard_memory_total_gb": 512,
    "cpu_utilization_percent": 71,
    "temperature_celsius": 48.5,
    "mission_duration_hours": 6.2,
    "previous_power_consumption_kw": 5.1,
    "previous_battery_percent": 55,
    "power_consumption_kw": 5.4,
}


if __name__ == "__main__":
    model = ResourceIntelligenceModel()
    print("Predicted remaining battery %:", round(model.predict_battery(SAMPLE_TELEMETRY), 1))
    print("Predicted resource risk:", model.predict_risk(SAMPLE_TELEMETRY))
