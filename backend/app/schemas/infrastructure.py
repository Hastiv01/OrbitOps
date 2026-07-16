from pydantic import BaseModel, ConfigDict
from typing import List, Optional

class PayloadBase(BaseModel):
    id: str
    name: str
    type: str
    status: str
    power_consumption: float
    memory_usage: float
    temperature: float
    data_rate: float
    last_data_transfer: str

class PayloadCreate(PayloadBase):
    satellite_id: Optional[str] = None

class PayloadResponse(BaseModel):
    id: str
    name: str
    type: str
    status: str
    powerConsumption: float
    memoryUsage: float
    temperature: float
    dataRate: float
    lastDataTransfer: str

    model_config = ConfigDict(from_attributes=True)

class SatelliteBase(BaseModel):
    id: str
    name: str
    status: str
    orbit: str
    altitude: float
    inclination: float
    batteryHealth: float
    temperature: float
    lastUpdate: str
    
class SatelliteCreate(SatelliteBase):
    pass

class SatelliteResponse(SatelliteBase):
    groundStations: List[str] = []
    currentPayloads: List[str] = []
    
    model_config = ConfigDict(from_attributes=True)

class GroundStationBase(BaseModel):
    id: str
    name: str
    country: str
    latitude: float
    longitude: float
    status: str
    connectedSatellites: int
    availability: float
    weather: str
    antennas: int
    frequency: str

class GroundStationCreate(GroundStationBase):
    pass

class GroundStationResponse(GroundStationBase):
    model_config = ConfigDict(from_attributes=True)

class PayloadAssignRequest(BaseModel):
    satellite_id: str

class PayloadScheduleRequest(BaseModel):
    satellite_id: str
    mission_id: str
    date: str
    start_time: str
    end_time: str
    priority: str

class GroundStationAssignRequest(BaseModel):
    mission_id: str
    satellite_id: str
    time_window_start: str
    time_window_end: str
    priority: str

