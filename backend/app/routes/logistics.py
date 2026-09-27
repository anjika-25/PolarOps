from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.routes.auth import get_current_user
from app.models.user import User
from app.models.cargo import Cargo
from app.schemas.logistics import CargoResponse

router = APIRouter(prefix="/api/cargo", tags=["Cargo"])

def map_cargo_to_response(c: Cargo) -> CargoResponse:
    return CargoResponse(
        cargo_id=c.cargo_id,
        cargo_name=c.cargo_name,
        item=c.cargo_name,
        category=c.category,
        weight=float(c.weight),
        quantity=c.quantity,
        origin=c.origin,
        destination=c.destination,
        current_location=c.current_location,
        status=c.status,
        priority=c.priority,
        expected_arrival=c.expected_arrival,
        actual_arrival=c.actual_arrival,
        created_at=c.created_at,
        updated_at=c.updated_at
    )

@router.get("", response_model=List[CargoResponse])
def get_all_cargo(
    status_filter: Optional[str] = Query(None, alias="status", description="Filter cargo by status (e.g. Delivered, In Transit, DELAYED)"),
    priority: Optional[str] = Query(None, description="Filter cargo by priority (e.g. HIGH, MEDIUM, LOW)"),
    destination: Optional[str] = Query(None, description="Filter cargo by destination location"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns cargo records from the PostgreSQL database with optional filtering
    by status, priority, and destination.
    Requires authentication.
    """
    query = db.query(Cargo)

    if status_filter is not None and status_filter.strip():
        query = query.filter(Cargo.status.ilike(status_filter.strip()))

    if priority is not None and priority.strip():
        query = query.filter(Cargo.priority.ilike(priority.strip()))

    if destination is not None and destination.strip():
        query = query.filter(Cargo.destination.ilike(f"%{destination.strip()}%"))

    cargo_items = query.order_by(Cargo.cargo_id.asc()).all()
    return [map_cargo_to_response(c) for c in cargo_items]
