"""
PolarOps Command Center — Seed Data Script
Ministry of Earth Sciences (MoES) / National Centre for Polar and Ocean Research (NCPOR)

Populates realistic synthetic data into PostgreSQL for prototype testing:
- 4 Demo Users across required roles
- 4 Polar Expeditions
- 68 Personnel records (Active, In Transit, Unreachable)
- 48 Cargo records (Delivered, In Transit, Delayed)
- 28 Inventory records (including fuel seeded close to threshold)
- 7-Day Inventory Usage History (for explainable fuel depletion predictions)
- 36 Asset records (Operational, Maintenance Due Soon, Overdue)
- 2 Initial Emergency Incidents
"""

import sys
import os
from datetime import date, datetime, timedelta
import random

from passlib.context import CryptContext
from sqlalchemy import text

# Add backend root to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from app.core.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.expedition import Expedition
from app.models.personnel import Personnel
from app.models.cargo import Cargo
from app.models.inventory import Inventory
from app.models.inventory_usage import InventoryUsageHistory
from app.models.asset import Asset
from app.models.emergency import EmergencyIncident

def hash_password(password: str) -> str:
    # Pre-computed bcrypt hash for 'polarops2026'
    return "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW"


def seed_database():
    print("=== Starting PolarOps Database Seed Process ===")
    
    # Ensure all tables are created
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Clear existing data in reverse foreign-key order
        print("Clearing existing data...")
        db.query(InventoryUsageHistory).delete()
        db.query(EmergencyIncident).delete()
        db.query(Asset).delete()
        db.query(Inventory).delete()
        db.query(Cargo).delete()
        db.query(Personnel).delete()
        db.query(Expedition).delete()
        db.query(User).delete()
        db.commit()

        # ----------------------------------------------------
        # 1. USERS (Demo Credentials)
        # ----------------------------------------------------
        print("Seeding Users...")
        default_password_hash = hash_password("polarops2026")
        
        users_data = [
            User(
                name="Dr. Sunita Sharma",
                email="admin@polarops.gov.in",
                role="ADMIN",
                password_hash=default_password_hash
            ),
            User(
                name="Command Coordinator Rajesh Rao",
                email="manager@polarops.gov.in",
                role="EXPEDITION_MANAGER",
                password_hash=default_password_hash
            ),
            User(
                name="Field Officer Vikramaditya Singh",
                email="officer@polarops.gov.in",
                role="FIELD_OFFICER",
                password_hash=default_password_hash
            ),
            User(
                name="Dr. Ananya Sen",
                email="emergency@polarops.gov.in",
                role="EMERGENCY_COORDINATOR",
                password_hash=default_password_hash
            )
        ]
        db.add_all(users_data)
        db.commit()

        # ----------------------------------------------------
        # 2. EXPEDITIONS
        # ----------------------------------------------------
        print("Seeding Expeditions...")
        today = date.today()
        expeditions_data = [
            Expedition(
                name="43rd Indian Scientific Expedition to Antarctica (ISEA)",
                destination="Maitri Station & Schirmacher Oasis",
                start_date=today - timedelta(days=90),
                end_date=today + timedelta(days=90),
                base="Maitri Station",
                leader="Dr. Rajesh Kumar",
                phase="Field Operations & Glaciology",
                status="ON TRACK"
            ),
            Expedition(
                name="Bharati Winter Research Mission 2026",
                destination="Bharati Station & Larsemann Hills",
                start_date=today - timedelta(days=150),
                end_date=today + timedelta(days=30),
                base="Bharati Station",
                leader="Dr. Sunita Deshmukh",
                phase="Atmospheric & Data Collection",
                status="ACTIVE"
            ),
            Expedition(
                name="Arctic Summer Research Expedition 2026",
                destination="Himadri Station, Svalbard",
                start_date=today - timedelta(days=20),
                end_date=today + timedelta(days=60),
                base="Himadri Station",
                leader="Vikramaditya Singh",
                phase="Logistics & Marine Transect",
                status="DELAYED"
            ),
            Expedition(
                name="Southern Ocean Oceanographic Cruise",
                destination="Southern Ocean (60°S - 70°S)",
                start_date=today - timedelta(days=40),
                end_date=today + timedelta(days=20),
                base="ORV Sagar Nidhi",
                leader="Dr. Ananya Sen",
                phase="Deep Sea Bathymetry & Water Sampling",
                status="ON TRACK"
            )
        ]
        db.add_all(expeditions_data)
        db.commit()

        # Retrieve inserted expedition IDs
        exp_ids = [e.expedition_id for e in db.query(Expedition).all()]

        # ----------------------------------------------------
        # 3. PERSONNEL (~68 Synthetic Indian Records)
        # ----------------------------------------------------
        print("Seeding Personnel...")
        first_names = [
            "Rahul", "Ananya", "Vikram", "Priya", "Arjun", "Sunita", "Rajesh", "Amit", 
            "Deepa", "Suresh", "Kavita", "Rohan", "Neha", "Siddharth", "Pooja", "Manoj", 
            "Swati", "Tarun", "Ritu", "Alok", "Meera", "Sanjay", "Dev", "Kiran", "Nikhil",
            "Divya", "Gaurav", "Shalini", "Varun", "Preeti", "Aakash", "Rashmi", "Manish"
        ]
        last_names = [
            "Sharma", "Sen", "Rao", "Nair", "Mehta", "Deshmukh", "Kumar", "Patel",
            "Verma", "Reddy", "Iyer", "Gupta", "Joshi", "Malhotra", "Bhatia", "Pandey",
            "Kulkarni", "Saxena", "Banerjee", "Mishra", "Chaudhry", "Chawla", "Singh", "Dutta"
        ]
        
        roles_list = [
            ("Glaciologist", "Science & Research"),
            ("Meteorological Researcher", "Science & Research"),
            ("Field Engineer", "Engineering & Technical"),
            ("Communications Specialist", "Communications & IT"),
            ("Expedition Medical Officer", "Medical & Health"),
            ("Station Commander", "Logistics & Operations"),
            ("Environmental Scientist", "Science & Research"),
            ("Heavy Vehicle Mechanic", "Engineering & Technical"),
            ("Power Plant Engineer", "Engineering & Technical"),
            ("Marine Biologist", "Science & Research"),
            ("Logistics Officer", "Logistics & Operations"),
            ("Oceanographer", "Science & Research"),
            ("Geophysicist", "Science & Research"),
            ("Life Support Systems Tech", "Engineering & Technical"),
            ("Safety & Rescue Officer", "Logistics & Operations")
        ]
        
        locations = ["Maitri Station", "Bharati Station", "Himadri Station", "Field Camp A", "Field Camp B", "ORV Sagar Nidhi"]

        personnel_objects = []

        # Deliberate Operational Personnel Cases:
        # Case 1: Arjun Mehta - UNREACHABLE at Field Camp B
        personnel_objects.append(
            Personnel(
                name="Arjun Mehta",
                role="Communications Technician",
                department="Communications & IT",
                contact="+91-9876543210",
                emergency_contact="Sunita Mehta (+91-9876543211)",
                training_status="Completed - High Altitude & Extreme Cold",
                medical_clearance="Class A Polar Fit",
                current_location="Field Camp B",
                expedition_id=exp_ids[0],
                status="UNREACHABLE"
            )
        )

        # Case 2: Rohan Gupta - UNREACHABLE at Field Camp A
        personnel_objects.append(
            Personnel(
                name="Rohan Gupta",
                role="Field Engineer",
                department="Engineering & Technical",
                contact="+91-9876543220",
                emergency_contact="Aarti Gupta (+91-9876543221)",
                training_status="Completed - Polar Survival",
                medical_clearance="Class A Polar Fit",
                current_location="Field Camp A",
                expedition_id=exp_ids[0],
                status="UNREACHABLE"
            )
        )

        # Case 3 & 4: In Transit Personnel
        personnel_objects.append(
            Personnel(
                name="Priya Nair",
                role="Expedition Medical Officer",
                department="Medical & Health",
                contact="+91-9876543230",
                emergency_contact="Karthik Nair (+91-9876543231)",
                training_status="Completed - Wilderness Trauma",
                medical_clearance="Class A Polar Fit",
                current_location="In Transit",
                expedition_id=exp_ids[1],
                status="In Transit"
            )
        )
        personnel_objects.append(
            Personnel(
                name="Amit Patel",
                role="Heavy Vehicle Mechanic",
                department="Engineering & Technical",
                contact="+91-9876543240",
                emergency_contact="Bhavna Patel (+91-9876543241)",
                training_status="Completed - Hydraulic Machinery",
                medical_clearance="Class A Polar Fit",
                current_location="In Transit",
                expedition_id=exp_ids[2],
                status="In Transit"
            )
        )

        # Fill remaining personnel up to 68 total
        used_names = {"Arjun Mehta", "Rohan Gupta", "Priya Nair", "Amit Patel"}
        random.seed(42) # Deterministic generation

        while len(personnel_objects) < 68:
            fn = random.choice(first_names)
            ln = random.choice(last_names)
            full_name = f"{fn} {ln}"
            if full_name in used_names:
                continue
            used_names.add(full_name)

            role, dept = random.choice(roles_list)
            loc = random.choice(locations)
            exp_id = random.choice(exp_ids)
            status_val = "Active" if random.random() > 0.1 else "In Transit"

            personnel_objects.append(
                Personnel(
                    name=full_name,
                    role=role,
                    department=dept,
                    contact=f"+91-98{random.randint(10000000, 99999999)}",
                    emergency_contact=f"Family (+91-98{random.randint(10000000, 99999999)})",
                    training_status="Completed - Advanced Polar Survival",
                    medical_clearance="Class A Fit",
                    current_location=loc,
                    expedition_id=exp_id,
                    status=status_val
                )
            )

        db.add_all(personnel_objects)
        db.commit()

        # ----------------------------------------------------
        # 4. CARGO (~48 Synthetic Records)
        # ----------------------------------------------------
        print("Seeding Cargo...")
        cargo_items = [
            ("C-104", "Weather Monitoring Equipment", "Scientific", 450.0, 3, "Cape Town Port", "Maitri Station", "In Transit", "DELAYED", "HIGH", today - timedelta(days=2), None),
            ("C-101", "Aviation Fuel Jet A-1 Drums", "Fuel", 12000.0, 60, "Cape Town Port", "Maitri Station", "Maitri Depot", "Delivered", "HIGH", today - timedelta(days=10), today - timedelta(days=10)),
            ("C-102", "Generator Engine Overhaul Kit", "Spare Parts", 320.0, 2, "Mumbai Port", "Bharati Station", "In Transit", "In Transit", "HIGH", today + timedelta(days=4), None),
            ("C-103", "Medical Emergency Supplies & Plasma", "Medical", 85.0, 5, "NCPOR Goa", "Maitri Station", "Maitri Station", "Delivered", "HIGH", today - timedelta(days=5), today - timedelta(days=5)),
            ("C-105", "Glaciological Core Drill Assembly", "Scientific", 680.0, 1, "Oslo Depot", "Himadri Station", "In Transit", "In Transit", "MEDIUM", today + timedelta(days=7), None),
            ("C-106", "Satellite Terminal High-Gain Antenna", "Infrastructure", 190.0, 2, "Goa Base", "Bharati Station", "Bharati Station", "Delivered", "MEDIUM", today - timedelta(days=12), today - timedelta(days=11)),
            ("C-107", "Polar Survival Thermal Outerwear", "Rations", 410.0, 40, "Cape Town Port", "Field Camp A", "Maitri Station", "In Transit", "MEDIUM", today + timedelta(days=3), None),
            ("C-108", "Solar Panel Array & Inverter Modules", "Infrastructure", 950.0, 12, "Mumbai Port", "Bharati Station", "In Transit", "DELAYED", "MEDIUM", today - timedelta(days=1), None),
            ("C-109", "Snowmobile Rubber Track Assemblies", "Spare Parts", 540.0, 8, "Cape Town Port", "Maitri Station", "Maitri Station", "Delivered", "LOW", today - timedelta(days=15), today - timedelta(days=14)),
            ("C-110", "Seismic Sensor Field Deployers", "Scientific", 280.0, 15, "NCPOR Goa", "Field Camp B", "Field Camp B", "Delivered", "HIGH", today - timedelta(days=8), today - timedelta(days=8)),
        ]

        cargo_objects = []
        for c_code, name, cat, wt, qty, orig, dest, curr_loc, st, prio, exp_arr, act_arr in cargo_items:
            cargo_objects.append(
                Cargo(
                    cargo_name=f"{c_code}: {name}",
                    category=cat,
                    weight=wt,
                    quantity=qty,
                    origin=orig,
                    destination=dest,
                    current_location=curr_loc,
                    status=st,
                    priority=prio,
                    expected_arrival=exp_arr,
                    actual_arrival=act_arr
                )
            )

        # Generate additional realistic cargo items up to 48 total
        cargo_names = [
            "Deep Ocean Water Sampler Bottles", "Hydraulic Fluid Drums", "Freeze-Dried Rations Container",
            "High-Frequency Radio Transceiver", "Emergency Oxygen Cylinders", "Snowcat Tread Shoes",
            "LiFePO4 Storage Battery Bank", "Permafrost Temperature Probes", "Wind Turbine Spare Blades",
            "Portable Decontamination Unit", "Thermal Insulation Blankets", "Satellite Modem Transceivers"
        ]
        
        c_counter = 111
        while len(cargo_objects) < 48:
            c_name = random.choice(cargo_names)
            cat = random.choice(["Scientific", "Fuel", "Spare Parts", "Medical", "Infrastructure", "Rations"])
            st = random.choice(["Delivered", "In Transit", "In Transit", "Delivered"])
            prio = random.choice(["HIGH", "MEDIUM", "LOW"])
            dest = random.choice(["Maitri Station", "Bharati Station", "Himadri Station", "Field Camp A", "Field Camp B"])

            cargo_objects.append(
                Cargo(
                    cargo_name=f"C-{c_counter}: {c_name}",
                    category=cat,
                    weight=round(random.uniform(50.0, 2500.0), 2),
                    quantity=random.randint(1, 50),
                    origin="Cape Town Port",
                    destination=dest,
                    current_location=dest if st == "Delivered" else "In Transit",
                    status=st,
                    priority=prio,
                    expected_arrival=today + timedelta(days=random.randint(-10, 15)),
                    actual_arrival=today - timedelta(days=random.randint(1, 10)) if st == "Delivered" else None
                )
            )
            c_counter += 1

        db.add_all(cargo_objects)
        db.commit()

        # ----------------------------------------------------
        # 5. INVENTORY (~28 Synthetic Records)
        # ----------------------------------------------------
        print("Seeding Inventory...")
        inventory_data = [
            # Key Fuel Item Seeded Close to Minimum Threshold (for Live Alert Demo)
            Inventory(
                item_name="Jet A-1 Aviation Fuel",
                category="Fuel",
                quantity=5200.0,
                unit="Liters",
                minimum_threshold=5000.0,
                location="Maitri Station",
                consumption_rate=467.0
            ),
            Inventory(
                item_name="Station Diesel Fuel",
                category="Fuel",
                quantity=8500.0,
                unit="Liters",
                minimum_threshold=8000.0,
                location="Bharati Station",
                consumption_rate=650.0
            ),
            Inventory(
                item_name="Propane Heating Gas Cylinders",
                category="Fuel",
                quantity=42.0,
                unit="Cylinders",
                minimum_threshold=40.0,
                location="Maitri Station",
                consumption_rate=3.5
            ),
            Inventory(
                item_name="Emergency Medical Trauma Kits",
                category="Medical",
                quantity=6.0,
                unit="Kits",
                minimum_threshold=5.0,
                location="Field Camp A",
                consumption_rate=0.2
            ),
            Inventory(
                item_name="Freeze-Dried Ration Packs",
                category="Rations",
                quantity=1450.0,
                unit="Packs",
                minimum_threshold=500.0,
                location="Maitri Station",
                consumption_rate=45.0
            ),
            Inventory(
                item_name="Station Diesel Fuel",
                category="Fuel",
                quantity=3200.0,
                unit="Liters",
                minimum_threshold=3000.0,
                location="Himadri Station",
                consumption_rate=220.0
            ),
            Inventory(
                item_name="Potable Water Filtration Filters",
                category="Life Support",
                quantity=18.0,
                unit="Units",
                minimum_threshold=10.0,
                location="Bharati Station",
                consumption_rate=0.5
            ),
            Inventory(
                item_name="Synthetic Engine Oil (5W-40)",
                category="Spare Parts",
                quantity=380.0,
                unit="Liters",
                minimum_threshold=200.0,
                location="Maitri Station",
                consumption_rate=12.0
            ),
            Inventory(
                item_name="Snowmobile Rubber Tracks",
                category="Spare Parts",
                quantity=12.0,
                unit="Pairs",
                minimum_threshold=4.0,
                location="Bharati Station",
                consumption_rate=0.1
            ),
            Inventory(
                item_name="Compressed Medical Oxygen Cylinders",
                category="Medical",
                quantity=15.0,
                unit="Cylinders",
                minimum_threshold=8.0,
                location="Maitri Station",
                consumption_rate=0.3
            )
        ]

        # Additional items to reach 28 total
        extra_inventory = [
            ("High-Altitude Hydration Packs", "Medical", 120.0, "Boxes", 30.0, "Field Camp B", 2.0),
            ("Hydraulic Fluid ISO VG 32", "Spare Parts", 450.0, "Liters", 150.0, "Bharati Station", 15.0),
            ("Polar Thermal Gloves", "Rations", 85.0, "Pairs", 25.0, "Maitri Station", 1.0),
            ("Portable Satellite Batteries", "Infrastructure", 34.0, "Units", 10.0, "Field Camp A", 0.5),
            ("Chemical Ice Melting Granules", "Infrastructure", 600.0, "kg", 200.0, "Himadri Station", 25.0),
            ("Field Rations Pack - Vegetarian", "Rations", 890.0, "Packs", 300.0, "Bharati Station", 30.0),
            ("Emergency Flares & Smoke Signals", "Safety", 60.0, "Units", 20.0, "Field Camp B", 0.5),
            ("Cold Weather Generator Filters", "Spare Parts", 48.0, "Units", 15.0, "Maitri Station", 1.5),
            ("De-Icing Spray Canisters", "Infrastructure", 110.0, "Cans", 30.0, "Himadri Station", 4.0),
            ("High-Energy Protein Bars", "Rations", 2400.0, "Bars", 500.0, "Maitri Station", 80.0),
            ("Deep Freeze Grease Lubricant", "Spare Parts", 75.0, "Tubes", 20.0, "Bharati Station", 2.0),
            ("Permafrost Soil Sampling Tubes", "Scientific", 150.0, "Units", 40.0, "Field Camp A", 5.0),
            ("Portable Radiometer Batteries", "Scientific", 45.0, "Units", 15.0, "Field Camp B", 1.0),
            ("Emergency Shelter Tents (4-Person)", "Safety", 14.0, "Units", 6.0, "Maitri Station", 0.1),
            ("Burner Wicks & Heating Spares", "Fuel", 95.0, "Units", 30.0, "Himadri Station", 2.0),
            ("Water Desalination Chemical Treatment", "Life Support", 310.0, "Liters", 100.0, "Bharati Station", 8.0),
            ("High-Bandwidth VHF Antenna Cables", "Infrastructure", 220.0, "Meters", 50.0, "Maitri Station", 3.0),
            ("Glaciology Sample Storage Bags", "Scientific", 1800.0, "Bags", 400.0, "Field Camp A", 45.0)
        ]

        for name, cat, qty, unit, thresh, loc, rate in extra_inventory:
            inventory_data.append(
                Inventory(
                    item_name=name,
                    category=cat,
                    quantity=qty,
                    unit=unit,
                    minimum_threshold=thresh,
                    location=loc,
                    consumption_rate=rate
                )
            )

        db.add_all(inventory_data)
        db.commit()

        # Retrieve Fuel Item ID for Jet A-1 at Maitri
        jet_a1_item = db.query(Inventory).filter(
            Inventory.item_name == "Jet A-1 Aviation Fuel",
            Inventory.location == "Maitri Station"
        ).first()

        # ----------------------------------------------------
        # 6. INVENTORY USAGE HISTORY (7 Days of Fuel History)
        # ----------------------------------------------------
        print("Seeding Inventory Usage History (7 Days)...")
        usage_history_objects = []

        if jet_a1_item:
            # Past 7 days consumption for Jet A-1 Fuel at Maitri Station
            daily_usages = [480.0, 450.0, 470.0, 460.0, 475.0, 465.0, 467.0]
            for i, qty_used in enumerate(daily_usages):
                usage_date = today - timedelta(days=7 - i)
                usage_history_objects.append(
                    InventoryUsageHistory(
                        item_id=jet_a1_item.item_id,
                        date=usage_date,
                        quantity_used=qty_used
                    )
                )

        # Seed usage history for Station Diesel Fuel at Bharati Station
        bharati_diesel = db.query(Inventory).filter(
            Inventory.item_name == "Station Diesel Fuel",
            Inventory.location == "Bharati Station"
        ).first()

        if bharati_diesel:
            diesel_usages = [640.0, 660.0, 655.0, 645.0, 650.0, 662.0, 650.0]
            for i, qty_used in enumerate(diesel_usages):
                usage_date = today - timedelta(days=7 - i)
                usage_history_objects.append(
                    InventoryUsageHistory(
                        item_id=bharati_diesel.item_id,
                        date=usage_date,
                        quantity_used=qty_used
                    )
                )

        db.add_all(usage_history_objects)
        db.commit()

        # ----------------------------------------------------
        # 7. ASSETS (~36 Synthetic Records)
        # ----------------------------------------------------
        print("Seeding Assets...")
        asset_list = [
            # Deliberate Overdue Asset Case
            Asset(
                asset_name="Caterpillar Diesel Generator AST-021",
                asset_type="Power Generator",
                condition="Warning - Low Oil Pressure",
                current_location="Maitri Station",
                assigned_team="Maitri Power Ops Team",
                last_maintenance=today - timedelta(days=190),
                next_maintenance=today - timedelta(days=15),
                status="Overdue"
            ),
            # Deliberate Maintenance Due Soon Case
            Asset(
                asset_name="PistenBully 300 Polar Snowcat PB-04",
                asset_type="Heavy Vehicle",
                condition="Operational - Scheduled Servicing Required",
                current_location="Bharati Station",
                assigned_team="Bharati Transport Unit",
                last_maintenance=today - timedelta(days=85),
                next_maintenance=today + timedelta(days=3),
                status="Maintenance Due Soon"
            ),
            Asset(
                asset_name="KVH TracPhone V7-HTS Satellite Antenna",
                asset_type="Satellite Communications",
                condition="Optimal",
                current_location="Maitri Station",
                assigned_team="Telecom Response Team",
                last_maintenance=today - timedelta(days=30),
                next_maintenance=today + timedelta(days=150),
                status="Operational"
            ),
            Asset(
                asset_name="Automatic Weather Station AWS-03",
                asset_type="Scientific Equipment",
                condition="Optimal",
                current_location="Field Camp A",
                assigned_team="Meteorology Science Wing",
                last_maintenance=today - timedelta(days=45),
                next_maintenance=today + timedelta(days=135),
                status="Operational"
            ),
            Asset(
                asset_name="Water Desalination RO Unit WDU-01",
                asset_type="Life Support",
                condition="Operational",
                current_location="Bharati Station",
                assigned_team="Station Facilities Unit",
                last_maintenance=today - timedelta(days=60),
                next_maintenance=today + timedelta(days=30),
                status="Operational"
            )
        ]

        # Generate additional realistic assets up to 36 total
        asset_types = [
            ("Snowcat Vehicle", "Vehicle"), ("Portable Ice Coring Drill", "Scientific Equipment"),
            ("High-Output Heating Unit", "Life Support"), ("VHF Radio Repeater", "Satellite Communications"),
            ("Scientific Water Profiler", "Scientific Equipment"), ("Backup Diesel Generator", "Power Generator"),
            ("Snowmobile Lynx Commander", "Vehicle"), ("Precision Gravimeter", "Scientific Equipment"),
            ("Polar Drone Scanner Array", "Scientific Equipment"), ("Incinerator Waste Unit", "Life Support")
        ]

        a_counter = 101
        locations_all = ["Maitri Station", "Bharati Station", "Himadri Station", "Field Camp A", "Field Camp B"]

        while len(asset_list) < 36:
            a_name, a_type = random.choice(asset_types)
            loc = random.choice(locations_all)
            st_choice = random.choice(["Operational", "Operational", "Operational", "Maintenance Due Soon"])
            
            last_maint = today - timedelta(days=random.randint(20, 120))
            next_maint = today + timedelta(days=random.randint(10, 100)) if st_choice == "Operational" else today + timedelta(days=random.randint(1, 5))

            asset_list.append(
                Asset(
                    asset_name=f"{a_name} #{a_counter}",
                    asset_type=a_type,
                    condition="Good" if st_choice == "Operational" else "Servicing Needed",
                    current_location=loc,
                    assigned_team=f"{loc.split()[0]} Technical Crew",
                    last_maintenance=last_maint,
                    next_maintenance=next_maint,
                    status=st_choice
                )
            )
            a_counter += 1

        db.add_all(asset_list)
        db.commit()

        # ----------------------------------------------------
        # 8. EMERGENCY INCIDENTS (Baseline Records)
        # ----------------------------------------------------
        print("Seeding Emergency Incidents...")
        incidents_data = [
            EmergencyIncident(
                type="Missing Personnel",
                severity="Critical",
                location="Field Camp B",
                affected_person="Arjun Mehta",
                timestamp=datetime.now() - timedelta(hours=6),
                status="Active",
                response_team="Maitri Rapid Rescue Unit Alpha",
                resolution="Search party deployed from Maitri Station. Radio beacon sweep in progress."
            ),
            EmergencyIncident(
                type="Vehicle Failure",
                severity="Medium",
                location="Convoy Route KM-42 (Maitri-Bharati Track)",
                affected_person="Rohan Gupta",
                timestamp=datetime.now() - timedelta(days=2),
                status="Resolved",
                response_team="Maitri Vehicle Maintenance Unit",
                resolution="Track assembly replaced on Snowcat PB-02. Vehicle safely escorted back to station."
            )
        ]
        db.add_all(incidents_data)
        db.commit()

        # ----------------------------------------------------
        # VERIFICATION SUMMARY PRINT
        # ----------------------------------------------------
        print("\n====================================================")
        print("   POLAROPS SEED DATA SUCCESSFULLY GENERATED")
        print("====================================================")
        print(f" Users Count:                   {db.query(User).count()}")
        print(f" Expeditions Count:             {db.query(Expedition).count()}")
        print(f" Personnel Count:               {db.query(Personnel).count()}")
        print(f" Cargo Count:                   {db.query(Cargo).count()}")
        print(f" Inventory Items Count:         {db.query(Inventory).count()}")
        print(f" Inventory Usage History Rows:  {db.query(InventoryUsageHistory).count()}")
        print(f" Assets Count:                  {db.query(Asset).count()}")
        print(f" Emergency Incidents Count:     {db.query(EmergencyIncident).count()}")
        print("====================================================")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Seeding failed: {str(e)}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
