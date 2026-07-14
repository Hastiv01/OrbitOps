from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.database.session import get_db
from app.schemas.infrastructure import SatelliteResponse, PayloadResponse, GroundStationResponse
from app.services.infrastructure import InfrastructureService

router = APIRouter()

@router.get("/satellites", response_model=List[SatelliteResponse])
async def get_satellites(db: AsyncSession = Depends(get_db)):
    service = InfrastructureService(db)
    return await service.get_all_satellites()

@router.get("/payloads", response_model=List[PayloadResponse])
async def get_payloads(db: AsyncSession = Depends(get_db)):
    service = InfrastructureService(db)
    return await service.get_all_payloads()

@router.get("/ground-stations", response_model=List[GroundStationResponse])
async def get_ground_stations(db: AsyncSession = Depends(get_db)):
    service = InfrastructureService(db)
    return await service.get_all_ground_stations()
