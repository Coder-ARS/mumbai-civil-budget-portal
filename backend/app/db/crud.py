"""
CRUD (Create, Read, Update, Delete) operations for database models
All functions are async and work with AsyncSession
"""
from sqlalchemy import select, func, or_, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from typing import Optional, List, Dict, Any
from uuid import UUID

from app.db import models
from app import schemas


# ==================== Project CRUD ====================
async def get_project(db: AsyncSession, project_id: UUID) -> Optional[models.Project]:
    """Get a single project by ID with relationships"""
    stmt = (
        select(models.Project)
        .options(
            selectinload(models.Project.ward),
            selectinload(models.Project.tenders),
            selectinload(models.Project.contracts).selectinload(models.Contract.contractor),
            selectinload(models.Project.progress_updates)
        )
        .where(models.Project.id == project_id)
    )
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def get_projects(
    db: AsyncSession,
    filters: schemas.ProjectFilter
) -> tuple[List[models.Project], int]:
    """Get projects with filtering and pagination"""
    # Build base query
    stmt = select(models.Project).options(selectinload(models.Project.ward))
    count_stmt = select(func.count(models.Project.id))
    
    # Apply filters
    conditions = []
    
    if filters.q:
        search_term = f"%{filters.q}%"
        conditions.append(
            or_(
                models.Project.title.ilike(search_term),
                models.Project.description.ilike(search_term)
            )
        )
    
    if filters.ward_id:
        conditions.append(models.Project.ward_id == filters.ward_id)
    
    if filters.status:
        conditions.append(models.Project.status == filters.status)
    
    if filters.min_budget is not None:
        conditions.append(models.Project.budget_amount >= filters.min_budget)
    
    if filters.max_budget is not None:
        conditions.append(models.Project.budget_amount <= filters.max_budget)
    
    if conditions:
        stmt = stmt.where(and_(*conditions))
        count_stmt = count_stmt.where(and_(*conditions))
    
    # Get total count
    count_result = await db.execute(count_stmt)
    total = count_result.scalar()
    
    # Apply ordering and pagination
    stmt = (
        stmt.order_by(models.Project.updated_at.desc())
        .offset(filters.skip)
        .limit(filters.limit)
    )
    
    result = await db.execute(stmt)
    projects = result.scalars().all()
    
    return list(projects), total


async def create_project(
    db: AsyncSession,
    project_data: schemas.ProjectCreate
) -> models.Project:
    """Create a new project"""
    project = models.Project(**project_data.dict())
    db.add(project)
    await db.commit()
    await db.refresh(project)
    return project


async def update_project(
    db: AsyncSession,
    project_id: UUID,
    project_data: schemas.ProjectUpdate
) -> Optional[models.Project]:
    """Update an existing project"""
    stmt = select(models.Project).where(models.Project.id == project_id)
    result = await db.execute(stmt)
    project = result.scalar_one_or_none()
    
    if not project:
        return None
    
    # Update fields
    for field, value in project_data.dict(exclude_unset=True).items():
        setattr(project, field, value)
    
    await db.commit()
    await db.refresh(project)
    return project


async def delete_project(db: AsyncSession, project_id: UUID) -> bool:
    """Delete a project"""
    stmt = select(models.Project).where(models.Project.id == project_id)
    result = await db.execute(stmt)
    project = result.scalar_one_or_none()
    
    if not project:
        return False
    
    await db.delete(project)
    await db.commit()
    return True


