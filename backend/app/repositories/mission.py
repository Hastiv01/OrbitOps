from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from typing import List, Optional

from app.models.mission import Mission
from app.models.infrastructure import Satellite

class MissionRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_missions(self) -> List[Mission]:
        result = await self.session.execute(
            select(Mission).options(joinedload(Mission.satellite))
        )
        return result.scalars().all()

    async def get_mission_by_id(self, mission_id: str) -> Optional[Mission]:
        result = await self.session.execute(
            select(Mission).where(Mission.id == mission_id).options(joinedload(Mission.satellite))
        )
        return result.scalars().first()

    async def create_mission(self, mission: Mission) -> Mission:
        self.session.add(mission)
        await self.session.commit()
        await self.session.refresh(mission)
        return mission

    async def update_mission(self, mission_id: str, updates: dict) -> Optional[Mission]:
        result = await self.session.execute(
            select(Mission).where(Mission.id == mission_id).options(joinedload(Mission.satellite))
        )
        db_mission = result.scalars().first()
        if not db_mission:
            return None
            
        for key, value in updates.items():
            if hasattr(db_mission, key):
                setattr(db_mission, key, value)
                
        await self.session.commit()
        await self.session.refresh(db_mission)
        return db_mission

    async def delete_mission(self, mission_id: str) -> bool:
        result = await self.session.execute(
            select(Mission).where(Mission.id == mission_id)
        )
        db_mission = result.scalars().first()
        if not db_mission:
            return False
            
        await self.session.delete(db_mission)
        await self.session.commit()
        return True

