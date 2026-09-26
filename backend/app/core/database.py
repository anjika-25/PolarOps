from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# Create SQLAlchemy engine using settings
# Handle pool settings for PostgreSQL
db_url = settings.sync_database_url

# If sqlite URL is passed during local testing without postgres container, handle connect_args
connect_args = {"check_same_thread": False} if db_url.startswith("sqlite") else {}

engine = create_engine(
    db_url,
    pool_pre_ping=True,
    connect_args=connect_args
)

# Database Session Factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Declarative Base for SQLAlchemy Models
Base = declarative_base()

# FastAPI Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
