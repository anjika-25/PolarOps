from sqlalchemy import Column, Integer, String, Date, DateTime, func
from app.core.database import Base

class Asset(Base):
    __tablename__ = "assets"

    asset_id = Column(Integer, primary_key=True, index=True)
    asset_name = Column(String(255), nullable=False)
    asset_type = Column(String(100), nullable=False, index=True)
    condition = Column(String(100), nullable=False)
    current_location = Column(String(255), nullable=False, index=True)
    assigned_team = Column(String(255), nullable=True)
    last_maintenance = Column(Date, nullable=True)
    next_maintenance = Column(Date, nullable=True, index=True)
    status = Column(String(50), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
