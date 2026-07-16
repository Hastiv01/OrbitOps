from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict, Any

from app.database.session import get_db
from app.repositories.infrastructure import InfrastructureRepository
from app.services.resource_intelligence import recommendation_engine
from app.services.ai.response_formatter import format_recommendations

router = APIRouter()

# Fallback used only if the database has no satellites yet (fresh install
# before seeding completes) so the Recommendations page never renders empty.
_STATIC_FALLBACK = [
    {
        "id": "REC-001",
        "title": "Optimize Task Order",
        "description": "Current task schedule has inefficient transitions.",
        "priority": "Medium",
        "category": "Scheduling",
        "suggestedAction": "Reorder tasks to minimize power consumption",
        "status": "New",
        "createdAt": "2026-07-14T12:00:00Z",
    }
]


@router.get("")
async def get_recommendations(db: AsyncSession = Depends(get_db)) -> List[Dict[str, Any]]:
    repo = InfrastructureRepository(db)
    satellites = await repo.get_satellites()
    if not satellites:
        return _STATIC_FALLBACK

    payloads = await repo.get_payloads()
    payloads_by_satellite: Dict[str, list] = {}
    for p in payloads:
        payloads_by_satellite.setdefault(p.satellite_id, []).append(p)

    recs = recommendation_engine.generate_fleet_recommendations(satellites, payloads_by_satellite)
    if not recs:
        return _STATIC_FALLBACK

    return format_recommendations(recs)


@router.get("/satellite/{satellite_id}")
async def get_recommendations_for_satellite(satellite_id: str, db: AsyncSession = Depends(get_db)):
    repo = InfrastructureRepository(db)
    sat = await repo.get_satellite_by_id(satellite_id)
    if not sat:
        return []
    payloads = [p for p in await repo.get_payloads() if p.satellite_id == satellite_id]
    recs = recommendation_engine.generate_for_satellite(sat, payloads)
    return format_recommendations(recs)
