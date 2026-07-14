from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional

from app.models.infrastructure import Satellite, Payload, GroundStation

class InfrastructureRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_satellites(self) -> List[Satellite]:
        result = await self.session.execute(select(Satellite))
        return result.scalars().all()

    async def get_satellite_by_id(self, sat_id: str) -> Optional[Satellite]:
        result = await self.session.execute(select(Satellite).where(Satellite.id == sat_id))
        return result.scalars().first()

    async def get_payloads(self) -> List[Payload]:
        result = await self.session.execute(select(Payload))
        return result.scalars().all()
        
    async def get_ground_stations(self) -> List[GroundStation]:
        result = await self.session.execute(select(GroundStation))
        return result.scalars().all()

    async def create_satellite(self, satellite: Satellite) -> Satellite:
        self.session.add(satellite)
        await self.session.commit()
        await self.session.refresh(satellite)
        return satellite
