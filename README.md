# PolarOps Command Center

A centralized operational platform for Indian polar expeditions — connecting personnel, cargo, inventory, assets, and emergency response in one system.

Built for **Smart India Hackathon 2026** — Problem Statement **26062**: *Integrated Polar Expedition Logistics and Asset Management System* (Ministry of Earth Sciences / NCPOR, Category: Software, Theme: Smart Automation).

> **Note:** This is a finals-selection prototype, not a production system. It uses realistic **synthetic data** to demonstrate the architecture and core automation features — it does not connect to real NCPOR operational data or hardware.

---

## The problem

Indian polar expeditions to Antarctica and the Arctic currently coordinate personnel, cargo, inventory, and equipment across Excel sheets, WhatsApp, emails, and paper registers. That makes it hard to answer basic operational questions quickly: Where is everyone right now? What's running low? What needs maintenance? Who's nearest during an emergency?

PolarOps replaces that scattered workflow with one platform, plus a lightweight automation layer that surfaces problems (low stock, overdue maintenance, incidents) before they escalate.

---

## Demo flow

The prototype is built around one connected walkthrough:

```
Login → Dashboard → Personnel → Cargo & Inventory
  → edit fuel stock down → low-stock alert fires live
  → view fuel depletion prediction
  → Emergency Response → declare incident
  → Active Emergency view (nearest resources, incident checklist)
```

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, Tailwind CSS |
| Backend | FastAPI (Python) |
| Database | PostgreSQL |
| Maps | Leaflet + OpenStreetMap |
| Charts | Recharts |
| Auth | JWT, role-based access control |
| Containerization | Docker Compose |

---

## Features

### Implemented

- **Authentication** — JWT login with 4 roles (Admin, Expedition Manager, Field Officer, Emergency Coordinator)
- **Role-gated actions** — Inventory edits are restricted to Admin/Expedition Manager; declaring an emergency is restricted to Admin/Emergency Coordinator; asset maintenance edits are restricted to Admin. Other actions remain accessible to all authenticated roles.
- **Command Center dashboard** — Live KPIs (active expeditions, personnel, cargo, alerts) computed directly from the database, expedition status list, small operational map, recent alerts feed
- **Personnel management** — Filterable roster with realistic mixed statuses (Active, In Transit, Unreachable), side-panel details
- **Cargo & Inventory** — Combined view with cargo status/priority tracking and editable inventory stock
- **Automatic low-stock alerts** — Triggers the moment stock drops below its threshold, auto-clears on restock, updates the dashboard alert count without a full page reload
- **Fuel/inventory depletion prediction** — Simple, explainable formula (`(current stock − minimum) ÷ average daily usage`), backed by a real stored usage-history table — not machine learning
- **Asset management** — Automatic maintenance-status classification (Overdue / Due Soon / Normal), side-panel details
- **Emergency response** — Declare an incident, then view affected personnel and nearest available resources (vehicle, medical kit, officer), with distances calculated via the Haversine formula on stored coordinates
- **Audit logging**

### Future scope (not implemented in this prototype)

- Offline-first mode with sync (Service Workers + IndexedDB)
- AI assistant for natural-language queries over live data
- Live GPS tracking (demoable via teammates' phones using the browser Geolocation API — no hardware required) and geofencing alerts
- Real field/satellite tracker integration
- Live weather API integration
- Resource-allocation optimization engine and anomaly detection
- Tiered emergency workflow (Field Officers *report* an incident; Emergency Coordinator/Admin formally *declares* it)
- Full granular permission system across every screen and action (current version covers 3 key restrictions only)
- Scaling infrastructure (Celery/Redis, WebSockets for real-time push)

---

## Getting started

### Prerequisites
- Docker and Docker Compose

### Run locally

```bash
git clone <repo-url>
cd polarops-command-center
docker-compose up --build
```

- Frontend: `http://localhost:5173`
- Backend API docs: `http://localhost:8000/docs`
- PostgreSQL: `localhost:5432`

The database is seeded automatically on first run with realistic synthetic data (~50–80 personnel, ~40–60 cargo records, ~30–40 assets).

### Demo accounts

| Role | Email |
|---|---|
| Admin | `admin@polarops.gov.in` |
| Expedition Manager | *(see seed data)* |
| Field Officer | `officer@polarops.gov.in` |
| Emergency Coordinator | *(see seed data)* |

Demo password: `polarops2026`

---

## Project structure

```
polarops-command-center/
├── frontend/        # React + Tailwind
├── backend/         # FastAPI (models, schemas, routes, services)
├── database/        # schema.sql (table definitions only)
├── docker-compose.yml
└── README.md
```

See `backend/app/services/` for the automation logic (`alert_service.py`, `prediction_service.py`) and `backend/app/seed/seed_data.py` for synthetic data generation.

---

## Data disclaimer

All data in this prototype — personnel names, expedition details, cargo, inventory levels, and coordinates — is **synthetic**, generated to realistically demonstrate the system. It is not real NCPOR operational data.

---
