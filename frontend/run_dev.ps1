# Mumbai Civil Budget Portal - Development Server
# PowerShell script to run the frontend development server

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Mumbai Civil Budget Portal" -ForegroundColor Cyan
Write-Host "Starting Frontend Dev Server" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠ node_modules not found!" -ForegroundColor Yellow
    Write-Host "Running npm install..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "⚠ .env.local not found!" -ForegroundColor Yellow
    Write-Host "Creating default .env.local..." -ForegroundColor Yellow
    @"
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Map Configuration (Mumbai coordinates)
NEXT_PUBLIC_MAP_CENTER_LAT=19.0760
NEXT_PUBLIC_MAP_CENTER_LNG=72.8777
NEXT_PUBLIC_MAP_DEFAULT_ZOOM=12
"@ | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Host "✓ Created .env.local" -ForegroundColor Green
    Write-Host ""
}

# Test backend connectivity
Write-Host "Checking backend connectivity..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/health" -Method Get -TimeoutSec 3
    Write-Host "✓ Backend API is running" -ForegroundColor Green
    Write-Host "  URL: http://localhost:8000" -ForegroundColor Gray
    Write-Host "  Status: $($response.status)" -ForegroundColor Gray
} catch {
    Write-Host "⚠ Backend API not reachable!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please start the backend first:" -ForegroundColor Yellow
    Write-Host "  cd ..\backend" -ForegroundColor White
    Write-Host "  .\run_dev.ps1" -ForegroundColor White
    Write-Host ""
    
    $continue = Read-Host "Continue anyway? (y/N)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        Write-Host "Exiting..." -ForegroundColor Gray
        exit 0
    }
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Starting Next.js Dev Server..." -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend will be available at:" -ForegroundColor Yellow
Write-Host "  http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

# Start Next.js dev server
npm run dev
