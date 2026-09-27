from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class AssetResponse(BaseModel):
    asset_id: int
    asset_name: str
    equipment: str
    asset_type: str
    location: str
    current_location: str
    condition: str
    assigned_team: Optional[str] = None
    last_maintenance: Optional[date] = None
    next_maintenance: Optional[date] = None
    maintenance_due: Optional[date] = None
    status: str
    maintenance_status: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
