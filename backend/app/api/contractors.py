"""
Contractor API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from uuid import UUID

from app.db.session import get_db
from app.db import crud
from app import schemas

router = APIRouter()


@router.get("/", response_model=List[schemas.Contractor])
async def list_contractors(
    q: Optional[str] = Query(None, description="Search contractor name"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Get list of contractors with optional search"""
    contractors = await crud.get_contractors(db, q=q, skip=skip, limit=limit)
    return contractors


@router.get("/{contractor_id}", response_model=schemas.Contractor)
async def get_contractor(
    contractor_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get details of a specific contractor"""
    contractor = await crud.get_contractor(db, contractor_id)
    if not contractor:
        raise HTTPException(status_code=404, detail="Contractor not found")
    return contractor


@router.post("/", response_model=schemas.Contractor, status_code=201)
async def create_contractor(
    contractor_data: schemas.ContractorCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new contractor"""
    contractor = await crud.create_contractor(db, contractor_data)
    return contractor
