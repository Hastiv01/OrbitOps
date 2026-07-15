from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.repositories.infrastructure import InfrastructureRepository
from app.schemas.infrastructure import SatelliteResponse, PayloadResponse, GroundStationResponse

class InfrastructureService:
    def __init__(self, session: AsyncSession):
        self.repo = InfrastructureRepository(session)

    async def get_all_satellites(self) -> List[SatelliteResponse]:
        satellites = await self.repo.get_satellites()
        
        results = []
        for sat in satellites:
            # Map Python snake_case to Frontend camelCase
            sat_dict = {
                "id": sat.id,
                "name": sat.name,
                "status": sat.status,
                "orbit": sat.orbit,
                "altitude": sat.altitude,
                "inclination": sat.inclination,
                "batteryHealth": sat.battery_health,
                "temperature": sat.temperature,
                "lastUpdate": sat.last_update,
                "groundStations": sat.ground_station_ids.split(",") if sat.ground_station_ids else [],
                "currentPayloads": [p.id for p in sat.payloads]
            }
            results.append(SatelliteResponse(**sat_dict))
        return results

    async def get_all_payloads(self) -> List[PayloadResponse]:
        payloads = await self.repo.get_payloads()
        results = []
        for p in payloads:
            p_dict = {
                "id": p.id,
                "name": p.name,
                "type": p.type,
                "status": p.status,
                "powerConsumption": p.power_consumption,
                "memoryUsage": p.memory_usage,
                "temperature": p.temperature,
                "dataRate": p.data_rate,
                "lastDataTransfer": p.last_data_transfer
            }
            results.append(PayloadResponse(**p_dict))
        return results
        
    async def get_all_ground_stations(self) -> List[GroundStationResponse]:
        stations = await self.repo.get_ground_stations()
        results = []
        for station in stations:
            station_dict = {
                "id": station.id,
                "name": station.name,
                "country": station.country,
                "latitude": station.latitude,
                "longitude": station.longitude,
                "status": station.status,
                "connectedSatellites": station.connected_satellites,
                "availability": station.availability,
                "weather": station.weather,
                "antennas": station.antennas,
                "frequency": station.frequency
            }
            results.append(GroundStationResponse(**station_dict))
        return results
