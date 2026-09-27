from pydantic import BaseModel
from typing import List, Optional
from datetime import date

class UsageHistoryItem(BaseModel):
    date: date
    quantity_used: float

    class Config:
        from_attributes = True

class InventoryPredictionResponse(BaseModel):
    item_id: int
    item_name: str
    location: str
    unit: str
    current_stock: float
    minimum_required_stock: float
    average_daily_usage: float
    estimated_days_remaining: Optional[float] = None
    prediction_status: str
    usage_history: List[UsageHistoryItem]

    class Config:
        from_attributes = True
