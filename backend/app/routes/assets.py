from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date, timedelta

from app.core.database import get_db
from app.routes.auth import get_current_user
from app.models.user import User
from app.models.asset import Asset
from app.schemas.asset import AssetResponse

router = APIRouter(prefix="/api/assets", tags=["Assets"])

def derive_maintenance_status(next_maintenance: Optional[date], stored_status: str) -> str:
    """
    Calculates maintenance classification from the actual database date & status:
    - OVERDUE: next_maintenance date in past OR stored status is 'Overdue'
    - DUE SOON: next_maintenance date within 7 days OR stored status is 'Maintenance Due Soon'
    - NORMAL: otherwise
    """
    today = date.today()
    status_upper = (stored_status or '').upper()

    if status_upper == 'OVERDUE' or (next_maintenance and next_maintenance < today):
        return 'OVERDUE'
    
    if status_upper in ['MAINTENANCE DUE SOON', 'DUE SOON'] or (next_maintenance and next_maintenance <= today + timedelta(days=7)):
        return 'DUE SOON'

    return 'NORMAL'

def map_asset_to_response(a: Asset) -> AssetResponse:
    maint_status = derive_maintenance_status(a.next_maintenance, a.status)

    return AssetResponse(
        asset_id=a.asset_id,
        asset_name=a.asset_name,
        equipment=a.asset_name,
        asset_type=a.asset_type,
        location=a.current_location,
        current_location=a.current_location,
        condition=a.condition,
        assigned_team=a.assigned_team,
        last_maintenance=a.last_maintenance,
        next_maintenance=a.next_maintenance,
        maintenance_due=a.next_maintenance,
        status=a.status,
        maintenance_status=maint_status,
        created_at=a.created_at,
        updated_at=a.updated_at
    )

@router.get("", response_model=List[AssetResponse])
def get_all_assets(
    location: Optional[str] = Query(None, description="Filter assets by current location"),
    condition: Optional[str] = Query(None, description="Filter assets by condition"),
    maintenance_status: Optional[str] = Query(None, description="Filter by derived maintenance status ('OVERDUE', 'DUE SOON', 'NORMAL')"),
    status_filter: Optional[str] = Query(None, alias="status", description="Filter assets by stored status"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns asset records from the PostgreSQL database with mapped fields and maintenance status classification.
    Supports location, condition, maintenance status, and status filtering.
    Requires authentication.
    """
    query = db.query(Asset)

    if location is not None and location.strip():
        query = query.filter(Asset.current_location.ilike(f"%{location.strip()}%"))

    if condition is not None and condition.strip():
        query = query.filter(Asset.condition.ilike(f"%{condition.strip()}%"))

    if status_filter is not None and status_filter.strip():
        query = query.filter(Asset.status.ilike(f"%{status_filter.strip()}%"))

    assets = query.order_by(Asset.asset_id.asc()).all()
    results = [map_asset_to_response(a) for a in assets]

    # Filter by derived maintenance status if provided ('OVERDUE', 'DUE SOON', 'NORMAL')
    if maintenance_status is not None and maintenance_status.strip():
        target_maint = maintenance_status.strip().upper()
        results = [item for item in results if item.maintenance_status == target_maint]

    return results

@router.get("/{asset_id}", response_model=AssetResponse)
def get_asset_by_id(
    asset_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns complete details of a single asset by asset_id from PostgreSQL.
    Returns 404 Not Found if the asset ID does not exist.
    Requires authentication.
    """
    asset = db.query(Asset).filter(Asset.asset_id == asset_id).first()
    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Asset record with ID {asset_id} not found"
        )

    return map_asset_to_response(asset)
