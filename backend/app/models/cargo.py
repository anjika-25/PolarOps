from sqlalchemy import Column, Integer, String, Numeric, Date, DateTime, func
from app.core.database import Base

class Cargo(Base):
    __tablename__ = "cargo"

    cargo_id = Column(Integer, primary_key=True, index=True)
    cargo_name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    weight = Column(Numeric(10, 2), nullable=False)
    quantity = Column(Integer, nullable=False)
    origin = Column(String(255), nullable=False)
    destination = Column(String(255), nullable=False, index=True)
    current_location = Column(String(255), nullable=False)
    status = Column(String(50), nullable=False, index=True)
    priority = Column(String(50), nullable=False, index=True)
    expected_arrival = Column(Date, nullable=True)
    actual_arrival = Column(Date, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
