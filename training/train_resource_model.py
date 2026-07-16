"""
Trains the resource-utilization risk classifier.

Target: mission_risk (LOW / MEDIUM / HIGH) - used to power the Resource
Dashboard's per-satellite risk badges and to trigger AI recommendations.

Model: RandomForestClassifier (handles the mixed numeric/categorical feature
set well and gives us predict_proba for confidence scores in the UI).

Run:
    python training/preprocess.py
    python training/train_resource_model.py
"""
import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import classification_report, accuracy_score, f1_score

from feature_engineering import build_feature_matrix, ALL_MODEL_COLUMNS
from preprocess import RESOURCE_TARGET, PROCESSED_DIR

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "trained_models")


def main():
    train_df = pd.read_csv(os.path.join(PROCESSED_DIR, "train.csv"))
    test_df = pd.read_csv(os.path.join(PROCESSED_DIR, "test.csv"))

    X_train = build_feature_matrix(train_df)
    X_test = build_feature_matrix(test_df)

    label_encoder = LabelEncoder()
    y_train = label_encoder.fit_transform(train_df[RESOURCE_TARGET])
    y_test = label_encoder.transform(test_df[RESOURCE_TARGET])

    # Reuse the same scaler convention as the battery model so both models
    # can share a single scaler.pkl if desired; resource model is trained
    # on its own scaler here since RandomForest doesn't strictly need
    # scaling, but we keep it consistent for any distance-based extensions.
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    model = RandomForestClassifier(
        n_estimators=400,
        max_depth=12,
        min_samples_leaf=3,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X_train_scaled, y_train)

    preds = model.predict(X_test_scaled)
    acc = accuracy_score(y_test, preds)
    f1 = f1_score(y_test, preds, average="macro")

    print("=== Resource Risk Classification Model ===")
    print(f"Accuracy: {acc:.4f}")
    print(f"Macro F1: {f1:.4f}")
    print()
    print(classification_report(y_test, preds, target_names=label_encoder.classes_))

    importances = sorted(
        zip(ALL_MODEL_COLUMNS, model.feature_importances_), key=lambda x: -x[1]
    )
    print("Top feature importances:")
    for name, imp in importances[:8]:
        print(f"  {name:35s} {imp:.4f}")

    os.makedirs(MODELS_DIR, exist_ok=True)
    joblib.dump(model, os.path.join(MODELS_DIR, "resource_model.pkl"))
    joblib.dump(label_encoder, os.path.join(MODELS_DIR, "resource_label_encoder.pkl"))
    # Only overwrite scaler.pkl if the battery model hasn't already produced
    # one; otherwise keep both scalers side by side under distinct names.
    joblib.dump(scaler, os.path.join(MODELS_DIR, "resource_scaler.pkl"))
    print(f"\nSaved model -> {MODELS_DIR}/resource_model.pkl")
    print(f"Saved label encoder -> {MODELS_DIR}/resource_label_encoder.pkl")
    print(f"Saved scaler -> {MODELS_DIR}/resource_scaler.pkl")


if __name__ == "__main__":
    main()
