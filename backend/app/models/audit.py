from sqlalchemy import Column, String, Float, DateTime
from app.database.base import Base
import datetime

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(String, primary_key=True, index=True)
    user = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    action = Column(String, nullable=False)
    module = Column(String, nullable=False)
    old_value = Column(String, nullable=True)
    new_value = Column(String, nullable=True)
    execution_time = Column(Float, nullable=True)
    status = Column(String, nullable=False)
