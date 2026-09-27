from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.routes.auth import get_current_user, require_roles
from app.models.user import User
from app.models.emergency import EmergencyIncident
from app.schemas.emergency import EmergencyCreate, EmergencyResponse
from app.services.emergency_service import build_emergency_response

router = APIRouter(prefix="/api/emergency", tags=["Emergency Response"])

ALLOWED_TYPES = {"Medical", "Vehicle Failure", "Fire", "Severe Weather", "Missing Personnel"}
ALLOWED_SEVERITIES = {"Critical", "High", "Medium"}

@router.post("", response_model=EmergencyResponse, status_code=status.HTTP_201_CREATED)
def create_emergency_incident(
    payload: EmergencyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["ADMIN", "EMERGENCY_COORDINATOR"], "Only Emergency Coordinators and Admins can declare an emergency."))
):
    """
    Creates and persists a new Emergency Incident in PostgreSQL.
    """
    # Validate Type
    if payload.type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid emergency type. Must be one of: {', '.join(sorted(ALLOWED_TYPES))}"
        )

    # Validate Severity
    if payload.severity not in ALLOWED_SEVERITIES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid severity level. Must be one of: {', '.join(sorted(ALLOWED_SEVERITIES))}"
        )

    # Create Incident Record
    new_incident = EmergencyIncident(
        type=payload.type,
        location=payload.location.strip(),
        severity=payload.severity,
        affected_person=payload.affected_personnel.strip() if payload.affected_personnel else None,
        status="ACTIVE"
    )

    db.add(new_incident)
    db.commit()
    db.refresh(new_incident)

    return build_emergency_response(new_incident)


@router.get("", response_model=List[EmergencyResponse])
def get_emergency_incidents(
    status_filter: Optional[str] = Query(None, alias="status"),
    severity: Optional[str] = Query(None),
    type_filter: Optional[str] = Query(None, alias="type"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieves active and recent emergency incidents from PostgreSQL with optional filtering.
    """
    query = db.query(EmergencyIncident)

    if status_filter:
        query = query.filter(EmergencyIncident.status.iloclike(f"%{status_filter.strip()}%"))

    if severity:
        query = query.filter(EmergencyIncident.severity.iloclike(f"%{severity.strip()}%"))

    if type_filter:
        query = query.filter(EmergencyIncident.type.iloclike(f"%{type_filter.strip()}%"))

    incidents = query.order_by(EmergencyIncident.incident_id.desc()).all()

    return [build_emergency_response(inc) for inc in incidents]
