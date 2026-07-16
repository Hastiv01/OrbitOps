from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.database.session import get_db
from app.schemas.maintenance import MaintenanceRequestCreate, MaintenanceRequestResponse
import uuid
import datetime

router = APIRouter()

@router.post("/request", response_model=MaintenanceRequestResponse)
async def request_maintenance(request: MaintenanceRequestCreate, db: AsyncSession = Depends(get_db)):
    # Mock database storage
    response = MaintenanceRequestResponse(
        id=str(uuid.uuid4()),
        target_type=request.target_type,
        target_id=request.target_id,
        maintenance_type=request.maintenance_type,
        reason=request.reason,
        priority=request.priority,
        engineer=request.engineer,
        estimated_duration=request.estimated_duration,
        status="Pending",
        created_at=datetime.datetime.utcnow()
    )
    # Here we would normally save to db
    return response
