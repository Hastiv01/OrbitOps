from fastapi import APIRouter
from typing import List, Dict

router = APIRouter()

@router.get("")
async def get_recommendations() -> List[Dict]:
    return [
        {
            "id": "REC-001",
            "title": "Optimize Task Order",
            "description": "Current task schedule has inefficient transitions.",
            "priority": "Medium",
            "category": "Scheduling",
            "suggestedAction": "Reorder tasks to minimize power consumption",
            "status": "New",
            "createdAt": "2026-07-14T12:00:00Z"
        }
    ]
