from sqlalchemy import Column, String, Float, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database.base import Base

class Mission(Base):
    __tablename__ = "missions"
    
    id = Column(String, primary_key=True, index=True)
    mission_id = Column(String, unique=True, index=True)
    name = Column(String, nullable=False)
    priority = Column(String, nullable=False) # Low, Medium, High, Critical
    type = Column(String, nullable=False)     # Earth Observation, Communication, Navigation, Scientific
    satellite_id = Column(String, ForeignKey("satellites.id"))
    orbit = Column(String, nullable=False)
    # Payload association: in a real relational DB, this should be a many-to-many table. 
    # For simplicity matching the mock, we can store it as a comma-separated string or Postgres ARRAY. 
    # Using a comma separated string for simple SQLite/Postgres cross compatibility without ARRAY type.
    payload_ids = Column(String, nullable=False)
    
    start_time = Column(String, nullable=False)
    end_time = Column(String, nullable=False)
    estimated_duration = Column(Integer, nullable=False) # minutes
    objective = Column(String, nullable=True)
    status = Column(String, nullable=False) # Planning, Scheduled, Active, Completed, Failed, Paused
    notes = Column(String, nullable=True)
    completion_percentage = Column(Integer, default=0)
    created_at = Column(String, nullable=False)
    updated_at = Column(String, nullable=False)

    # Relationships
    satellite = relationship("Satellite", lazy="selectin")
