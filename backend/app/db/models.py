"""
SQLAlchemy models for Mumbai Civil Budget Portal
All tables with complete attributes as per the schema
"""
from sqlalchemy import Column, String, Date, DateTime, Text, Integer, Boolean, Numeric, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
import uuid

from app.db.session import Base


class Project(Base):
    """Projects table - core entity for all infrastructure projects"""
    __tablename__ = "projects"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    external_ids = Column(JSONB, nullable=True, default={}, comment="Map of source_name: external_id")
    title = Column(Text, nullable=False, index=True)
    description = Column(Text, nullable=True)
    ward_id = Column(UUID(as_uuid=True), ForeignKey("wards.id", ondelete="SET NULL"), nullable=True)
    centroid = Column(Geometry(geometry_type='POINT', srid=4326), nullable=True, comment="Project location point")
    geom = Column(Geometry(geometry_type='GEOMETRY', srid=4326), nullable=True, comment="Project boundary/line")
    status = Column(String(32), nullable=False, default="proposed", index=True)
    budget_amount = Column(Numeric(14, 2), nullable=True)
    budget_currency = Column(String(8), default="INR")
    start_date = Column(Date, nullable=True)
    expected_end_date = Column(Date, nullable=True)
    confidence_score = Column(Numeric(3, 2), default=0.0, comment="Data confidence 0.0-1.0")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    ward = relationship("Ward", back_populates="projects")
    tenders = relationship("Tender", back_populates="project", cascade="all, delete-orphan")
    contracts = relationship("Contract", back_populates="project", cascade="all, delete-orphan")
    progress_updates = relationship("ProgressUpdate", back_populates="project", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="project")
    reports = relationship("Report", back_populates="project")
    approvals = relationship("Approval", back_populates="project")
    payments = relationship("Payment", back_populates="project")


class Ward(Base):
    """Administrative wards/zones in Mumbai"""
    __tablename__ = "wards"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(Text, nullable=False, unique=True, index=True)
    code = Column(Text, nullable=True, unique=True, index=True)
    geom = Column(Geometry(geometry_type='MULTIPOLYGON', srid=4326), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    projects = relationship("Project", back_populates="ward")


class Tender(Base):
    """Tender/procurement notices"""
    __tablename__ = "tenders"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tender_number = Column(Text, nullable=True, index=True)
    title = Column(Text, nullable=False)
    issuing_agency = Column(Text, nullable=True)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=True)
    tender_value = Column(Numeric(14, 2), nullable=True)
    tender_currency = Column(String(8), default="INR")
    publish_date = Column(Date, nullable=True, index=True)
    close_date = Column(Date, nullable=True)
    award_date = Column(Date, nullable=True)
    awarded_to = Column(UUID(as_uuid=True), ForeignKey("contractors.id", ondelete="SET NULL"), nullable=True)
    source = Column(JSONB, nullable=True, comment="Source URL and metadata")
    raw_document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    project = relationship("Project", back_populates="tenders")
    contractor = relationship("Contractor", foreign_keys=[awarded_to], back_populates="awarded_tenders")
    raw_document = relationship("Document", foreign_keys=[raw_document_id])


class Contractor(Base):
    """Contractors/vendors who execute projects"""
    __tablename__ = "contractors"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(Text, nullable=False, index=True)
    registration_number = Column(Text, nullable=True, unique=True)
    address = Column(Text, nullable=True)
    contact_info = Column(JSONB, nullable=True, comment="Phone, email, website")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    awarded_tenders = relationship("Tender", foreign_keys=[Tender.awarded_to], back_populates="contractor")
    contracts = relationship("Contract", back_populates="contractor")


class Contract(Base):
    """Contract awards linking projects and contractors"""
    __tablename__ = "contracts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    tender_id = Column(UUID(as_uuid=True), ForeignKey("tenders.id", ondelete="SET NULL"), nullable=True)
    contractor_id = Column(UUID(as_uuid=True), ForeignKey("contractors.id", ondelete="SET NULL"), nullable=False)
    contract_value = Column(Numeric(14, 2), nullable=True)
    contract_currency = Column(String(8), default="INR")
    start_date = Column(Date, nullable=True)
    completion_date = Column(Date, nullable=True)
    status = Column(String(32), default="active", comment="active, complete, terminated")
    documents = Column(JSONB, nullable=True, comment="List of contract documents")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    project = relationship("Project", back_populates="contracts")
    tender = relationship("Tender")
    contractor = relationship("Contractor", back_populates="contracts")


