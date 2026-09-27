from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime

class KPICardData(BaseModel):
    active_expeditions: int
    total_personnel: int
    total_cargo: int
    active_alerts: int

class ExpeditionItem(BaseModel):
    expedition_id: int
    name: str
    destination: str
    start_date: date
    end_date: date
    base: str
    leader: str
    phase: str
    status: str

    class Config:
        from_attributes = True

class AlertItem(BaseModel):
    id: str
    category: str
    title: str
    description: str
    severity: str
    location: str
    timestamp: Optional[str] = None

class DashboardSummaryResponse(BaseModel):
    kpis: KPICardData
    expeditions: List[ExpeditionItem]
    alerts: List[AlertItem]
