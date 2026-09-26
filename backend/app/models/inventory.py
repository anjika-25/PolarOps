from sqlalchemy import Column, Integer, String, Numeric, DateTime, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Inventory(Base):
    __tablename__ = "inventory"

    item_id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False, index=True)
    quantity = Column(Numeric(10, 2), nullable=False)
    unit = Column(String(50), nullable=False)
    minimum_threshold = Column(Numeric(10, 2), nullable=False)
    location = Column(String(255), nullable=False, index=True)
    consumption_rate = Column(Numeric(10, 2), default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    usage_history = relationship("InventoryUsageHistory", back_populates="inventory_item", cascade="all, delete-orphan")
