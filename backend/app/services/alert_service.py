from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.inventory import Inventory
from app.schemas.dashboard import AlertItem

def create_low_stock_alert_item(item: Inventory) -> AlertItem:
    """
    Constructs a standardized AlertItem object for a low-stock inventory record.
    """
    qty = float(item.quantity)
    thresh = float(item.minimum_threshold)
    
    return AlertItem(
        id=f"inventory-low-{item.item_id}",
        category="INVENTORY",
        title=f"Low Stock: {item.item_name} at {item.location}",
        description=f"Current stock of {item.item_name} ({qty:g} {item.unit}) at {item.location} is below minimum threshold of {thresh:g} {item.unit}.",
        severity="HIGH",
        location=item.location,
        timestamp=item.updated_at.isoformat() if item.updated_at else None
    )

def evaluate_inventory_item(db: Session, item: Inventory) -> Optional[AlertItem]:
    """
    Evaluates an updated inventory item against its minimum threshold.
    Returns an AlertItem if quantity < minimum_threshold, or None if quantity >= minimum_threshold.
    Condition is strictly quantity < minimum_threshold.
    """
    qty = float(item.quantity)
    thresh = float(item.minimum_threshold)

    if qty < thresh:
        return create_low_stock_alert_item(item)
    return None

def get_active_low_stock_alerts(db: Session) -> List[AlertItem]:
    """
    Retrieves all active low-stock alerts from PostgreSQL where inventory quantity < minimum_threshold.
    Ensures each item produces at most one unique active low-stock alert.
    """
    low_stock_items = db.query(Inventory).filter(
        Inventory.quantity < Inventory.minimum_threshold
    ).order_by(Inventory.item_id.asc()).all()

    return [create_low_stock_alert_item(item) for item in low_stock_items]
