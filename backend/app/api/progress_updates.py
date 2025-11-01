"""
Progress Update API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID

from app.db.session import get_db
from app.db import crud
from app import schemas

router = APIRouter()


@router.get("/", response_model=List[schemas.ProgressUpdate])
async def list_progress_updates(
    project_id: UUID = Query(..., description="Project ID to get updates for"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Get progress updates for a specific project"""
    updates = await crud.get_progress_updates(db, project_id=project_id, skip=skip, limit=limit)
    return updates


@router.post("/", response_model=schemas.ProgressUpdate, status_code=201)
async def create_progress_update(
    update_data: schemas.ProgressUpdateCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new progress update"""
    update = await crud.create_progress_update(db, update_data)
    return update
