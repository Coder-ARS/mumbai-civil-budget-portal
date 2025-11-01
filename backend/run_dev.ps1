# Run development server with auto-reload
Write-Host "🚀 Starting Mumbai Civil Budget Portal Backend..." -ForegroundColor Cyan
Write-Host ""

# Activate virtual environment
& .venv\Scripts\Activate.ps1

# Start uvicorn with reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
