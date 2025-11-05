"""
Comment API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID

from app.db.session import get_db
from app.db import crud
from app import schemas

router = APIRouter()


@router.get("/{project_id}/comments", response_model=List[schemas.Comment])
async def get_project_comments(
    project_id: UUID,
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=200, description="Number of records to return"),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all approved comments for a specific project
    
    - **project_id**: UUID of the project
    - **skip**: Pagination offset
    - **limit**: Number of comments to return
    """
    comments = await crud.get_project_comments(db, project_id, skip, limit)
    return comments


@router.post("/{project_id}/comments", response_model=schemas.Comment, status_code=201)
async def create_project_comment(
    project_id: UUID,
    comment_data: schemas.CommentBase,
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new comment on a project
    
    - **project_id**: UUID of the project to comment on
    - **author_name**: Name of the person commenting (required)
    - **author_email**: Email of the person (optional)
    - **comment_text**: The comment text (required)
    - **rating**: Optional rating from 1-5 stars
    """
    # Verify project exists
    project = await crud.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Create comment with project_id
    comment_create = schemas.CommentCreate(
        project_id=project_id,
        **comment_data.dict()
    )
    
    comment = await crud.create_comment(db, comment_create)
    return comment


@router.get("/comments/{comment_id}", response_model=schemas.Comment)
async def get_comment(
    comment_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific comment by ID"""
    comment = await crud.get_comment(db, comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    return comment


@router.patch("/comments/{comment_id}", response_model=schemas.Comment)
async def update_comment(
    comment_id: UUID,
    comment_update: schemas.CommentUpdate,
    db: AsyncSession = Depends(get_db)
):
    """
    Update a comment (moderation/editing)
    
    - **comment_id**: UUID of the comment
    - **comment_text**: Updated comment text (optional)
    - **rating**: Updated rating (optional)
    - **is_approved**: Moderation flag (optional)
    """
    comment = await crud.update_comment(db, comment_id, comment_update)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    return comment


@router.delete("/comments/{comment_id}", status_code=204)
async def delete_comment(
    comment_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """
    Delete a comment
    
    - **comment_id**: UUID of the comment to delete
    """
    success = await crud.delete_comment(db, comment_id)
    if not success:
        raise HTTPException(status_code=404, detail="Comment not found")
    return None
