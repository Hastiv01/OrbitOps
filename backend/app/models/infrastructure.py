from sqlalchemy import Column, String, Float, Integer, ForeignKey, ARRAY
from sqlalchemy.orm import relationship
from app.database.base import Base

class Satellite(Base):
    __tablename__ = "satellites"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    status = Column(String, nullable=False)  # Active, Inactive, Maintenance, Decommissioned
    orbit = Column(String, nullable=False)   # LEO, MEO, GEO
    altitude = Column(Float, nullable=False)
    inclination = Column(Float, nullable=False)
    battery_health = Column(Float, nullable=False)
    temperature = Column(Float, nullable=False)
    last_update = Column(String, nullable=False)
    ground_station_ids = Column(String, nullable=True) # Comma-separated ground station IDs
    
    # Relationships
    payloads = relationship("Payload", back_populates="satellite", lazy="selectin")

class Payload(Base):
    __tablename__ = "payloads"
    
    id = Column(String, primary_key=True, index=True)
    satellite_id = Column(String, ForeignKey("satellites.id"), nullable=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)    # Camera, Radar, Thermal Sensor, Spectrometer, Communication
    status = Column(String, nullable=False)  # Active, Standby, Error, Maintenance
    power_consumption = Column(Float, nullable=False)
    memory_usage = Column(Float, nullable=False)
    temperature = Column(Float, nullable=False)
    data_rate = Column(Float, nullable=False)
    last_data_transfer = Column(String, nullable=False)
    
    # Relationships
    satellite = relationship("Satellite", back_populates="payloads", lazy="selectin")

class GroundStation(Base):
    __tablename__ = "ground_stations"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    country = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    status = Column(String, nullable=False)  # Operational, Maintenance, Offline
    connected_satellites = Column(Integer, default=0)
    availability = Column(Float, nullable=False)
    weather = Column(String, nullable=False) # Clear, Cloudy, Rainy, Stormy
    antennas = Column(Integer, nullable=False)
    frequency = Column(String, nullable=False)
