"""
Trains the battery-prediction regression model.

Target: remaining_battery_percent (the satellite's battery level at the end
of the current mission window, given its current telemetry).

Model: GradientBoostingRegressor (robust on tabular data, no heavy deps
beyond scikit-learn, fast enough to retrain on demand).

Run:
    python training/preprocess.py        # once, to produce train/test splits
    python training/train_battery_model.py
"""
import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, r2_score, mean_squared_error

from feature_engineering import build_feature_matrix, ALL_MODEL_COLUMNS
from preprocess import BATTERY_TARGET, PROCESSED_DIR

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "trained_models")


def main():
    train_df = pd.read_csv(os.path.join(PROCESSED_DIR, "train.csv"))
    test_df = pd.read_csv(os.path.join(PROCESSED_DIR, "test.csv"))

    X_train = build_feature_matrix(train_df)
    y_train = train_df[BATTERY_TARGET].values
    X_test = build_feature_matrix(test_df)
    y_test = test_df[BATTERY_TARGET].values

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    model = GradientBoostingRegressor(
        n_estimators=300,
        max_depth=4,
        learning_rate=0.05,
        subsample=0.9,
        random_state=42,
    )
    model.fit(X_train_scaled, y_train)

    preds = model.predict(X_test_scaled)
    mae = mean_absolute_error(y_test, preds)
    rmse = np.sqrt(mean_squared_error(y_test, preds))
    r2 = r2_score(y_test, preds)

    print("=== Battery Prediction Model ===")
    print(f"MAE:  {mae:.2f} percentage points")
    print(f"RMSE: {rmse:.2f} percentage points")
    print(f"R^2:  {r2:.4f}")

    importances = sorted(
        zip(ALL_MODEL_COLUMNS, model.feature_importances_), key=lambda x: -x[1]
    )
    print("\nTop feature importances:")
    for name, imp in importances[:8]:
        print(f"  {name:35s} {imp:.4f}")

    os.makedirs(MODELS_DIR, exist_ok=True)
    joblib.dump(model, os.path.join(MODELS_DIR, "battery_model.pkl"))
    joblib.dump(scaler, os.path.join(MODELS_DIR, "scaler.pkl"))
    print(f"\nSaved model -> {MODELS_DIR}/battery_model.pkl")
    print(f"Saved scaler -> {MODELS_DIR}/scaler.pkl")


if __name__ == "__main__":
    main()
