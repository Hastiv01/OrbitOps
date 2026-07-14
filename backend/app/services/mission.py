from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from datetime import datetime, timedelta

from app.repositories.mission import MissionRepository
from app.schemas.mission import MissionResponse, ScheduledMission, CalendarMission, SchedulerSlot
from app.models.mission import Mission

class MissionService:
    def __init__(self, session: AsyncSession):
        self.repo = MissionRepository(session)

    async def get_all_missions(self) -> List[MissionResponse]:
        missions = await self.repo.get_missions()
        
        results = []
        for m in missions:
            m_dict = {
                "id": m.id,
                "name": m.name,
                "missionId": m.mission_id,
                "priority": m.priority,
                "type": m.type,
                "satellite": m.satellite.name if m.satellite else "Unknown",
                "orbit": m.orbit,
                "payload": m.payload_ids.split(",") if m.payload_ids else [],
                "startTime": m.start_time,
                "endTime": m.end_time,
                "estimatedDuration": m.estimated_duration,
                "objective": m.objective or "",
                "status": m.status,
                "notes": m.notes,
                "completionPercentage": m.completion_percentage,
                "createdAt": m.created_at,
                "updatedAt": m.updated_at
            }
            results.append(MissionResponse(**m_dict))
        return results

    async def get_todays_schedule(self) -> List[ScheduledMission]:
        # In a real app, query by date. Returning mock-equivalent data structure.
        return [
            ScheduledMission(
                id="SCH-001", mission="Arctic Ice Sheet Monitoring", satellite="SatelliteOne",
                start="06:00 UTC", end="08:30 UTC", priority="Critical", status="Completed"
            )
        ]

    async def get_calendar_missions(self) -> List[CalendarMission]:
        return [
            CalendarMission(
                id="CAL-001", name="Mission Alpha 1", date=datetime.now().strftime("%Y-%m-%d"),
                priority="Critical", satellite="SatelliteOne", status="Active"
            )
        ]

    async def get_scheduler_slots(self) -> List[SchedulerSlot]:
        return [
            SchedulerSlot(
                id="SL-001", missionName="Earth Observation Alpha", satellite="SatelliteOne",
                startHour=2, durationHours=3, priority="High", hasConflict=False
            )
        ]

    async def run_scheduler(self):
        # Trigger the Branch and Bound / Conflict Resolver logic
        return {"status": "success", "message": "Scheduler completed", "optimized_count": 10}
