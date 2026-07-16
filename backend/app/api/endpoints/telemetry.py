import os
import pandas as pd
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from datetime import datetime
from app.services.dataset_manager import dataset_manager

router = APIRouter()

@router.get("/{satellite_id}")
async def get_telemetry(satellite_id: str) -> List[Dict]:
    file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../datasets/raw/telemetry.csv"))
    if not os.path.exists(file_path):
        return []
    
    try:
        df = pd.read_csv(file_path)
        # Filter for the satellite
        sat_df = df[df['satellite_id'] == satellite_id].copy()
        
        if sat_df.empty:
            return []
            
        # Sort by timestamp descending
        sat_df['timestamp'] = pd.to_datetime(sat_df['timestamp'])
        sat_df = sat_df.sort_values('timestamp', ascending=False)
        
        # Take the most recent 24 records to match frontend charting (usually hours or 15m intervals)
        recent_df = sat_df.head(24).copy()
        recent_df = recent_df.sort_values('timestamp', ascending=True) # Sort back for chron chart
        
        # Format for frontend
        data = []
        for _, row in recent_df.iterrows():
            data.append({
                "time": row['timestamp'].strftime("%H:%M"),
                "battery": float(row['battery_level_pct']),
                "temperature": float(row['temperature_c']),
                "signalStrength": float(row['signal_strength_dbm']),
                "powerConsumption": float(row['power_consumption_w']),
                "cpuUsage": 50.0, # Mocks if not in csv
                "memoryUsage": 60.0
            })
        return data
    except Exception as e:
        print(f"Error reading telemetry: {e}")
        raise HTTPException(status_code=500, detail="Error reading telemetry data")

@router.post("/{satellite_id}")
async def add_telemetry(satellite_id: str, data: Dict[str, Any]):
    try:
        record = {
            "timestamp": datetime.now().isoformat(),
            "satellite_id": satellite_id,
            "battery_level": data.get("battery", 100.0),
            "temperature": data.get("temperature", 20.0),
            "signal_strength": data.get("signalStrength", -70.0),
            "power_consumption": data.get("powerConsumption", 150.0)
        }
        dataset_manager.sync_telemetry(record)
        return {"status": "success", "message": "Telemetry added successfully"}
    except Exception as e:
        print(f"Error saving telemetry: {e}")
        raise HTTPException(status_code=500, detail="Error saving telemetry data")
