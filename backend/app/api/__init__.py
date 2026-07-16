from fastapi import APIRouter
from app.api.endpoints import infrastructure, mission, telemetry, alerts, recommendations, resources

api_router = APIRouter()
api_router.include_router(infrastructure.router, prefix="/infrastructure", tags=["infrastructure"])
api_router.include_router(mission.router, prefix="/missions", tags=["missions"])
api_router.include_router(telemetry.router, prefix="/telemetry", tags=["telemetry"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["alerts"])
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["recommendations"])
api_router.include_router(resources.router, prefix="/resources", tags=["resources"])
