# Mumbai Civil Budget Portal - Master Setup Script
# Runs both backend and frontend setup

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "          Mumbai Civil Budget Portal" -ForegroundColor Cyan
Write-Host "          Full Stack Setup Script" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

# Function to check if a command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# ============================================================================
# PRE-FLIGHT CHECKS
# ============================================================================

Write-Host "Running Pre-flight Checks..." -ForegroundColor Yellow
Write-Host ""

# Check Python
if (Test-Command python) {
    $pythonVersion = python --version
    Write-Host "✓ Python found: $pythonVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Python not found!" -ForegroundColor Red
    Write-Host "  Please install Python 3.9+ from https://www.python.org/" -ForegroundColor Red
    exit 1
}

# Check Node.js
if (Test-Command node) {
    $nodeVersion = node --version
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js not found!" -ForegroundColor Red
    Write-Host "  Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check PostgreSQL
if (Test-Command psql) {
    $psqlVersion = psql --version
    Write-Host "✓ PostgreSQL found: $psqlVersion" -ForegroundColor Green
} else {
    Write-Host "⚠ PostgreSQL (psql) not found in PATH" -ForegroundColor Yellow
    Write-Host "  Make sure PostgreSQL is installed and accessible" -ForegroundColor Yellow
}

Write-Host ""

# ============================================================================
# BACKEND SETUP
# ============================================================================

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "Setting up BACKEND..." -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

$backendPath = Join-Path $projectRoot "backend"

if (Test-Path $backendPath) {
    Push-Location $backendPath
    
    Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
    
    # Check if virtual environment exists
    if (-not (Test-Path "venv")) {
        Write-Host "Creating virtual environment..." -ForegroundColor Yellow
        python -m venv venv
        Write-Host "✓ Virtual environment created" -ForegroundColor Green
    } else {
        Write-Host "✓ Virtual environment already exists" -ForegroundColor Green
    }
    
    # Activate virtual environment and install dependencies
    Write-Host "Activating virtual environment..." -ForegroundColor Yellow
    & ".\venv\Scripts\Activate.ps1"
    
    if (Test-Path "requirements.txt") {
        Write-Host "Installing Python packages..." -ForegroundColor Yellow
        pip install -r requirements.txt --quiet
        Write-Host "✓ Python dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "⚠ requirements.txt not found" -ForegroundColor Yellow
    }
    
    # Check .env file
    if (-not (Test-Path ".env")) {
        if (Test-Path ".env.example") {
            Write-Host "Creating .env from template..." -ForegroundColor Yellow
            Copy-Item ".env.example" ".env"
            Write-Host "✓ .env created - Please update with your database credentials" -ForegroundColor Green
        } else {
            Write-Host "⚠ .env file not found" -ForegroundColor Yellow
        }
    } else {
        Write-Host "✓ .env file exists" -ForegroundColor Green
    }
    
    Pop-Location
} else {
    Write-Host "✗ Backend directory not found at: $backendPath" -ForegroundColor Red
}

Write-Host ""

# ============================================================================
# FRONTEND SETUP
# ============================================================================

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "Setting up FRONTEND..." -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

$frontendPath = Join-Path $projectRoot "frontend"

if (Test-Path $frontendPath) {
    Push-Location $frontendPath
    
    Write-Host "Installing npm dependencies..." -ForegroundColor Yellow
    Write-Host "This may take a few minutes..." -ForegroundColor Gray
    
    if (Test-Path "package.json") {
        npm install
        Write-Host "✓ npm dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "✗ package.json not found" -ForegroundColor Red
    }
    
    # Check .env.local file
    if (-not (Test-Path ".env.local")) {
        if (Test-Path ".env.local.example") {
            Write-Host "Creating .env.local from template..." -ForegroundColor Yellow
            Copy-Item ".env.local.example" ".env.local"
            Write-Host "✓ .env.local created" -ForegroundColor Green
        } else {
            Write-Host "Creating default .env.local..." -ForegroundColor Yellow
            @"
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Map Configuration (Mumbai coordinates)
NEXT_PUBLIC_MAP_CENTER_LAT=19.0760
NEXT_PUBLIC_MAP_CENTER_LNG=72.8777
NEXT_PUBLIC_MAP_DEFAULT_ZOOM=12
"@ | Out-File -FilePath ".env.local" -Encoding UTF8
            Write-Host "✓ .env.local created" -ForegroundColor Green
        }
    } else {
        Write-Host "✓ .env.local exists" -ForegroundColor Green
    }
    
    Pop-Location
} else {
    Write-Host "✗ Frontend directory not found at: $frontendPath" -ForegroundColor Red
}

Write-Host ""

# ============================================================================
# SUMMARY
# ============================================================================

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Project Structure:" -ForegroundColor Yellow
Write-Host "  Backend:  $backendPath" -ForegroundColor White
Write-Host "  Frontend: $frontendPath" -ForegroundColor White
Write-Host ""

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Database Setup (if not done):" -ForegroundColor White
Write-Host "   Open PostgreSQL and run:" -ForegroundColor Gray
Write-Host "     CREATE DATABASE mumbai_civil_budget;" -ForegroundColor Cyan
Write-Host "     CREATE EXTENSION IF NOT EXISTS postgis;" -ForegroundColor Cyan
Write-Host "     CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";" -ForegroundColor Cyan
Write-Host ""

Write-Host "2. Update Backend .env file:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Cyan
Write-Host "   notepad .env" -ForegroundColor Cyan
Write-Host "   (Update POSTGRES_USER, POSTGRES_PASSWORD, etc.)" -ForegroundColor Gray
Write-Host ""

Write-Host "3. Run Database Migrations:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Cyan
Write-Host "   .\venv\Scripts\Activate.ps1" -ForegroundColor Cyan
Write-Host "   alembic upgrade head" -ForegroundColor Cyan
Write-Host "   python -m app.scripts.seed_data" -ForegroundColor Cyan
Write-Host ""

Write-Host "4. Start Backend Server:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Cyan
Write-Host "   .\run_dev.ps1" -ForegroundColor Cyan
Write-Host "   (Opens at http://localhost:8000)" -ForegroundColor Gray
Write-Host ""

Write-Host "5. Start Frontend Server (in new terminal):" -ForegroundColor White
Write-Host "   cd frontend" -ForegroundColor Cyan
Write-Host "   .\run_dev.ps1" -ForegroundColor Cyan
Write-Host "   (Opens at http://localhost:3000)" -ForegroundColor Gray
Write-Host ""

Write-Host "Quick Start Scripts:" -ForegroundColor Yellow
Write-Host "  Backend:  cd backend && .\run_dev.ps1" -ForegroundColor Cyan
Write-Host "  Frontend: cd frontend && .\run_dev.ps1" -ForegroundColor Cyan
Write-Host ""

Write-Host "Documentation:" -ForegroundColor Yellow
Write-Host "  Backend:  backend\README.md" -ForegroundColor White
Write-Host "  Frontend: frontend\README.md" -ForegroundColor White
Write-Host "  Quick Start: backend\QUICKSTART.md & frontend\QUICKSTART.md" -ForegroundColor White
Write-Host ""

Write-Host "API Documentation (once backend is running):" -ForegroundColor Yellow
Write-Host "  Swagger UI: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "  ReDoc:      http://localhost:8000/redoc" -ForegroundColor Cyan
Write-Host ""

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "Happy Coding! 🚀" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
