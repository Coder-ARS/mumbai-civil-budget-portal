"""
Import all models here so Alembic can detect them for autogenerate migrations.
"""
from app.db.session import Base
from app.db.models import (
    Project,
    Ward,
    Tender,
    Contractor,
    Contract,
    ProgressUpdate,
    Source,
    Document,
    User,
    Report,
    Approval,
    AuditLog,
    Payment
)

__all__ = [
    "Base",
    "Project",
    "Ward",
    "Tender",
    "Contractor",
    "Contract",
    "ProgressUpdate",
    "Source",
    "Document",
    "User",
    "Report",
    "Approval",
    "AuditLog",
    "Payment"
]
