# Backend Setup Script
Write-Host "Backend Setup Starting..." -ForegroundColor Cyan

# Create virtual environment
if (-Not (Test-Path ".venv")) {
    python -m venv .venv
    Write-Host "Virtual environment created" -ForegroundColor Green
}

# Activate venv
& .venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Create .env if missing
if (-Not (Test-Path ".env")) {
    Copy-Item .env.example .env
    Write-Host ".env created - please update credentials" -ForegroundColor Yellow
}

Write-Host "Setup complete!" -ForegroundColor Green
