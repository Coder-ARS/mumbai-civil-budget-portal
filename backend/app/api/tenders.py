"""
Tender API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from uuid import UUID

from app.db.session import get_db
from app.db import crud
from app import schemas

router = APIRouter()


@router.get("/", response_model=List[schemas.Tender])
async def list_tenders(
    project_id: Optional[UUID] = Query(None, description="Filter by project ID"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Get list of tenders with optional project filter"""
    tenders = await crud.get_tenders(db, project_id=project_id, skip=skip, limit=limit)
    return tenders


@router.get("/{tender_id}", response_model=schemas.Tender)
async def get_tender(
    tender_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get details of a specific tender"""
    tender = await crud.get_tender(db, tender_id)
    if not tender:
        raise HTTPException(status_code=404, detail="Tender not found")
    return tender


@router.post("/", response_model=schemas.Tender, status_code=201)
async def create_tender(
    tender_data: schemas.TenderCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new tender"""
    tender = await crud.create_tender(db, tender_data)
    return tender
