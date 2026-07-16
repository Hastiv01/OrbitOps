from sqlalchemy import Column, String, Float, DateTime
from app.database.base import Base
import datetime

class MaintenanceRequest(Base):
    __tablename__ = "maintenance_requests"
    
    id = Column(String, primary_key=True, index=True)
    target_type = Column(String, nullable=False) # 'Satellite', 'Payload', 'GroundStation'
    target_id = Column(String, nullable=False)
    maintenance_type = Column(String, nullable=False)
    reason = Column(String, nullable=False)
    priority = Column(String, nullable=False)
    engineer = Column(String, nullable=False)
    estimated_duration = Column(Float, nullable=False)
    status = Column(String, nullable=False, default='Pending') # Pending, In Progress, Completed, Cancelled
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
