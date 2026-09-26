from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.core.config import settings
from app.core.database import get_db

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Operational Platform API for Indian Polar Expeditions (MoES / NCPOR)",
    version="1.0.0"
)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "docs": "/docs"
    }

@app.get("/api/health")
def db_health_check(db: Session = Depends(get_db)):
    """
    Verifies FastAPI connectivity to the PostgreSQL database by executing a lightweight ping query.
    """
    try:
        # Execute test query against PostgreSQL database
        result = db.execute(text("SELECT 1")).scalar()
        if result == 1:
            return {
                "status": "healthy",
                "database": "connected",
                "engine": db.bind.name,
                "server": settings.POSTGRES_SERVER,
                "database_name": settings.POSTGRES_DB
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database query returned unexpected result"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database connection error: {str(e)}"
        )
