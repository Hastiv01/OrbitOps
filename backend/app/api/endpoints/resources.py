from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from app.database.session import get_db
from app.repositories.infrastructure import InfrastructureRepository
from app.services.resource_intelligence import battery_prediction, resource_utilization
from app.services.resource_intelligence.inference import get_models

router = APIRouter()


class TelemetryInput(BaseModel):
    orbit_type: Optional[str] = "LEO"
    orbit_altitude_km: Optional[float] = 420
    inclination_deg: Optional[float] = 51
    current_battery_percent: float
    previous_battery_percent: Optional[float] = None
    solar_exposure_hours: Optional[float] = 3.0
    eclipse_duration_hours: Optional[float] = 1.2
    payload_count: Optional[int] = 2
    payload_power_kw: Optional[float] = 3.5
    communication_duration_minutes: Optional[float] = 30
    communication_bandwidth_mbps: Optional[float] = 150
    onboard_memory_used_gb: Optional[float] = 250
    onboard_memory_total_gb: Optional[float] = 512
    cpu_utilization_percent: Optional[float] = 50
    temperature_celsius: Optional[float] = 40
    mission_duration_hours: Optional[float] = 4
    previous_power_consumption_kw: Optional[float] = 3.0
    power_consumption_kw: Optional[float] = 3.2


@router.post("/predict-battery")
async def predict_battery(telemetry: TelemetryInput):
    """Predict end-of-mission battery percentage from raw telemetry.
    Powers ad-hoc 'what-if' battery predictions in the UI."""
    result = battery_prediction.predict(telemetry.dict())
    return result


@router.post("/forecast-battery")
async def forecast_battery(telemetry: TelemetryInput, hours: int = 12):
    """Hour-by-hour battery trajectory for the forecast charts."""
    points = battery_prediction.forecast(telemetry.dict(), hours=hours)
    return {"forecast": points}


@router.post("/predict-risk")
async def predict_risk(telemetry: TelemetryInput):
    """Classify current telemetry into LOW / MEDIUM / HIGH resource risk."""
    models = get_models()
    return models.predict_risk(telemetry.dict())


@router.get("/utilization")
async def get_utilization(db: AsyncSession = Depends(get_db)) -> Dict[str, Any]:
    """Fleet-wide resource utilization table + summary stats, used by the
    Resources dashboard. Combines live satellite/payload data with the
    trained battery + resource-risk models."""
    repo = InfrastructureRepository(db)
    satellites = await repo.get_satellites()
    payloads = await repo.get_payloads()

    payloads_by_satellite: Dict[str, list] = {}
    for p in payloads:
        payloads_by_satellite.setdefault(p.satellite_id, []).append(p)

    rows = resource_utilization.get_fleet_utilization(satellites, payloads_by_satellite)
    summary = resource_utilization.summarize_fleet(rows)

    return {"satellites": rows, "summary": summary}


@router.get("/utilization/{satellite_id}")
async def get_satellite_utilization(satellite_id: str, db: AsyncSession = Depends(get_db)):
    repo = InfrastructureRepository(db)
    sat = await repo.get_satellite_by_id(satellite_id)
    if not sat:
        raise HTTPException(status_code=404, detail="Satellite not found")
    payloads = [p for p in await repo.get_payloads() if p.satellite_id == satellite_id]
    return resource_utilization.get_utilization_for_satellite(sat, payloads)


@router.get("/model-status")
async def get_model_status():
    """Lets the frontend show whether it's running on trained models or
    the rule-based fallback (e.g. before the team has run the training
    scripts for the first time)."""
    models = get_models()
    return {
        "battery_model_loaded": models.available,
        "resource_model_loaded": models.available,
        "models_dir": models.models_dir,
    }
