# Quick Start Guide - Mumbai Civil Budget Portal Backend

## 🎯 Fastest Way to Get Started

### 1. Install PostgreSQL
- Download: https://www.postgresql.org/download/windows/
- During installation, remember your postgres user password
- Install Stack Builder → PostGIS extension

### 2. Run Setup Script
```powershell
cd backend
.\setup.ps1
```

### 3. Create Database
Open Command Prompt or PowerShell:
```powershell
# Login to PostgreSQL (enter your password when prompted)
psql -U postgres

# Run these commands:
CREATE DATABASE mcportal;
\c mcportal
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;
\q
```

### 4. Configure Database
Edit `backend\.env` file:
```env
POSTGRES_PASSWORD=your_postgres_password_here
```

### 5. Setup Database Tables
```powershell
# Make sure you're in backend folder and venv is activated
cd backend
.venv\Scripts\Activate.ps1

# Create and apply migrations
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

### 6. Add Sample Data
```powershell
python -m app.scripts.seed_data
```

### 7. Start Server
```powershell
# Option 1: Use the run script
.\run_dev.ps1

# Option 2: Run directly
uvicorn app.main:app --reload
```

### 8. Test It!
Open your browser:
- API Docs: http://localhost:8000/docs
- Test endpoint: http://localhost:8000/health

## 🎉 That's It!

You should now see:
- 24 Mumbai wards
- 8 sample projects
- 5 contractors
- Sample tenders and contracts

## 🆘 Common Issues

### "psql is not recognized"
Add PostgreSQL bin folder to PATH:
- Usually: `C:\Program Files\PostgreSQL\14\bin`

### "Import could not be resolved"
Make sure virtual environment is activated:
```powershell
.venv\Scripts\Activate.ps1
```

### "Cannot connect to database"
Check:
1. PostgreSQL service is running (Services → postgresql-x64-14)
2. Password in `.env` matches your postgres password
3. Database `mcportal` exists

### "Execution policy" error
Run PowerShell as Administrator:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 📖 Full Documentation
See `README.md` for complete documentation.
