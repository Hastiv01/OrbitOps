"""
Evaluates the trained battery + resource models on the held-out test split
and writes a short markdown report. Useful for including model performance
numbers in your team's deliverable / demo slides.

Run:
    python training/evaluate.py
"""
import os
import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import (
    mean_absolute_error,
    r2_score,
    mean_squared_error,
    accuracy_score,
    f1_score,
    classification_report,
)

from feature_engineering import build_feature_matrix
from preprocess import BATTERY_TARGET, RESOURCE_TARGET, PROCESSED_DIR

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "trained_models")


def evaluate_battery(test_df: pd.DataFrame) -> str:
    model = joblib.load(os.path.join(MODELS_DIR, "battery_model.pkl"))
    scaler = joblib.load(os.path.join(MODELS_DIR, "scaler.pkl"))

    X = scaler.transform(build_feature_matrix(test_df))
    y = test_df[BATTERY_TARGET].values
    preds = model.predict(X)

    mae = mean_absolute_error(y, preds)
    rmse = np.sqrt(mean_squared_error(y, preds))
    r2 = r2_score(y, preds)

    return (
        "## Battery Prediction Model\n"
        f"- MAE: {mae:.2f} pp\n- RMSE: {rmse:.2f} pp\n- R^2: {r2:.4f}\n"
    )


def evaluate_resource(test_df: pd.DataFrame) -> str:
    model = joblib.load(os.path.join(MODELS_DIR, "resource_model.pkl"))
    scaler = joblib.load(os.path.join(MODELS_DIR, "resource_scaler.pkl"))
    label_encoder = joblib.load(os.path.join(MODELS_DIR, "resource_label_encoder.pkl"))

    X = scaler.transform(build_feature_matrix(test_df))
    y = label_encoder.transform(test_df[RESOURCE_TARGET])
    preds = model.predict(X)

    acc = accuracy_score(y, preds)
    f1 = f1_score(y, preds, average="macro")
    report = classification_report(y, preds, target_names=label_encoder.classes_)

    return (
        "## Resource Risk Classification Model\n"
        f"- Accuracy: {acc:.4f}\n- Macro F1: {f1:.4f}\n\n```\n{report}\n```\n"
    )


def main():
    test_df = pd.read_csv(os.path.join(PROCESSED_DIR, "test.csv"))

    report = "# OrbitOps AI Model Evaluation Report\n\n"
    report += evaluate_battery(test_df)
    report += "\n"
    report += evaluate_resource(test_df)

    out_path = os.path.join(os.path.dirname(__file__), "..", "trained_models", "EVALUATION_REPORT.md")
    with open(out_path, "w") as f:
        f.write(report)

    print(report)
    print(f"\nReport written to {out_path}")


if __name__ == "__main__":
    main()
