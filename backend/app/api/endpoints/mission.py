from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict, Any

from app.database.session import get_db
from app.schemas.mission import MissionResponse, ScheduledMission, CalendarMission, SchedulerSlot
from app.services.mission import MissionService

router = APIRouter()

@router.get("", response_model=List[MissionResponse])
async def get_missions(db: AsyncSession = Depends(get_db)):
    service = MissionService(db)
    return await service.get_all_missions()

@router.get("/schedule/today", response_model=List[ScheduledMission])
async def get_todays_schedule(db: AsyncSession = Depends(get_db)):
    service = MissionService(db)
    return await service.get_todays_schedule()

@router.get("/calendar", response_model=List[CalendarMission])
async def get_calendar_missions(db: AsyncSession = Depends(get_db)):
    service = MissionService(db)
    return await service.get_calendar_missions()

@router.get("/slots", response_model=List[SchedulerSlot])
async def get_scheduler_slots(db: AsyncSession = Depends(get_db)):
    service = MissionService(db)
    return await service.get_scheduler_slots()

@router.post("/optimize")
async def optimize_missions(db: AsyncSession = Depends(get_db)):
    service = MissionService(db)
    return await service.run_scheduler()
