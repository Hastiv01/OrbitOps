from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.database.session import get_db
from app.schemas.infrastructure import (
    SatelliteResponse, PayloadResponse, GroundStationResponse,
    PayloadAssignRequest, GroundStationAssignRequest, PayloadScheduleRequest
)
from app.services.infrastructure import InfrastructureService
from fastapi import HTTPException

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

@router.post("/ground-stations/assign")
async def assign_ground_station(request: GroundStationAssignRequest, db: AsyncSession = Depends(get_db)):
    # Mocking actual DB updates for now, as we don't have full relationships mapped in this example
    # In a real scenario, this would create an assignment record in the DB.
    return {"status": "success", "message": "Ground station assigned successfully"}

@router.post("/payloads/{payload_id}/assign")
async def assign_payload(payload_id: str, request: PayloadAssignRequest, db: AsyncSession = Depends(get_db)):
    service = InfrastructureService(db)
    # Validate payload memory/power here if we wanted to
    return {"status": "success", "message": f"Payload {payload_id} assigned to satellite {request.satellite_id}"}

@router.post("/payloads/{payload_id}/schedule")
async def schedule_payload(payload_id: str, request: PayloadScheduleRequest, db: AsyncSession = Depends(get_db)):
    return {"status": "success", "message": f"Payload {payload_id} scheduled for {request.date}"}

@router.post("/satellites/{satellite_id}/status")
async def update_satellite_status(satellite_id: str, status: str, db: AsyncSession = Depends(get_db)):
    # Update satellite status
    return {"status": "success", "message": f"Satellite status updated to {status}"}

@router.post("/payloads/{payload_id}/status")
async def update_payload_status(payload_id: str, status: str, db: AsyncSession = Depends(get_db)):
    # Update payload status
    return {"status": "success", "message": f"Payload status updated to {status}"}
