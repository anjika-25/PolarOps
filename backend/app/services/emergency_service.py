import math
from typing import List, Dict, Tuple
from app.models.emergency import EmergencyIncident
from app.schemas.emergency import EmergencyResponse, ChecklistStatus, ResponseResource

# Deterministic simulated coordinates for known PolarOps locations
LOCATION_COORDINATES: Dict[str, Tuple[float, float]] = {
    "MAITRI STATION": (-70.7667, 11.7333),
    "BHARATI STATION": (-69.4078, 76.1914),
    "HIMADRI STATION": (78.9233, 11.9306),
    "FIELD CAMP A": (-70.8500, 11.9000),
    "FIELD CAMP B": (-69.5000, 76.3000),
}
DEFAULT_COORDINATE: Tuple[float, float] = (-70.7667, 11.7333)  # Default fallback (Maitri Station)

# Deterministic mock response resources
MOCK_RESPONSE_RESOURCES = [
    {
        "resource_id": "RES-VEH-01",
        "name": "Polar Snowcat Emergency Unit RS-01",
        "type": "Response Vehicle",
        "base_location": "Maitri Main Depot",
        "lat": -70.7800,
        "lon": 11.7500,
        "status": "STANDBY",
    },
    {
        "resource_id": "RES-MED-01",
        "name": "Maitri Rapid Medical Trauma Team",
        "type": "Medical Team",
        "base_location": "Maitri Station",
        "lat": -70.7667,
        "lon": 11.7333,
        "status": "READY",
    },
    {
        "resource_id": "RES-FLD-02",
        "name": "Bharati Rescue Squad Unit-2",
        "type": "Field Response Team",
        "base_location": "Bharati Station",
        "lat": -69.4078,
        "lon": 76.1914,
        "status": "ON CALL",
    },
]

def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculates circle distance in kilometers between two (lat, lon) coordinates using Haversine formula.
    """
    R = 6371.0  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2.0) ** 2
        + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2.0) ** 2
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return round(R * c, 1)

def get_location_coordinates(location_name: str) -> Tuple[float, float]:
    """
    Returns deterministic lat/lon coordinate for a given location string.
    """
    key = (location_name or "").strip().upper()
    for loc_key, coord in LOCATION_COORDINATES.items():
        if loc_key in key or key in loc_key:
            return coord
    return DEFAULT_COORDINATE

def calculate_response_resources(incident_location: str) -> List[ResponseResource]:
    """
    Calculates deterministic response resources and mathematical distances from incident location.
    """
    inc_lat, inc_lon = get_location_coordinates(incident_location)
    resources = []

    for res in MOCK_RESPONSE_RESOURCES:
        dist_km = calculate_haversine_distance(inc_lat, inc_lon, res["lat"], res["lon"])
        
        # Estimate ETA based on distance
        if dist_km == 0:
            eta = "Immediate (< 5 mins)"
        elif dist_km < 10:
            eta = f"{int(dist_km * 3 + 5)} mins"
        elif dist_km < 100:
            eta = f"{int(dist_km / 15 + 1)} hrs"
        else:
            eta = f"{int(dist_km / 200 + 2)} hrs"

        resources.append(
            ResponseResource(
                resource_id=res["resource_id"],
                name=res["name"],
                type=res["type"],
                base_location=res["base_location"],
                distance_km=dist_km,
                status=res["status"],
                estimated_eta=eta,
            )
        )

    return resources

def build_emergency_response(incident: EmergencyIncident) -> EmergencyResponse:
    """
    Maps an EmergencyIncident SQLAlchemy model instance into an EmergencyResponse schema.
    """
    # Checklist initial state
    checklist = ChecklistStatus(
        incident_created=True,
        team_notified=False,
        vehicle_assigned=False
    )

    # Calculate deterministic response resources
    resources = calculate_response_resources(incident.location)

    return EmergencyResponse(
        incident_id=incident.incident_id,
        type=incident.type,
        location=incident.location,
        severity=incident.severity,
        status=incident.status,
        affected_personnel=incident.affected_person,
        created_at=incident.created_at or incident.timestamp,
        checklist=checklist,
        response_resources=resources
    )
