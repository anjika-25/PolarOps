from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime

class CargoResponse(BaseModel):
    cargo_id: int
    cargo_name: str
    item: str
    category: str
    weight: float
    quantity: int
    origin: str
    destination: str
    current_location: str
    status: str
    priority: str
    expected_arrival: Optional[date] = None
    actual_arrival: Optional[date] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class InventoryResponse(BaseModel):
    item_id: int
    item_name: str
    item: str
    category: str
    quantity: float
    current_stock: float
    unit: str
    minimum_threshold: float
    minimum_required: float
    location: str
    consumption_rate: float
    status: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class InventoryUpdate(BaseModel):
    quantity: float = Field(..., ge=0, description="New non-negative inventory quantity")
