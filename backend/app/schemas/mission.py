from pydantic import BaseModel, ConfigDict
from typing import List, Optional

class MissionBase(BaseModel):
    id: str
    name: str
    missionId: str
    priority: str
    type: str
    satellite: str  # Frontend expects satellite name, not ID
    orbit: str
    payload: List[str]
    startTime: str
    endTime: str
    estimatedDuration: int
    objective: str
    status: str
    notes: Optional[str] = None
    completionPercentage: int
    createdAt: str
    updatedAt: str

class MissionCreate(MissionBase):
    pass

class MissionResponse(MissionBase):
    model_config = ConfigDict(from_attributes=True)

class ScheduledMission(BaseModel):
    id: str
    mission: str
    satellite: str
    start: str
    end: str
    priority: str
    status: str

class CalendarMission(BaseModel):
    id: str
    name: str
    date: str
    priority: str
    satellite: str
    status: str

class SchedulerSlot(BaseModel):
    id: str
    missionName: str
    satellite: str
    startHour: int
    durationHours: int
    priority: str
    hasConflict: bool
    conflictWith: Optional[str] = None
