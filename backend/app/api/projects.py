"""
Project API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional, Dict, Any
from uuid import UUID
from decimal import Decimal

from app.db.session import get_db
from app.db import crud, models
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


@router.get("/stats/dashboard", response_model=Dict[str, Any])
async def get_dashboard_stats(db: AsyncSession = Depends(get_db)):
    """
    Get dashboard statistics for all projects
    
    Returns:
    - total_projects: Total number of projects
    - total_budget: Total budget across all projects (in crores)
    - projects_by_status: Count of projects by status
    - active_projects: Number of in-progress projects
    - completed_projects: Number of completed projects
    """
    # Get total projects count
    total_result = await db.execute(select(func.count(models.Project.id)))
    total_projects = total_result.scalar()
    
    # Get total budget
    budget_result = await db.execute(
        select(func.sum(models.Project.budget_amount))
    )
    total_budget_raw = budget_result.scalar() or 0
    total_budget = float(Decimal(str(total_budget_raw)) / Decimal("10000000"))  # Convert to crores
    
    # Get projects by status
    status_result = await db.execute(
        select(
            models.Project.status,
            func.count(models.Project.id).label('count')
        ).group_by(models.Project.status)
    )
    projects_by_status = {row[0]: row[1] for row in status_result.all()}
    
    # Get active (in_progress) projects
    active_projects = projects_by_status.get('in_progress', 0)
    
    # Get completed projects
    completed_projects = projects_by_status.get('completed', 0)
    
    # Get proposed projects
    proposed_projects = projects_by_status.get('proposed', 0)
    
    # Get tendered projects
    tendered_projects = projects_by_status.get('tendered', 0)
    
    return {
        "total_projects": total_projects,
        "total_budget": round(total_budget, 2),
        "active_projects": active_projects,
        "completed_projects": completed_projects,
        "proposed_projects": proposed_projects,
        "tendered_projects": tendered_projects,
        "projects_by_status": projects_by_status
    }
