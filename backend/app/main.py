"""
Main FastAPI application entry point
Mumbai Civic Budget Portal - Backend API
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.session import async_engine
from app.api import (
    projects,
    wards,
    contractors,
    tenders,
    contracts,
    progress_updates,
    reports,
    comments
)

# Create FastAPI app instance
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API for Mumbai Civic Budget Portal - Track infrastructure projects, tenders, and citizen reports",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(projects.router, prefix="/api/v1/projects", tags=["Projects"])
app.include_router(wards.router, prefix="/api/v1/wards", tags=["Wards"])
app.include_router(contractors.router, prefix="/api/v1/contractors", tags=["Contractors"])
app.include_router(tenders.router, prefix="/api/v1/tenders", tags=["Tenders"])
app.include_router(contracts.router, prefix="/api/v1/contracts", tags=["Contracts"])
app.include_router(progress_updates.router, prefix="/api/v1/progress-updates", tags=["Progress Updates"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["Reports"])
app.include_router(comments.router, prefix="/api/v1/projects", tags=["Comments"])


@app.get("/", tags=["Health"])
async def root():
    """Root endpoint - API health check"""
    return {
        "message": "Mumbai Civic Budget Portal API",
        "status": "operational",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    print(f"🚀 Starting {settings.PROJECT_NAME}")
    print(f"📚 API Documentation: http://localhost:8000/docs")
    print(f"🔧 Debug mode: {settings.DEBUG}")


@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown"""
    print("👋 Shutting down application...")
    await async_engine.dispose()
    print("✅ Database connections closed")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
