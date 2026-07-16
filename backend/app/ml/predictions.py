import os
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta

def predict_battery(satellite_id: str, hours_ahead: int = 12) -> dict:
    """Predicts battery level for the given satellite for the next X hours based on historical telemetry."""
    file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../datasets/raw/telemetry.csv"))
    
    if not os.path.exists(file_path):
        return {"error": "Dataset not found"}
        
    df = pd.read_csv(file_path)
    df = df[df['satellite_id'] == satellite_id].copy()
    
    if len(df) < 5:
        return {"error": "Not enough telemetry data to train prediction model"}
        
    # Convert timestamps to numeric (hours since first record) for training
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df = df.sort_values('timestamp')
    base_time = df['timestamp'].iloc[0]
    df['hours'] = (df['timestamp'] - base_time).dt.total_seconds() / 3600.0
    
    # Train simple linear regression on recent data (e.g. last 24 records)
    recent_df = df.tail(24)
    X = recent_df[['hours']].values
    y = recent_df['battery_level_pct'].values
    
    model = LinearRegression()
    model.fit(X, y)
    
    # Predict future
    last_time = df['timestamp'].iloc[-1]
    last_hours = df['hours'].iloc[-1]
    
    predictions = []
    for i in range(1, hours_ahead + 1):
        future_hours = last_hours + i
        pred_battery = model.predict([[future_hours]])[0]
        # Bound between 0 and 100
        pred_battery = max(0.0, min(100.0, pred_battery))
        
        future_time = last_time + timedelta(hours=i)
        predictions.append({
            "time": future_time.strftime("%H:%M"),
            "predicted_battery": float(pred_battery)
        })
        
    # Determine risk level
    final_batt = predictions[-1]['predicted_battery']
    risk = "Low"
    if final_batt < 20:
        risk = "Critical"
    elif final_batt < 50:
        risk = "Medium"
        
    return {
        "satellite_id": satellite_id,
        "current_battery": float(y[-1]),
        "predicted_battery_end": float(final_batt),
        "risk_level": risk,
        "timeline": predictions
    }
