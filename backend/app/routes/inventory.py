from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone

from app.core.database import get_db
from app.routes.auth import get_current_user
from app.models.user import User
from app.models.inventory import Inventory
from app.schemas.logistics import InventoryResponse, InventoryUpdate

router = APIRouter(prefix="/api/inventory", tags=["Inventory"])

def derive_inventory_status(quantity: float, minimum_threshold: float) -> str:
    """Derives display status dynamically from current stock and minimum threshold."""
    if float(quantity) <= float(minimum_threshold):
        return "Low"
    return "Normal"

def map_inventory_to_response(inv: Inventory) -> InventoryResponse:
    qty = float(inv.quantity)
    thresh = float(inv.minimum_threshold)
    derived_status = derive_inventory_status(qty, thresh)

    return InventoryResponse(
        item_id=inv.item_id,
        item_name=inv.item_name,
        item=inv.item_name,
        category=inv.category,
        quantity=qty,
        current_stock=qty,
        unit=inv.unit,
        minimum_threshold=thresh,
        minimum_required=thresh,
        location=inv.location,
        consumption_rate=float(inv.consumption_rate or 0),
        status=derived_status,
        created_at=inv.created_at,
        updated_at=inv.updated_at
    )

@router.get("", response_model=List[InventoryResponse])
def get_all_inventory(
    location: Optional[str] = Query(None, description="Filter inventory items by location"),
    status_filter: Optional[str] = Query(None, alias="status", description="Filter inventory items by derived status ('Normal' or 'Low')"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns inventory records from the PostgreSQL database with derived stock status.
    Supports location and status filtering.
    Requires authentication.
    """
    query = db.query(Inventory)

    if location is not None and location.strip():
        query = query.filter(Inventory.location.ilike(f"%{location.strip()}%"))

    inventory_items = query.order_by(Inventory.item_id.asc()).all()
    results = [map_inventory_to_response(inv) for inv in inventory_items]

    # Filter by derived status if specified ('Normal' or 'Low')
    if status_filter is not None and status_filter.strip():
        target_status = status_filter.strip().capitalize()
        results = [item for item in results if item.status.capitalize() == target_status]

    return results

@router.get("/{item_id}", response_model=InventoryResponse)
def get_inventory_by_id(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns a single inventory record by item_id.
    Requires authentication.
    """
    item = db.query(Inventory).filter(Inventory.item_id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Inventory item with ID {item_id} not found"
        )
    return map_inventory_to_response(item)

@router.patch("/{item_id}", response_model=InventoryResponse)
def update_inventory_quantity(
    item_id: int,
    update_data: InventoryUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Updates the quantity of an existing inventory record in PostgreSQL.
    Validates item existence and non-negative quantity.
    Returns 404 if the item ID does not exist.
    Requires authentication.
    """
    item = db.query(Inventory).filter(Inventory.item_id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Inventory item with ID {item_id} not found"
        )

    # Update quantity and timestamp
    item.quantity = update_data.quantity
    item.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(item)

    return map_inventory_to_response(item)
