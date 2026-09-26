from sqlalchemy import Column, Integer, String, Date, DateTime, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Expedition(Base):
    __tablename__ = "expeditions"

    expedition_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    destination = Column(String(255), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    base = Column(String(255), nullable=False)
    leader = Column(String(255), nullable=False)
    phase = Column(String(100), nullable=False)
    status = Column(String(50), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    personnel = relationship("Personnel", back_populates="expedition")
