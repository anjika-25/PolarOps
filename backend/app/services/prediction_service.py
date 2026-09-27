from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import timedelta
from typing import Optional
from app.models.inventory import Inventory
from app.models.inventory_usage import InventoryUsageHistory
from app.schemas.inventory_usage import InventoryPredictionResponse, UsageHistoryItem

def calculate_inventory_prediction(db: Session, item_id: int) -> Optional[InventoryPredictionResponse]:
    """
    Calculates 7-day average daily usage and estimated days remaining for an inventory item.
    Uses the 7-day date window ending on the item's most recent stored usage date.
    Formula: Estimated Days Remaining = (Current Stock - Minimum Required Stock) / Average Daily Usage
    """
    # 1. Fetch Inventory Item
    item = db.query(Inventory).filter(Inventory.item_id == item_id).first()
    if not item:
        return None

    current_stock = float(item.quantity)
    minimum_required_stock = float(item.minimum_threshold)

    # 2. Determine Most Recent Usage Date for this Item
    max_date = (
        db.query(func.max(InventoryUsageHistory.date))
        .filter(InventoryUsageHistory.item_id == item_id)
        .scalar()
    )

    if max_date is None:
        usage_history = []
    else:
        # Define the 7-day date window ending on max_date (inclusive: [max_date - 6 days, max_date])
        start_date = max_date - timedelta(days=6)
        history_records = (
            db.query(InventoryUsageHistory)
            .filter(
                InventoryUsageHistory.item_id == item_id,
                InventoryUsageHistory.date >= start_date,
                InventoryUsageHistory.date <= max_date
            )
            .order_by(InventoryUsageHistory.date.desc())
            .all()
        )

        usage_history = [
            UsageHistoryItem(date=rec.date, quantity_used=float(rec.quantity_used))
            for rec in history_records
        ]

    # 3. Calculate Average Daily Usage within the 7-day date window
    if not usage_history:
        average_daily_usage = 0.0
    else:
        total_usage = sum(h.quantity_used for h in usage_history)
        average_daily_usage = round(total_usage / len(usage_history), 1)

    # 4. Calculate Estimated Days Remaining & Prediction Status
    if current_stock <= minimum_required_stock:
        estimated_days_remaining = 0.0
        prediction_status = "Stock at or below minimum threshold"
    elif average_daily_usage <= 0:
        estimated_days_remaining = None
        prediction_status = "Insufficient usage data"
    else:
        net_available = current_stock - minimum_required_stock
        estimated_days_remaining = round(net_available / average_daily_usage, 1)
        prediction_status = "Depletion estimate calculated"

    return InventoryPredictionResponse(
        item_id=item.item_id,
        item_name=item.item_name,
        location=item.location,
        unit=item.unit,
        current_stock=current_stock,
        minimum_required_stock=minimum_required_stock,
        average_daily_usage=average_daily_usage,
        estimated_days_remaining=estimated_days_remaining,
        prediction_status=prediction_status,
        usage_history=usage_history
    )