# ==================== Ward CRUD ====================
async def get_ward(db: AsyncSession, ward_id: UUID) -> Optional[models.Ward]:
    """Get a single ward by ID"""
    stmt = select(models.Ward).where(models.Ward.id == ward_id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def get_wards(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[models.Ward]:
    """Get all wards"""
    stmt = select(models.Ward).order_by(models.Ward.name).offset(skip).limit(limit)
    result = await db.execute(stmt)
    return list(result.scalars().all())


async def create_ward(db: AsyncSession, ward_data: schemas.WardCreate) -> models.Ward:
    """Create a new ward"""
    ward = models.Ward(**ward_data.dict())
    db.add(ward)
    await db.commit()
    await db.refresh(ward)
    return ward


# ==================== Contractor CRUD ====================
async def get_contractor(db: AsyncSession, contractor_id: UUID) -> Optional[models.Contractor]:
    """Get a single contractor by ID"""
    stmt = select(models.Contractor).where(models.Contractor.id == contractor_id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def get_contractors(
    db: AsyncSession,
    q: Optional[str] = None,
    skip: int = 0,
    limit: int = 50
) -> List[models.Contractor]:
    """Get contractors with optional search"""
    stmt = select(models.Contractor).order_by(models.Contractor.name)
    
    if q:
        search_term = f"%{q}%"
        stmt = stmt.where(models.Contractor.name.ilike(search_term))
    
    stmt = stmt.offset(skip).limit(limit)
    result = await db.execute(stmt)
    return list(result.scalars().all())


async def create_contractor(
    db: AsyncSession,
    contractor_data: schemas.ContractorCreate
) -> models.Contractor:
    """Create a new contractor"""
    contractor = models.Contractor(**contractor_data.dict())
    db.add(contractor)
    await db.commit()
    await db.refresh(contractor)
    return contractor


# ==================== Tender CRUD ====================
async def get_tender(db: AsyncSession, tender_id: UUID) -> Optional[models.Tender]:
    """Get a single tender by ID"""
    stmt = (
        select(models.Tender)
        .options(
            selectinload(models.Tender.project),
            selectinload(models.Tender.contractor)
        )
        .where(models.Tender.id == tender_id)
    )
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def get_tenders(
    db: AsyncSession,
    project_id: Optional[UUID] = None,
    skip: int = 0,
    limit: int = 50
) -> List[models.Tender]:
    """Get tenders with optional project filter"""
    stmt = select(models.Tender).order_by(models.Tender.publish_date.desc())
    
    if project_id:
        stmt = stmt.where(models.Tender.project_id == project_id)
    
    stmt = stmt.offset(skip).limit(limit)
    result = await db.execute(stmt)
    return list(result.scalars().all())


async def create_tender(db: AsyncSession, tender_data: schemas.TenderCreate) -> models.Tender:
    """Create a new tender"""
    tender = models.Tender(**tender_data.dict())
    db.add(tender)
    await db.commit()
    await db.refresh(tender)
    return tender


# ==================== Contract CRUD ====================
async def get_contract(db: AsyncSession, contract_id: UUID) -> Optional[models.Contract]:
    """Get a single contract by ID"""
    stmt = (
        select(models.Contract)
        .options(
            selectinload(models.Contract.project),
            selectinload(models.Contract.contractor)
        )
        .where(models.Contract.id == contract_id)
    )
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def get_contracts(
    db: AsyncSession,
    project_id: Optional[UUID] = None,
    skip: int = 0,
    limit: int = 50
) -> List[models.Contract]:
    """Get contracts with optional project filter"""
    stmt = select(models.Contract).options(selectinload(models.Contract.contractor))
    
    if project_id:
        stmt = stmt.where(models.Contract.project_id == project_id)
    
    stmt = stmt.offset(skip).limit(limit)
    result = await db.execute(stmt)
    return list(result.scalars().all())


async def create_contract(
    db: AsyncSession,
    contract_data: schemas.ContractCreate
) -> models.Contract:
    """Create a new contract"""
    contract = models.Contract(**contract_data.dict())
    db.add(contract)
    await db.commit()
    await db.refresh(contract)
    return contract


# ==================== Progress Update CRUD ====================
async def get_progress_updates(
    db: AsyncSession,
    project_id: UUID,
    skip: int = 0,
    limit: int = 50
) -> List[models.ProgressUpdate]:
    """Get progress updates for a project"""
    stmt = (
        select(models.ProgressUpdate)
        .where(models.ProgressUpdate.project_id == project_id)
        .order_by(models.ProgressUpdate.reported_at.desc())
        .offset(skip)
        .limit(limit)
    )
    result = await db.execute(stmt)
    return list(result.scalars().all())


async def create_progress_update(
    db: AsyncSession,
    update_data: schemas.ProgressUpdateCreate
) -> models.ProgressUpdate:
    """Create a new progress update"""
    update = models.ProgressUpdate(**update_data.dict())
    db.add(update)
    await db.commit()
    await db.refresh(update)
    return update


# ==================== Source CRUD ====================
async def get_sources(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[models.Source]:
    """Get all data sources"""
    stmt = select(models.Source).order_by(models.Source.name).offset(skip).limit(limit)
    result = await db.execute(stmt)
    return list(result.scalars().all())


async def create_source(db: AsyncSession, source_data: schemas.SourceCreate) -> models.Source:
    """Create a new data source"""
    source = models.Source(**source_data.dict())
    db.add(source)
    await db.commit()
    await db.refresh(source)
    return source


# ==================== User CRUD ====================
async def get_user_by_username(db: AsyncSession, username: str) -> Optional[models.User]:
    """Get user by username"""
    stmt = select(models.User).where(models.User.username == username)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def get_user_by_email(db: AsyncSession, email: str) -> Optional[models.User]:
    """Get user by email"""
    stmt = select(models.User).where(models.User.email == email)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def create_user(db: AsyncSession, user_data: schemas.UserCreate) -> models.User:
    """Create a new user (password should be hashed before calling this)"""
    user_dict = user_data.dict()
    # Note: Hash password before storing - implement in auth module
    user = models.User(**user_dict)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


# ==================== Report CRUD ====================
async def get_reports(
    db: AsyncSession,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 50
) -> List[models.Report]:
    """Get citizen reports"""
    stmt = select(models.Report).order_by(models.Report.created_at.desc())
    
    if status:
        stmt = stmt.where(models.Report.status == status)
    
    stmt = stmt.offset(skip).limit(limit)
    result = await db.execute(stmt)
    return list(result.scalars().all())


async def create_report(db: AsyncSession, report_data: schemas.ReportCreate) -> models.Report:
    """Create a new citizen report"""
    report = models.Report(**report_data.dict())
    db.add(report)
    await db.commit()
    await db.refresh(report)
    return report
