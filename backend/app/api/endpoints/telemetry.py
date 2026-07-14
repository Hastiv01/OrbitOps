from fastapi import APIRouter
from typing import List, Dict

router = APIRouter()

@router.get("/{satellite_id}")
async def get_telemetry(satellite_id: str) -> List[Dict]:
    # Mocking data to match frontend's extendedMockData.ts generateTelemetryData
    data = []
    for i in range(23, -1, -1):
        data.append({
            "time": f"{23 - i:02d}:00",
            "battery": 80.0,
            "temperature": 40.0,
            "signalStrength": -45.0,
            "cpuUsage": 50.0,
            "memoryUsage": 60.0,
            "powerConsumption": 250.0
        })
    return data
