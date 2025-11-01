from pydantic import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    PROJECT_NAME: str = "Mumbai Civil Budget Portal"
    DEBUG: bool = True
    
    # Database
    POSTGRES_USER: str = "mcportal"
    POSTGRES_PASSWORD: str = "mcportalpass"
    POSTGRES_DB: str = "mcportal"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    DATABASE_URL: Optional[str] = None
    
    # Security
    JWT_SECRET: str = "replace_with_strong_secret"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # CORS
    BACKEND_CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:5173"]

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

# Build DATABASE_URL if not provided
if not settings.DATABASE_URL:
    # Handle empty password case
    if settings.POSTGRES_PASSWORD:
        settings.DATABASE_URL = (
            f"postgresql+asyncpg://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}"
            f"@{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}"
        )
    else:
        # No password specified - connect without password
        settings.DATABASE_URL = (
            f"postgresql+asyncpg://{settings.POSTGRES_USER}"
            f"@{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}"
        )
