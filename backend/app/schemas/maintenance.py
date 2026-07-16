from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class MaintenanceRequestCreate(BaseModel):
    target_type: str
    target_id: str
    maintenance_type: str
    reason: str
    priority: str
    engineer: str
    estimated_duration: float

class MaintenanceRequestResponse(MaintenanceRequestCreate):
    id: str
    status: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
