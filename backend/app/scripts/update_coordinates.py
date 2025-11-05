"""
Update script to add coordinates to existing projects
Run this: python -m app.scripts.update_coordinates
"""
import asyncio
from geoalchemy2.elements import WKTElement
from sqlalchemy import select
from app.db.session import AsyncSessionLocal
from app.db import models


# Project coordinates mapping (project title pattern -> coordinates)
PROJECT_COORDINATES = {
    "Coastal Road": "POINT(72.8162 18.9932)",  # Worli Sea Face
    "Andheri Metro": "POINT(72.8697 19.1197)",  # Andheri East
    "Bandra-Kurla Complex": "POINT(72.8681 19.0633)",  # BKC
    "Colaba Water": "POINT(72.8347 18.9067)",  # Colaba
    "Malad Smart": "POINT(72.8489 19.1866)",  # Malad
    "Dadar Market": "POINT(72.8431 19.0176)",  # Dadar
    "Borivali": "POINT(72.8593 19.2403)",  # Borivali
    "Kurla": "POINT(72.8794 19.0728)"  # Kurla
}


async def update_coordinates():
    """Update coordinates for existing projects"""
    print("🗺️ Updating project coordinates...")
    
    async with AsyncSessionLocal() as db:
        try:
            # Get all projects
            result = await db.execute(select(models.Project))
            projects = result.scalars().all()
            
            updated_count = 0
            for project in projects:
                # Find matching coordinate
                for pattern, coords in PROJECT_COORDINATES.items():
                    if pattern.lower() in project.title.lower():
                        # Update centroid
                        project.centroid = WKTElement(coords, srid=4326)
                        updated_count += 1
                        print(f"✅ Updated {project.title}: {coords}")
                        break
            
            # Commit changes
            await db.commit()
            print(f"\n🎉 Successfully updated {updated_count} projects with coordinates!")
            
        except Exception as e:
            await db.rollback()
            print(f"❌ Error updating coordinates: {e}")
            raise


if __name__ == "__main__":
    asyncio.run(update_coordinates())
