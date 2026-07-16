import os
import pandas as pd
from app.ml.predictions import predict_battery
import random
import uuid
from datetime import datetime

def generate_recommendations():
    """Generates recommendations based on ML predictions and dataset constraints."""
    sat_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../datasets/raw/satellites.csv"))
    
    if not os.path.exists(sat_path):
        return []
        
    sats_df = pd.read_csv(sat_path)
    active_sats = sats_df[sats_df['status'] == 'Active']['satellite_id'].tolist()
    
    recs = []
    
    for sat_id in active_sats:
        # Check battery prediction
        bat_pred = predict_battery(sat_id, hours_ahead=24)
        if "error" not in bat_pred:
            if bat_pred["risk_level"] == "Critical":
                recs.append({
                    "id": str(uuid.uuid4()),
                    "type": "Warning",
                    "title": f"Critical Battery on {sat_id}",
                    "description": f"Predicted battery level dropping to {bat_pred['predicted_battery_end']:.1f}% within 24 hours.",
                    "priority": "High",
                    "timestamp": datetime.now().isoformat(),
                    "actionRequired": "Reschedule payloads to preserve power."
                })
            elif bat_pred["risk_level"] == "Medium":
                recs.append({
                    "id": str(uuid.uuid4()),
                    "type": "Optimization",
                    "title": f"Power optimization for {sat_id}",
                    "description": "Battery usage is trending high.",
                    "priority": "Medium",
                    "timestamp": datetime.now().isoformat(),
                    "actionRequired": "Review power-intensive payloads."
                })
                
    # Check for maintenance issues
    maintenance_sats = sats_df[sats_df['status'] == 'Maintenance']
    for _, row in maintenance_sats.iterrows():
        recs.append({
            "id": str(uuid.uuid4()),
            "type": "Alert",
            "title": f"Maintenance Required: {row['satellite_id']}",
            "description": f"{row['name']} is currently in maintenance status.",
            "priority": "Critical",
            "timestamp": datetime.now().isoformat(),
            "actionRequired": "Deploy ground crew or run diagnostic tests."
        })
        
    return recs
