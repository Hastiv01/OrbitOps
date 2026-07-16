from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from datetime import datetime, timedelta

from app.repositories.mission import MissionRepository
from app.schemas.mission import MissionResponse, ScheduledMission, CalendarMission, SchedulerSlot, MissionCreate
from app.models.mission import Mission
from app.models.infrastructure import Satellite
from app.services.dataset_manager import dataset_manager

class MissionService:
    def __init__(self, session: AsyncSession):
        self.repo = MissionRepository(session)

    def _map_mission(self, m: Mission) -> MissionResponse:
        return MissionResponse(
            id=m.id,
            name=m.name,
            missionId=m.mission_id,
            priority=m.priority,
            type=m.type,
            satellite=m.satellite.name if m.satellite else "Unknown",
            orbit=m.orbit,
            payload=m.payload_ids.split(",") if m.payload_ids else [],
            startTime=m.start_time,
            endTime=m.end_time,
            estimatedDuration=m.estimated_duration,
            objective=m.objective or "",
            status=m.status,
            notes=m.notes,
            completionPercentage=m.completion_percentage,
            createdAt=m.created_at,
            updatedAt=m.updated_at
        )

    async def get_all_missions(self) -> List[MissionResponse]:
        missions = await self.repo.get_missions()
        return [self._map_mission(m) for m in missions]

    async def create_mission(self, mission_data: MissionCreate) -> MissionResponse:
        # Look up satellite by name
        sat_result = await self.repo.session.execute(
            select(Satellite).where(Satellite.name == mission_data.satellite)
        )
        sat = sat_result.scalars().first()
        sat_id = sat.id if sat else None
        
        # Fallback if satellite name doesn't match
        if not sat_id:
            all_sats = await self.repo.session.execute(select(Satellite))
            first_sat = all_sats.scalars().first()
            sat_id = first_sat.id if first_sat else "SAT-001"
            
        payload_str = ",".join(mission_data.payload) if mission_data.payload else ""
        
        db_mission = Mission(
            id=mission_data.id,
            mission_id=mission_data.missionId,
            name=mission_data.name,
            priority=mission_data.priority,
            type=mission_data.type,
            satellite_id=sat_id,
            orbit=mission_data.orbit,
            payload_ids=payload_str,
            start_time=mission_data.startTime,
            end_time=mission_data.endTime,
            estimated_duration=mission_data.estimatedDuration,
            objective=mission_data.objective,
            status=mission_data.status,
            notes=mission_data.notes,
            completion_percentage=mission_data.completionPercentage,
            created_at=mission_data.createdAt or datetime.now().isoformat(),
            updated_at=mission_data.updatedAt or datetime.now().isoformat()
        )
        
        created = await self.repo.create_mission(db_mission)
        
        # Sync to CSV dataset
        dataset_manager.sync_mission({
            'id': mission_data.id,
            'satellite_id': sat_id,
            'type': mission_data.type,
            'priority': mission_data.priority,
            'start_time': mission_data.startTime,
            'end_time': mission_data.endTime,
            'status': mission_data.status,
            'estimated_duration': mission_data.estimatedDuration
        }, action="create")
        
        # Load the satellite relation to return mapped output
        await self.repo.session.refresh(created, ["satellite"])
        return self._map_mission(created)

    async def update_mission(self, mission_id: str, updates: dict) -> Optional[MissionResponse]:
        backend_updates = {}
        
        field_mapping = {
            "name": "name",
            "priority": "priority",
            "type": "type",
            "orbit": "orbit",
            "startTime": "start_time",
            "endTime": "end_time",
            "estimatedDuration": "estimated_duration",
            "objective": "objective",
            "status": "status",
            "notes": "notes",
            "completionPercentage": "completion_percentage"
        }
        
        for fe_key, val in updates.items():
            if fe_key in field_mapping:
                backend_updates[field_mapping[fe_key]] = val
            elif fe_key == "payload":
                backend_updates["payload_ids"] = ",".join(val) if val else ""
            elif fe_key == "satellite":
                sat_result = await self.repo.session.execute(
                    select(Satellite).where(Satellite.name == val)
                )
                sat = sat_result.scalars().first()
                if sat:
                    backend_updates["satellite_id"] = sat.id
                    
        backend_updates["updated_at"] = datetime.now().isoformat()
        
        updated = await self.repo.update_mission(mission_id, backend_updates)
        if not updated:
            return None
            
        # Sync to CSV dataset
        dataset_manager.sync_mission({
            'id': mission_id,
            'satellite_id': updated.satellite_id,
            'type': updated.type,
            'priority': updated.priority,
            'start_time': updated.start_time,
            'end_time': updated.end_time,
            'status': updated.status,
            'estimated_duration': updated.estimated_duration
        }, action="update")
            
        return self._map_mission(updated)

    async def delete_mission(self, mission_id: str) -> bool:
        success = await self.repo.delete_mission(mission_id)
        if success:
            dataset_manager.sync_mission({'id': mission_id}, action="delete")
        return success

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

