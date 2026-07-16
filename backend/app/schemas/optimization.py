from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class OptimizationRequest(BaseModel):
    strategy: str # Minimum Latency, Maximum Coverage, Balanced, Load Balancing, Minimum Cost, Energy Efficient
    mission_id: Optional[str] = None
    priority: Optional[str] = None
    constraints: Dict[str, Any] = {}

class StationResult(BaseModel):
    station_id: str
    station_name: str
    expected_latency: float
    coverage: float
    bandwidth: float
    expected_availability: float
    confidence_score: float

class RejectedStation(BaseModel):
    station_id: str
    station_name: str
    reason: str

class OptimizationResponse(BaseModel):
    best_station: StationResult
    alternative_stations: List[StationResult]
    rejected_stations: List[RejectedStation]
    execution_time_ms: float
    improvement_percentage: float
