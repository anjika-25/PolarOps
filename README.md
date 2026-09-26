# PolarOps Command Center

**Integrated Polar Expedition Logistics and Asset Management System**  
*Ministry of Earth Sciences (MoES) / National Centre for Polar and Ocean Research (NCPOR)*  
*Smart Automation Prototype — SIH 2026 PS ID 26062*

---

## Overview

PolarOps Command Center is a centralized operational platform for Indian polar expeditions (Antarctic & Arctic operations, Bharati Station, Maitri Station, Field Camps). It integrates personnel tracking, cargo logistics, inventory depletion predictions, asset health monitoring, and emergency response in one unified interface.

## Tech Stack

- **Backend**: FastAPI (Python 3.13), SQLAlchemy ORM, Pydantic v2, JWT Auth.
- **Frontend**: React (Vite), Tailwind CSS, Lucide React, Recharts, Leaflet.
- **Database**: PostgreSQL (SQLAlchemy models support SQLite / PostgreSQL).

## Project Structure

```
polarops-command-center/
├── frontend/             # React + Vite + Tailwind UI
├── backend/              # FastAPI REST API + SQLAlchemy ORM
├── database/             # PostgreSQL Schema DDL (schema.sql)
├── docker-compose.yml    # Container orchestration
└── README.md
```

## Running the Application

### Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
pip install -r requirements.txt
python -m app.seed.seed_data   # Seed realistic dataset
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open browser at `http://localhost:3000`
