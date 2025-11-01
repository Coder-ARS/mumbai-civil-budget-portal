"""
Ward API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID

from app.db.session import get_db
from app.db import crud
from app import schemas

router = APIRouter()


@router.get("/", response_model=List[schemas.Ward])
async def list_wards(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    db: AsyncSession = Depends(get_db)
):
    """Get list of all wards in Mumbai"""
    wards = await crud.get_wards(db, skip=skip, limit=limit)
    return wards


@router.get("/{ward_id}", response_model=schemas.Ward)
async def get_ward(
    ward_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get details of a specific ward"""
    ward = await crud.get_ward(db, ward_id)
    if not ward:
        raise HTTPException(status_code=404, detail="Ward not found")
    return ward


@router.post("/", response_model=schemas.Ward, status_code=201)
async def create_ward(
    ward_data: schemas.WardCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new ward"""
    ward = await crud.create_ward(db, ward_data)
    return ward