class ProgressUpdate(Base):
    """Progress updates from official sources, citizens, or media"""
    __tablename__ = "progress_updates"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    source_id = Column(UUID(as_uuid=True), ForeignKey("sources.id", ondelete="SET NULL"), nullable=True)
    update_type = Column(String(16), nullable=False, comment="official, citizen, media")
    title = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    photos = Column(JSONB, nullable=True, comment="List of photo URLs and metadata")
    location = Column(Geometry(geometry_type='POINT', srid=4326), nullable=True)
    reported_at = Column(DateTime(timezone=True), nullable=True, comment="When event occurred")
    confidence_score = Column(Numeric(3, 2), default=0.0)
    verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    project = relationship("Project", back_populates="progress_updates")
    source = relationship("Source", back_populates="progress_updates")


class Source(Base):
    """Data sources - APIs, websites, documents, citizen reports"""
    __tablename__ = "sources"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(Text, nullable=False, unique=True, index=True)
    source_type = Column(Text, nullable=True, comment="api, website, document, citizen, news")
    url = Column(Text, nullable=True)
    last_retrieved_at = Column(DateTime(timezone=True), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    progress_updates = relationship("ProgressUpdate", back_populates="source")
    documents = relationship("Document", back_populates="source")


class Document(Base):
    """Documents, PDFs, images associated with projects"""
    __tablename__ = "documents"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=True)
    source_id = Column(UUID(as_uuid=True), ForeignKey("sources.id", ondelete="SET NULL"), nullable=True)
    filename = Column(Text, nullable=False)
    s3_url = Column(Text, nullable=True, comment="S3 or local path")
    mime_type = Column(Text, nullable=True)
    text_extracted = Column(Text, nullable=True, comment="OCR/extracted text")
    uploaded_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    project = relationship("Project", back_populates="documents")
    source = relationship("Source", back_populates="documents")
    uploader = relationship("User", back_populates="documents")


class User(Base):
    """Users - citizens, moderators, admins, gov officials"""
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(Text, nullable=False, unique=True, index=True)
    email = Column(Text, nullable=False, unique=True, index=True)
    password_hash = Column(Text, nullable=False)
    role = Column(Text, default="user", comment="user, moderator, admin, gov_official")
    reputation = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    reports = relationship("Report", back_populates="user")
    documents = relationship("Document", back_populates="uploader")
    approvals = relationship("Approval", back_populates="approver")
    audit_logs = relationship("AuditLog", back_populates="user")


class Report(Base):
    """Citizen-submitted reports of projects or issues"""
    __tablename__ = "reports"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="SET NULL"), nullable=True)
    title = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    photos = Column(JSONB, nullable=True)
    location = Column(Geometry(geometry_type='POINT', srid=4326), nullable=True)
    status = Column(Text, default="pending", comment="pending, published, rejected")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="reports")
    project = relationship("Project", back_populates="reports")


class Approval(Base):
    """Project approvals from government departments"""
    __tablename__ = "approvals"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    approver_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    department = Column(Text, nullable=True)
    approval_date = Column(Date, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    project = relationship("Project", back_populates="approvals")
    approver = relationship("User", back_populates="approvals")


class AuditLog(Base):
    """Audit trail for all entity changes"""
    __tablename__ = "audit_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    entity_type = Column(Text, nullable=False, index=True)
    entity_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    action = Column(Text, nullable=False, comment="create, update, delete")
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)
    details = Column(JSONB, nullable=True, comment="Changed fields and values")
    
    # Relationships
    user = relationship("User", back_populates="audit_logs")


class Payment(Base):
    """Project payments and financial transactions"""
    __tablename__ = "payments"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    payment_date = Column(Date, nullable=True)
    amount = Column(Numeric(14, 2), nullable=False)
    payment_source = Column(Text, nullable=True)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    project = relationship("Project", back_populates="payments")
    document = relationship("Document")
