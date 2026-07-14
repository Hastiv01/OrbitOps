from fastapi import APIRouter
from typing import List, Dict

router = APIRouter()

@router.get("")
async def get_alerts() -> List[Dict]:
    return [
        {
            "id": "ALT-001", 
            "type": "Battery Low", 
            "severity": "Critical", 
            "title": "Battery Critical — SAT-008", 
            "message": "SatelliteEight battery at 15%. Immediate action required.",
            "satellite": "SatelliteEight",
            "timestamp": "2026-07-14T12:00:00Z",
            "acknowledged": False
        }
    ]
