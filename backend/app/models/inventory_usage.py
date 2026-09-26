from sqlalchemy import Column, Integer, Numeric, Date, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class InventoryUsageHistory(Base):
    __tablename__ = "inventory_usage_history"

    usage_id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("inventory.item_id", ondelete="CASCADE"), nullable=False, index=True)
    date = Column(Date, nullable=False, index=True)
    quantity_used = Column(Numeric(10, 2), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    inventory_item = relationship("Inventory", back_populates="usage_history")
