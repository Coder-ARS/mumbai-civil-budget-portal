# Mumbai Civil Budget Portal - Frontend Setup Script
# PowerShell script for Windows

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Mumbai Civil Budget Portal" -ForegroundColor Cyan
Write-Host "Frontend Setup Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check npm
Write-Host "Checking npm installation..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✓ npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Create .env.local if it doesn't exist
Write-Host "Setting up environment variables..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    Write-Host "✓ .env.local already exists" -ForegroundColor Green
} else {
    if (Test-Path ".env.local.example") {
        Copy-Item ".env.local.example" ".env.local"
        Write-Host "✓ Created .env.local from template" -ForegroundColor Green
    } else {
        Write-Host "Creating default .env.local..." -ForegroundColor Yellow
        @"
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Map Configuration (Mumbai coordinates)
NEXT_PUBLIC_MAP_CENTER_LAT=19.0760
NEXT_PUBLIC_MAP_CENTER_LNG=72.8777
NEXT_PUBLIC_MAP_DEFAULT_ZOOM=12

# Optional: Analytics, etc.
# NEXT_PUBLIC_GA_ID=your-ga-id
"@ | Out-File -FilePath ".env.local" -Encoding UTF8
        Write-Host "✓ Created default .env.local" -ForegroundColor Green
    }
}

Write-Host ""

# Install dependencies
Write-Host "Installing npm dependencies..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray
try {
    npm install
    Write-Host "✓ Dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Verify installation
Write-Host "Verifying installation..." -ForegroundColor Yellow

$requiredDirs = @("node_modules", "src", "public")
foreach ($dir in $requiredDirs) {
    if (Test-Path $dir) {
        Write-Host "✓ $dir directory exists" -ForegroundColor Green
    } else {
        Write-Host "✗ $dir directory missing" -ForegroundColor Red
    }
}

$requiredFiles = @(
    "package.json",
    "tsconfig.json",
    "next.config.js",
    "tailwind.config.js",
    "src/app/layout.tsx",
    "src/app/page.tsx",
    "src/types/index.ts",
    "src/lib/api-client.ts",
    "src/lib/utils.ts",
    "src/store/index.ts",
    "src/styles/globals.css"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✓ $file exists" -ForegroundColor Green
    } else {
        Write-Host "✗ $file missing" -ForegroundColor Yellow
    }
}

Write-Host ""

# Test backend connectivity
Write-Host "Testing backend API connectivity..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/health" -Method Get -TimeoutSec 5
    Write-Host "✓ Backend API is reachable" -ForegroundColor Green
    Write-Host "  Status: $($response.status)" -ForegroundColor Gray
} catch {
    Write-Host "⚠ Backend API not reachable at http://localhost:8000" -ForegroundColor Yellow
    Write-Host "  Make sure the backend is running before starting the frontend" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Ensure backend is running on http://localhost:8000" -ForegroundColor White
Write-Host "  2. Run development server:" -ForegroundColor White
Write-Host "     npm run dev" -ForegroundColor Cyan
Write-Host "  3. Open browser to http://localhost:3000" -ForegroundColor White
Write-Host ""

Write-Host "Development Commands:" -ForegroundColor Yellow
Write-Host "  npm run dev          - Start development server" -ForegroundColor White
Write-Host "  npm run build        - Build for production" -ForegroundColor White
Write-Host "  npm start            - Start production server" -ForegroundColor White
Write-Host "  npm run lint         - Run ESLint" -ForegroundColor White
Write-Host "  npm run type-check   - Check TypeScript types" -ForegroundColor White
Write-Host ""

Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
