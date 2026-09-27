from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class EmergencyCreate(BaseModel):
    type: str = Field(..., description="Medical, Vehicle Failure, Fire, Severe Weather, Missing Personnel")
    location: str = Field(..., description="Incident location (e.g. Maitri Station, Bharati Station)")
    severity: str = Field(..., description="Critical, High, Medium")
    affected_personnel: Optional[str] = Field(None, description="Affected personnel name or details")

class ChecklistStatus(BaseModel):
    incident_created: bool = True
    team_notified: bool = False
    vehicle_assigned: bool = False

class ResponseResource(BaseModel):
    resource_id: str
    name: str
    type: str
    base_location: str
    distance_km: float
    status: str
    estimated_eta: str

class EmergencyResponse(BaseModel):
    incident_id: int
    type: str
    location: str
    severity: str
    status: str
    affected_personnel: Optional[str] = None
    created_at: Optional[datetime] = None
    checklist: ChecklistStatus
    response_resources: List[ResponseResource]

    class Config:
        from_attributes = True
