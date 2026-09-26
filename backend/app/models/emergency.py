from sqlalchemy import Column, Integer, String, Text, DateTime, func
from app.core.database import Base

class EmergencyIncident(Base):
    __tablename__ = "emergency_incidents"

    incident_id = Column(Integer, primary_key=True, index=True)
    type = Column(String(100), nullable=False)
    severity = Column(String(50), nullable=False, index=True)
    location = Column(String(255), nullable=False)
    affected_person = Column(String(255), nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    status = Column(String(50), nullable=False, index=True)
    response_team = Column(String(255), nullable=True)
    resolution = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
