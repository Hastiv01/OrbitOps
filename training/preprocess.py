"""
Data preprocessing for OrbitOps AI & Resource Intelligence.

Loads raw satellite resource telemetry (satellite_resources.csv) and produces
cleaned train/test splits used by both the battery-prediction and the
resource-risk models.

Run:
    python training/preprocess.py
"""
import os
import pandas as pd
from sklearn.model_selection import train_test_split

RAW_DIR = os.path.join(os.path.dirname(__file__), "..", "datasets", "raw")
PROCESSED_DIR = os.path.join(os.path.dirname(__file__), "..", "datasets", "processed")

FEATURE_COLUMNS = [
    "orbit_type",
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
]

BATTERY_TARGET = "remaining_battery_percent"
RESOURCE_TARGET = "mission_risk"
HEALTH_TARGET = "health_score"


def load_raw(filename: str = "satellite_resources.csv") -> pd.DataFrame:
    """Load the raw satellite_resources dataset. Falls back to project root
    if datasets/raw is not populated (e.g. when running from the delivered
    project bundle where the CSV lives at the repo root)."""
    candidates = [
        os.path.join(RAW_DIR, filename),
        filename,
        os.path.join(os.path.dirname(__file__), "..", filename),
    ]
    for path in candidates:
        if os.path.exists(path):
            return pd.read_csv(path)
    raise FileNotFoundError(f"Could not locate {filename} in any of: {candidates}")


def clean(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df = df.dropna(subset=FEATURE_COLUMNS + [BATTERY_TARGET, RESOURCE_TARGET, HEALTH_TARGET])

    # Clip physically implausible values
    df["current_battery_percent"] = df["current_battery_percent"].clip(0, 100)
    df["remaining_battery_percent"] = df["remaining_battery_percent"].clip(0, 100)
    df["cpu_utilization_percent"] = df["cpu_utilization_percent"].clip(0, 100)

    # Memory utilization ratio is a stronger signal than raw GB
    df["memory_utilization_percent"] = (
        df["onboard_memory_used_gb"] / df["onboard_memory_total_gb"].replace(0, 1) * 100
    ).clip(0, 100)

    return df


def split(df: pd.DataFrame, test_size: float = 0.2, seed: int = 42):
    train_df, test_df = train_test_split(df, test_size=test_size, random_state=seed, stratify=df[RESOURCE_TARGET])
    return train_df, test_df


def main():
    os.makedirs(PROCESSED_DIR, exist_ok=True)
    df = clean(load_raw())
    train_df, test_df = split(df)

    train_df.to_csv(os.path.join(PROCESSED_DIR, "train.csv"), index=False)
    test_df.to_csv(os.path.join(PROCESSED_DIR, "test.csv"), index=False)
    # Small held-out validation slice carved out of train for tuning
    val_df = train_df.sample(frac=0.15, random_state=1)
    val_df.to_csv(os.path.join(PROCESSED_DIR, "validation.csv"), index=False)
    df.to_csv(os.path.join(PROCESSED_DIR, "cleaned_data.csv"), index=False)

    print(f"Loaded {len(df)} rows")
    print(f"Train: {len(train_df)}  Test: {len(test_df)}  Val: {len(val_df)}")


if __name__ == "__main__":
    main()
