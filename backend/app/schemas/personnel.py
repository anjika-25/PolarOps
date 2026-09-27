from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class PersonnelResponse(BaseModel):
    person_id: int
    name: str
    role: str
    department: str
    current_location: str
    expedition_id: Optional[int] = None
    expedition: Optional[str] = None
    contact: Optional[str] = None
    emergency_contact: Optional[str] = None
    training_status: Optional[str] = None
    medical_clearance: Optional[str] = None
    status: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
