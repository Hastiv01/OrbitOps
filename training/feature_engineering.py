"""
Shared feature engineering for the battery-prediction and resource-risk models.

IMPORTANT: This exact module is duplicated (kept in sync) at
backend/app/services/resource_intelligence/feature_engineering.py so the
FastAPI service transforms incoming telemetry identically to how the models
were trained. If you change the feature set here, copy the change there too
(or, better, delete the backend copy and import this one directly if your
backend and training code share a Python environment).
"""
from __future__ import annotations

import numpy as np
import pandas as pd

ORBIT_TYPES = ["LEO", "MEO", "GEO", "SSO"]

NUMERIC_FEATURES = [
    "orbit_altitude_km",
    "inclination_deg",
    "current_battery_percent",
    "solar_exposure_hours",
    "eclipse_duration_hours",
    "payload_count",
    "payload_power_kw",
    "communication_duration_minutes",
    "communication_bandwidth_mbps",
    "onboard_memory_used_gb",
    "onboard_memory_total_gb",
    "cpu_utilization_percent",
    "temperature_celsius",
    "mission_duration_hours",
    "previous_power_consumption_kw",
    "previous_battery_percent",
    "power_consumption_kw",
    "memory_utilization_percent",
]

CATEGORICAL_FEATURES = ["orbit_type"]

ALL_MODEL_COLUMNS = NUMERIC_FEATURES + [f"orbit_{o}" for o in ORBIT_TYPES]


def add_derived_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Add engineered columns that aren't present verbatim in the raw data."""
    df = df.copy()
    if "memory_utilization_percent" not in df.columns:
        total = df.get("onboard_memory_total_gb", pd.Series(1, index=df.index)).replace(0, 1)
        used = df.get("onboard_memory_used_gb", pd.Series(0, index=df.index))
        df["memory_utilization_percent"] = (used / total * 100).clip(0, 100)

    # Net power balance: positive means charging, negative means draining
    if "power_consumption_kw" in df.columns and "payload_power_kw" in df.columns:
        df["net_power_balance_kw"] = df["payload_power_kw"] - df["power_consumption_kw"]

    # Battery delta already observed (useful signal for the risk model)
    if "current_battery_percent" in df.columns and "previous_battery_percent" in df.columns:
        df["battery_delta_percent"] = df["current_battery_percent"] - df["previous_battery_percent"]

    return df


def one_hot_orbit(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    for orbit in ORBIT_TYPES:
        df[f"orbit_{orbit}"] = (df.get("orbit_type", "") == orbit).astype(int)
    return df


def build_feature_matrix(df: pd.DataFrame, columns=None) -> pd.DataFrame:
    """Transform a raw (or partially raw) dataframe into the exact numeric
    feature matrix the models expect, in a stable column order."""
    columns = columns or ALL_MODEL_COLUMNS
    df = add_derived_columns(df)
    df = one_hot_orbit(df)

    for col in columns:
        if col not in df.columns:
            df[col] = 0.0

    return df[columns].astype(float)


def features_from_dict(payload: dict) -> pd.DataFrame:
    """Convenience wrapper: build a 1-row feature matrix from a plain dict
    (e.g. a JSON request body from the FastAPI layer)."""
    row = {k: payload.get(k, 0) for k in NUMERIC_FEATURES if k != "memory_utilization_percent"}
    row["orbit_type"] = payload.get("orbit_type", "LEO")
    df = pd.DataFrame([row])
    return build_feature_matrix(df)
