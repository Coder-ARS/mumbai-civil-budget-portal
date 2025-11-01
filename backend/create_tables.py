"""
Quick script to create all database tables
"""
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from app.core.config import settings
from app.db.base import Base


async def create_tables():
    """Create all tables in the database"""
    print(f"Creating tables with URL: {settings.DATABASE_URL}")
    
    engine = create_async_engine(settings.DATABASE_URL, echo=True)
    
    async with engine.begin() as conn:
        # Drop all tables first (clean slate)
        print("\n🗑️  Dropping existing tables...")
        await conn.run_sync(Base.metadata.drop_all)
        
        # Create all tables
        print("\n✨ Creating all tables...")
        await conn.run_sync(Base.metadata.create_all)
    
    await engine.dispose()
    print("\n✅ All tables created successfully!")


if __name__ == "__main__":
    asyncio.run(create_tables())
