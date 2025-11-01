"""
Report API endpoints (citizen submissions)
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from uuid import UUID

from app.db.session import get_db
from app.db import crud
from app import schemas

router = APIRouter()


@router.get("/", response_model=List[schemas.Report])
async def list_reports(
    status: Optional[str] = Query(None, description="Filter by status (pending, published, rejected)"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Get list of citizen reports"""
    reports = await crud.get_reports(db, status=status, skip=skip, limit=limit)
    return reports


@router.post("/", response_model=schemas.Report, status_code=201)
async def create_report(
    report_data: schemas.ReportCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new citizen report"""
    report = await crud.create_report(db, report_data)
    return report
