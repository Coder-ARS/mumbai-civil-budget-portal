"""
Contract API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from uuid import UUID

from app.db.session import get_db
from app.db import crud
from app import schemas

router = APIRouter()


@router.get("/", response_model=List[schemas.Contract])
async def list_contracts(
    project_id: Optional[UUID] = Query(None, description="Filter by project ID"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Get list of contracts with optional project filter"""
    contracts = await crud.get_contracts(db, project_id=project_id, skip=skip, limit=limit)
    return contracts


@router.get("/{contract_id}", response_model=schemas.Contract)
async def get_contract(
    contract_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get details of a specific contract"""
    contract = await crud.get_contract(db, contract_id)
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    return contract


@router.post("/", response_model=schemas.Contract, status_code=201)
async def create_contract(
    contract_data: schemas.ContractCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new contract"""
    contract = await crud.create_contract(db, contract_data)
    return contract
