from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional

from app.core.database import get_db
from app.routes.auth import get_current_user
from app.models.user import User
from app.models.personnel import Personnel
from app.models.expedition import Expedition
from app.schemas.personnel import PersonnelResponse

router = APIRouter(prefix="/api/personnel", tags=["Personnel"])

def map_personnel_to_response(p: Personnel) -> PersonnelResponse:
    """Helper to convert Personnel ORM model to PersonnelResponse schema with expedition name."""
    expedition_name = p.expedition.name if p.expedition else None
    return PersonnelResponse(
        person_id=p.person_id,
        name=p.name,
        role=p.role,
        department=p.department,
        current_location=p.current_location,
        expedition_id=p.expedition_id,
        expedition=expedition_name,
        contact=p.contact,
        emergency_contact=p.emergency_contact,
        training_status=p.training_status,
        medical_clearance=p.medical_clearance,
        status=p.status,
        created_at=p.created_at,
        updated_at=p.updated_at
    )

@router.get("", response_model=List[PersonnelResponse])
def get_all_personnel(
    expedition_id: Optional[int] = Query(None, description="Filter personnel by expedition ID"),
    location: Optional[str] = Query(None, description="Filter personnel by current location / camp"),
    status_filter: Optional[str] = Query(None, alias="status", description="Filter personnel by status (e.g. Active, In Transit, UNREACHABLE)"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns personnel records from the PostgreSQL database with optional filtering
    by expedition, location, and status.
    Requires authentication.
    """
    query = db.query(Personnel).options(joinedload(Personnel.expedition))

    if expedition_id is not None:
        query = query.filter(Personnel.expedition_id == expedition_id)
    
    if location is not None and location.strip():
        query = query.filter(Personnel.current_location.ilike(f"%{location.strip()}%"))
        
    if status_filter is not None and status_filter.strip():
        query = query.filter(Personnel.status.ilike(status_filter.strip()))

    personnel_list = query.order_by(Personnel.person_id.asc()).all()
    return [map_personnel_to_response(p) for p in personnel_list]

@router.get("/{person_id}", response_model=PersonnelResponse)
def get_personnel_by_id(
    person_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns the details of a single personnel record by ID.
    Returns 404 if the personnel ID does not exist.
    Requires authentication.
    """
    person = db.query(Personnel).options(
        joinedload(Personnel.expedition)
    ).filter(Personnel.person_id == person_id).first()

    if not person:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Personnel record with ID {person_id} not found"
        )

    return map_personnel_to_response(person)
