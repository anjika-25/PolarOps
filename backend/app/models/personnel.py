from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Personnel(Base):
    __tablename__ = "personnel"

    person_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    role = Column(String(255), nullable=False)
    department = Column(String(255), nullable=False)
    contact = Column(String(100), nullable=True)
    emergency_contact = Column(String(100), nullable=True)
    training_status = Column(String(100), nullable=True)
    medical_clearance = Column(String(100), nullable=True)
    current_location = Column(String(255), nullable=False, index=True)
    expedition_id = Column(Integer, ForeignKey("expeditions.expedition_id", ondelete="SET NULL"), nullable=True, index=True)
    status = Column(String(50), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    expedition = relationship("Expedition", back_populates="personnel")
