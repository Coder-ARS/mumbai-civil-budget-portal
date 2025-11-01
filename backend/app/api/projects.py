"""
Project API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from uuid import UUID

from app.db.session import get_db
from app.db import crud
from app import schemas

router = APIRouter()


@router.get("/", response_model=schemas.PaginatedResponse)
async def list_projects(
    q: Optional[str] = Query(None, description="Search query for title/description"),
    ward_id: Optional[UUID] = Query(None, description="Filter by ward ID"),
    status: Optional[str] = Query(None, description="Filter by status"),
    min_budget: Optional[float] = Query(None, description="Minimum budget"),
    max_budget: Optional[float] = Query(None, description="Maximum budget"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(50, ge=1, le=100, description="Number of records to return"),
    db: AsyncSession = Depends(get_db)
):
    """
    Get list of projects with filtering and pagination
    
    - **q**: Search in title and description
    - **ward_id**: Filter by specific ward
    - **status**: Filter by project status (proposed, tendered, awarded, in_progress, completed, stalled)
    - **min_budget**: Minimum budget amount
    - **max_budget**: Maximum budget amount
    """
    filters = schemas.ProjectFilter(
        q=q,
        ward_id=ward_id,
        status=status,
        min_budget=min_budget,
        max_budget=max_budget,
        skip=skip,
        limit=limit
    )
    
    projects, total = await crud.get_projects(db, filters)
    
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "items": projects
    }


@router.get("/{project_id}", response_model=schemas.ProjectDetail)
async def get_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get detailed information about a specific project"""
    project = await crud.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.post("/", response_model=schemas.ProjectDetail, status_code=201)
async def create_project(
    project_data: schemas.ProjectCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new project"""
    project = await crud.create_project(db, project_data)
    return project


@router.put("/{project_id}", response_model=schemas.ProjectDetail)
async def update_project(
    project_id: UUID,
    project_data: schemas.ProjectUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update an existing project"""
    project = await crud.update_project(db, project_id, project_data)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.delete("/{project_id}", status_code=204)
async def delete_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Delete a project"""
    success = await crud.delete_project(db, project_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")
    return None
