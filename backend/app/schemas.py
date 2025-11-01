"""
Pydantic schemas for API request/response validation
"""
from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import date, datetime
from uuid import UUID
from decimal import Decimal


# ==================== Ward Schemas ====================
class WardBase(BaseModel):
    name: str
    code: Optional[str] = None


class WardCreate(WardBase):
    pass


class WardUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None


class Ward(WardBase):
    id: UUID
    created_at: datetime
    
    class Config:
        orm_mode = True


# ==================== Project Schemas ====================
class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    ward_id: Optional[UUID] = None
    status: str = "proposed"
    budget_amount: Optional[Decimal] = None
    budget_currency: str = "INR"
    start_date: Optional[date] = None
    expected_end_date: Optional[date] = None


class ProjectCreate(ProjectBase):
    external_ids: Optional[Dict[str, str]] = {}


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    ward_id: Optional[UUID] = None
    status: Optional[str] = None
    budget_amount: Optional[Decimal] = None
    start_date: Optional[date] = None
    expected_end_date: Optional[date] = None


class ProjectSummary(BaseModel):
    id: UUID
    title: str
    status: str
    budget_amount: Optional[Decimal]
    budget_currency: Optional[str]
    confidence_score: Optional[Decimal]
    ward_id: Optional[UUID]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True


class ProjectDetail(ProjectBase):
    id: UUID
    external_ids: Dict[str, Any]
    confidence_score: Decimal
    created_at: datetime
    updated_at: datetime
    ward: Optional[Ward] = None
    
    class Config:
        orm_mode = True


# ==================== Contractor Schemas ====================
class ContractorBase(BaseModel):
    name: str
    registration_number: Optional[str] = None
    address: Optional[str] = None
    contact_info: Optional[Dict[str, Any]] = None


class ContractorCreate(ContractorBase):
    pass


class ContractorUpdate(BaseModel):
    name: Optional[str] = None
    registration_number: Optional[str] = None
    address: Optional[str] = None
    contact_info: Optional[Dict[str, Any]] = None


class Contractor(ContractorBase):
    id: UUID
    created_at: datetime
    
    class Config:
        orm_mode = True


# ==================== Tender Schemas ====================
class TenderBase(BaseModel):
    tender_number: Optional[str] = None
    title: str
    issuing_agency: Optional[str] = None
    project_id: Optional[UUID] = None
    tender_value: Optional[Decimal] = None
    tender_currency: str = "INR"
    publish_date: Optional[date] = None
    close_date: Optional[date] = None
    award_date: Optional[date] = None
    awarded_to: Optional[UUID] = None


class TenderCreate(TenderBase):
    source: Optional[Dict[str, Any]] = None


class TenderUpdate(BaseModel):
    title: Optional[str] = None
    tender_value: Optional[Decimal] = None
    award_date: Optional[date] = None
    awarded_to: Optional[UUID] = None


class Tender(TenderBase):
    id: UUID
    source: Optional[Dict[str, Any]]
    created_at: datetime
    
    class Config:
        orm_mode = True


# ==================== Contract Schemas ====================
class ContractBase(BaseModel):
    project_id: UUID
    contractor_id: UUID
    tender_id: Optional[UUID] = None
    contract_value: Optional[Decimal] = None
    contract_currency: str = "INR"
    start_date: Optional[date] = None
    completion_date: Optional[date] = None
    status: str = "active"


class ContractCreate(ContractBase):
    documents: Optional[Dict[str, Any]] = None


class ContractUpdate(BaseModel):
    status: Optional[str] = None
    completion_date: Optional[date] = None


class Contract(ContractBase):
    id: UUID
    documents: Optional[Dict[str, Any]]
    created_at: datetime
    contractor: Optional[Contractor] = None
    
    class Config:
        orm_mode = True


# ==================== Progress Update Schemas ====================
class ProgressUpdateBase(BaseModel):
    project_id: UUID
    update_type: str  # official, citizen, media
    title: Optional[str] = None
    description: Optional[str] = None
    photos: Optional[List[Dict[str, Any]]] = None
    reported_at: Optional[datetime] = None
    verified: bool = False


class ProgressUpdateCreate(ProgressUpdateBase):
    source_id: Optional[UUID] = None


class ProgressUpdateUpdate(BaseModel):
    verified: Optional[bool] = None
    description: Optional[str] = None


class ProgressUpdate(ProgressUpdateBase):
    id: UUID
    confidence_score: Decimal
    created_at: datetime
    
    class Config:
        orm_mode = True


# ==================== Source Schemas ====================
class SourceBase(BaseModel):
    name: str
    source_type: Optional[str] = None  # api, website, document, citizen, news
    url: Optional[str] = None
    notes: Optional[str] = None


class SourceCreate(SourceBase):
    pass


class Source(SourceBase):
    id: UUID
    last_retrieved_at: Optional[datetime]
    created_at: datetime
    
    class Config:
        orm_mode = True


# ==================== User Schemas ====================
class UserBase(BaseModel):
    username: str
    email: str
    role: str = "user"


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None


class User(UserBase):
    id: UUID
    reputation: int
    is_active: bool
    created_at: datetime
    
    class Config:
        orm_mode = True


# ==================== Report Schemas ====================
class ReportBase(BaseModel):
    title: str
    description: Optional[str] = None
    project_id: Optional[UUID] = None
    photos: Optional[List[Dict[str, Any]]] = None
    status: str = "pending"


class ReportCreate(ReportBase):
    pass


class Report(ReportBase):
    id: UUID
    user_id: Optional[UUID]
    created_at: datetime
    
    class Config:
        orm_mode = True


# ==================== Document Schemas ====================
class DocumentBase(BaseModel):
    filename: str
    project_id: Optional[UUID] = None
    mime_type: Optional[str] = None


class DocumentCreate(DocumentBase):
    s3_url: Optional[str] = None
    text_extracted: Optional[str] = None


class Document(DocumentBase):
    id: UUID
    s3_url: Optional[str]
    uploaded_at: datetime
    
    class Config:
        orm_mode = True


# ==================== Payment Schemas ====================
class PaymentBase(BaseModel):
    project_id: UUID
    amount: Decimal
    payment_date: Optional[date] = None
    payment_source: Optional[str] = None


class PaymentCreate(PaymentBase):
    document_id: Optional[UUID] = None


class Payment(PaymentBase):
    id: UUID
    created_at: datetime
    
    class Config:
        orm_mode = True


# ==================== Search/Filter Schemas ====================
class ProjectFilter(BaseModel):
    """Query parameters for filtering projects"""
    q: Optional[str] = None  # Search query
    ward_id: Optional[UUID] = None
    status: Optional[str] = None
    min_budget: Optional[Decimal] = None
    max_budget: Optional[Decimal] = None
    skip: int = 0
    limit: int = 50


class PaginatedResponse(BaseModel):
    """Generic paginated response"""
    total: int
    skip: int
    limit: int
    items: List[Any]
