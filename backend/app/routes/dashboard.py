from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.routes.auth import get_current_user
from app.models.user import User
from app.models.expedition import Expedition
from app.models.personnel import Personnel
from app.models.cargo import Cargo
from app.models.inventory import Inventory
from app.models.asset import Asset
from app.models.emergency import EmergencyIncident

from app.schemas.dashboard import (
    KPICardData,
    ExpeditionItem,
    AlertItem,
    DashboardSummaryResponse
)

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

def calculate_kpis(db: Session) -> KPICardData:
    """
    Computes live KPI values directly from actual database aggregate queries.
    Never hardcoded.
    """
    # 1. Active Expeditions Count (status in ON TRACK, ACTIVE, DELAYED)
    active_expeditions_count = db.query(Expedition).filter(
        Expedition.status.in_(["ON TRACK", "ACTIVE", "DELAYED"])
    ).count()

    # 2. Total Personnel Count
    total_personnel_count = db.query(Personnel).count()

    # 3. Total Cargo Count
    total_cargo_count = db.query(Cargo).count()

    # 4. Active Alerts Count
    alerts = derive_active_alerts(db)
    active_alerts_count = len(alerts)

    return KPICardData(
        active_expeditions=active_expeditions_count,
        total_personnel=total_personnel_count,
        total_cargo=total_cargo_count,
        active_alerts=active_alerts_count
    )

def derive_active_alerts(db: Session) -> List[AlertItem]:
    """
    Derives real-time operational alerts from database records across
    asset maintenance, personnel status, cargo transit, and emergency incidents.
    (Low-stock alert automation omitted until smart automation phase).
    """
    alerts: List[AlertItem] = []

    # 1. Overdue & Due Maintenance Asset Alerts

    overdue_assets = db.query(Asset).filter(
        Asset.status.in_(["Overdue", "Maintenance Due Soon"])
    ).all()
    for asset in overdue_assets:
        alerts.append(AlertItem(
            id=f"asset-{asset.asset_id}",
            category="ASSET",
            title=f"Asset Maintenance {asset.status}",
            description=f"{asset.asset_name} at {asset.current_location} - Condition: {asset.condition}",
            severity="CRITICAL" if asset.status == "Overdue" else "WARNING",
            location=asset.current_location
        ))

    # 3. Unreachable Personnel Alerts
    unreachable_personnel = db.query(Personnel).filter(
        Personnel.status == "UNREACHABLE"
    ).all()
    for p in unreachable_personnel:
        alerts.append(AlertItem(
            id=f"person-{p.person_id}",
            category="PERSONNEL",
            title="Personnel Unreachable",
            description=f"{p.name} ({p.role}) is unreachable at {p.current_location}",
            severity="HIGH",
            location=p.current_location
        ))

    # 4. Delayed Cargo Shipment Alerts
    delayed_cargo = db.query(Cargo).filter(
        Cargo.status == "DELAYED"
    ).all()
    for c in delayed_cargo:
        alerts.append(AlertItem(
            id=f"cargo-{c.cargo_id}",
            category="CARGO",
            title="Cargo Shipment Delayed",
            description=f"{c.cargo_name} bound for {c.destination} is delayed (Priority: {c.priority})",
            severity="HIGH" if c.priority == "HIGH" else "WARNING",
            location=c.destination
        ))

    # 5. Active Emergency Incidents
    active_incidents = db.query(EmergencyIncident).filter(
        EmergencyIncident.status == "Active"
    ).all()
    for inc in active_incidents:
        alerts.append(AlertItem(
            id=f"emg-{inc.incident_id}",
            category="EMERGENCY",
            title=f"Active Incident: {inc.type}",
            description=f"Severity: {inc.severity} at {inc.location} (Affected: {inc.affected_person or 'N/A'})",
            severity="CRITICAL" if inc.severity in ["Critical", "High"] else "HIGH",
            location=inc.location,
            timestamp=inc.timestamp.isoformat() if inc.timestamp else None
        ))

    return alerts

@router.get("/stats", response_model=KPICardData)
def get_kpis(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns live KPI statistics computed directly from PostgreSQL database counts.
    Requires authentication.
    """
    return calculate_kpis(db)

@router.get("/expeditions", response_model=List[ExpeditionItem])
def get_expedition_statuses(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns list of all expeditions with their operational status and metadata.
    Requires authentication.
    """
    expeditions = db.query(Expedition).order_by(Expedition.expedition_id.asc()).all()
    return expeditions

@router.get("/alerts", response_model=List[AlertItem])
def get_recent_alerts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns live operational alerts derived from database conditions.
    Requires authentication.
    """
    return derive_active_alerts(db)

@router.get("/summary", response_model=DashboardSummaryResponse)
def get_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns combined dashboard response containing live KPIs, expedition statuses, and recent alerts.
    Requires authentication.
    """
    kpis = calculate_kpis(db)
    expeditions = db.query(Expedition).order_by(Expedition.expedition_id.asc()).all()
    alerts = derive_active_alerts(db)

    return DashboardSummaryResponse(
        kpis=kpis,
        expeditions=[ExpeditionItem.model_validate(e) for e in expeditions],
        alerts=alerts
    )
