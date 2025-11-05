"""add comments table

Revision ID: add_comments_table
Revises: f25204ffcd78
Create Date: 2025-11-05 14:30:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'add_comments_table'
down_revision = 'f25204ffcd78'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create comments table
    op.create_table(
        'comments',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('project_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('author_name', sa.String(length=255), nullable=False),
        sa.Column('author_email', sa.String(length=255), nullable=True),
        sa.Column('comment_text', sa.Text(), nullable=False),
        sa.Column('rating', sa.Integer(), nullable=True),
        sa.Column('is_approved', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes
    op.create_index('ix_comments_project_id', 'comments', ['project_id'])
    op.create_index('ix_comments_created_at', 'comments', ['created_at'])
    
    # Create foreign key
    op.create_foreign_key(
        'fk_comments_project_id',
        'comments', 'projects',
        ['project_id'], ['id'],
        ondelete='CASCADE'
    )


def downgrade() -> None:
    op.drop_table('comments')
