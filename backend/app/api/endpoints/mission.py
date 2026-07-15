from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict, Any

from app.database.session import get_db
from app.schemas.mission import MissionResponse, ScheduledMission, CalendarMission, SchedulerSlot, MissionCreate
from app.services.mission import MissionService

router = APIRouter()

@router.get("", response_model=List[MissionResponse])
async def get_missions(db: AsyncSession = Depends(get_db)):
    service = MissionService(db)
    return await service.get_all_missions()

@router.post("", response_model=MissionResponse)
async def create_mission(mission_data: MissionCreate, db: AsyncSession = Depends(get_db)):
    service = MissionService(db)
    return await service.create_mission(mission_data)

@router.put("/{mission_id}", response_model=MissionResponse)
async def update_mission(mission_id: str, updates: Dict[str, Any], db: AsyncSession = Depends(get_db)):
    service = MissionService(db)
    updated = await service.update_mission(mission_id, updates)
    if not updated:
        raise HTTPException(status_code=404, detail="Mission not found")
    return updated

@router.delete("/{mission_id}")
async def delete_mission(mission_id: str, db: AsyncSession = Depends(get_db)):
    service = MissionService(db)
    success = await service.delete_mission(mission_id)
    if not success:
        raise HTTPException(status_code=404, detail="Mission not found")
    return {"status": "success", "message": "Mission deleted"}

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
