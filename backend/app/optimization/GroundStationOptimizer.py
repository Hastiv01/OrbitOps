import logging
import time
from typing import List, Dict, Any, Tuple
from app.models.infrastructure import GroundStation, Satellite
from app.schemas.optimization import StationResult, RejectedStation, OptimizationResponse

logger = logging.getLogger(__name__)

class GroundStationOptimizer:
    def __init__(self):
        pass
        
    def _is_weather_restricted(self, weather: str) -> bool:
        return weather.lower() in ['stormy', 'severe', 'hurricane']

    def _filter_stations(self, stations: List[GroundStation], constraints: Dict[str, Any]) -> Tuple[List[GroundStation], List[RejectedStation]]:
        available = []
        rejected = []
        
        # constraints could have 'avoid_bad_weather', 'high_availability_only', etc.
        avoid_bad_weather = constraints.get('avoid_bad_weather', False)
        high_availability_only = constraints.get('high_availability_only', False)

        for s in stations:
            if s.status.lower() in ['maintenance', 'offline']:
                rejected.append(RejectedStation(station_id=s.id, station_name=s.name, reason=f"Status is {s.status}"))
                continue
                
            if self._is_weather_restricted(s.weather) or (avoid_bad_weather and s.weather.lower() == 'rainy'):
                rejected.append(RejectedStation(station_id=s.id, station_name=s.name, reason=f"Weather restricted ({s.weather})"))
                continue
                
            if high_availability_only and s.availability < 0.95:
                rejected.append(RejectedStation(station_id=s.id, station_name=s.name, reason=f"Availability too low ({s.availability})"))
                continue
                
            # Mock bandwidth full or overloaded logic for now (could be based on connected_satellites vs antennas)
            if s.connected_satellites >= s.antennas:
                rejected.append(RejectedStation(station_id=s.id, station_name=s.name, reason="Overloaded / Bandwidth Full"))
                continue
                
            available.append(s)
            
        return available, rejected

    def _score_station(self, station: GroundStation, strategy: str) -> float:
        # Mocking some metrics based on station data
        latency_score = 100 - (station.connected_satellites * 5)
        availability_score = station.availability * 100
        coverage_score = station.antennas * 10
        weather_score = 100 if station.weather.lower() == 'clear' else (50 if station.weather.lower() == 'cloudy' else 20)
        load_score = 100 - ((station.connected_satellites / max(1, station.antennas)) * 100)
        cost_score = 100 - (station.connected_satellites * 10) # Mock
        energy_score = 100 - (station.antennas * 5) # Mock
        
        if strategy == 'Minimum Latency':
            return latency_score * 0.7 + availability_score * 0.3
        elif strategy == 'Maximum Coverage':
            return coverage_score * 0.7 + availability_score * 0.3
        elif strategy == 'Load Balancing':
            return load_score * 0.8 + latency_score * 0.2
        elif strategy == 'Minimum Cost':
            return cost_score * 0.8 + availability_score * 0.2
        elif strategy == 'Energy Efficient':
            return energy_score * 0.8 + availability_score * 0.2
        else:
            # Balanced
            return (latency_score + availability_score + coverage_score + weather_score + load_score) / 5

    def optimize(self, strategy: str, stations: List[GroundStation], constraints: Dict[str, Any]) -> OptimizationResponse:
        start_time = time.time()
        logger.info(f"Starting GroundStation optimization with strategy: {strategy}")
        
        available_stations, rejected_stations = self._filter_stations(stations, constraints)
        
        if not available_stations:
            logger.warning("No available ground stations after filtering.")
            # Return empty/fallback
            return OptimizationResponse(
                best_station=None,
                alternative_stations=[],
                rejected_stations=rejected_stations,
                execution_time_ms=(time.time() - start_time) * 1000,
                improvement_percentage=0.0
            )
            
        # Score remaining stations
        scored_stations = []
        for s in available_stations:
            score = self._score_station(s, strategy)
            
            # Map to StationResult
            # Mock calculations for expected_latency etc based on score
            expected_latency = max(10.0, 150.0 - score) 
            
            res = StationResult(
                station_id=s.id,
                station_name=s.name,
                expected_latency=expected_latency,
                coverage=min(100.0, score * 1.1),
                bandwidth=min(1000.0, score * 10),
                expected_availability=s.availability,
                confidence_score=min(100.0, score)
            )
            scored_stations.append((score, res))
            
        # Sort by score descending
        scored_stations.sort(key=lambda x: x[0], reverse=True)
        
        best = scored_stations[0][1]
        alternatives = [x[1] for x in scored_stations[1:4]] # Top 3 alternatives
        
        exec_time = (time.time() - start_time) * 1000
        
        return OptimizationResponse(
            best_station=best,
            alternative_stations=alternatives,
            rejected_stations=rejected_stations,
            execution_time_ms=exec_time,
            improvement_percentage=15.4 # Mock improvement
        )
