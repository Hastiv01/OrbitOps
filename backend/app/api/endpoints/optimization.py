from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.database.session import get_db
from app.schemas.optimization import OptimizationRequest, OptimizationResponse
from app.services.infrastructure import InfrastructureService
from app.optimization.GroundStationOptimizer import GroundStationOptimizer

router = APIRouter()

@router.post("/ground-stations", response_model=OptimizationResponse)
async def optimize_ground_stations(request: OptimizationRequest, db: AsyncSession = Depends(get_db)):
    # 1. Fetch data
    infra_service = InfrastructureService(db)
    # We need internal DB models for the optimizer, get_all_ground_stations returns schemas.
    # Let's use the repo directly to get models
    stations = await infra_service.repo.get_ground_stations()
    
    # 2. Run optimizer
    optimizer = GroundStationOptimizer()
    response = optimizer.optimize(
        strategy=request.strategy,
        stations=stations,
        constraints=request.constraints
    )
    
    if response.best_station is None:
        raise HTTPException(status_code=404, detail="No valid ground stations available under current constraints.")
        
    return response
