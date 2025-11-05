# Mumbai Civic Budget Portal - Complete Setup Guide

This guide will help you set up the entire project from scratch after cloning from Git.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software:
1. **Git** - [Download](https://git-scm.com/downloads)
2. **PostgreSQL 14+** with **PostGIS** extension - [Download](https://www.postgresql.org/download/)
3. **Python 3.12** - [Download](https://www.python.org/downloads/)
4. **Node.js 18+** and **npm** - [Download](https://nodejs.org/)

### Verify Installations:
```powershell
git --version
python --version
node --version
npm --version
psql --version
```

---

## 🚀 Step 1: Clone the Repository

```powershell
# Clone the repository
git clone https://github.com/Coder-ARS/mumbai-civil-budget-portal.git

# Navigate to project directory
cd mumbai-civil-budget-portal
```

---

## 🗄️ Step 2: Database Setup

### 2.1 Start PostgreSQL Service
```powershell
# On Windows (run as Administrator)
Start-Service postgresql-x64-14  # Adjust version number if needed

# Or start manually from Services app (services.msc)
```

### 2.2 Create Database
```powershell
# Open PostgreSQL command line
psql -U postgres

# In psql prompt, run:
```

```sql
-- Create database
CREATE DATABASE mcportal;

-- Connect to the database
\c mcportal

-- Enable PostGIS extension
CREATE EXTENSION postgis;

-- Verify PostGIS is installed
SELECT PostGIS_version();

-- Exit psql
\q
```

### 2.3 Configure Database Connection

Create a `.env` file in the `backend` directory:

```powershell
# Navigate to backend folder
cd backend

# Create .env file (Windows)
New-Item -Path .env -ItemType File
```

Add the following content to `backend/.env`:

```env
# Database Configuration
DATABASE_URL=postgresql+asyncpg://postgres:your_password@localhost:5432/mcportal

# Replace 'your_password' with your PostgreSQL password
# Example: postgresql+asyncpg://postgres:admin123@localhost:5432/mcportal

# API Configuration
API_V1_STR=/api/v1
PROJECT_NAME=Mumbai Civic Budget Portal

# CORS Origins (comma-separated)
BACKEND_CORS_ORIGINS=http://localhost:3000,http://localhost:3002
```

**Important:** Replace `your_password` with your actual PostgreSQL password!

---

## 🐍 Step 3: Backend Setup

### 3.1 Navigate to Backend Directory
```powershell
# If not already in backend folder
cd backend
```

### 3.2 Create Virtual Environment
```powershell
# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# If you get execution policy error, run this first:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 3.3 Install Python Dependencies
```powershell
# Upgrade pip
python -m pip install --upgrade pip

# Install all dependencies
pip install -r requirements.txt
```

### 3.4 Run Database Migrations
```powershell
# Create initial migration (if needed)
alembic upgrade head
```

### 3.5 Seed the Database
```powershell
# Run the seed script to populate database with sample data
python -m app.scripts.seed_data
```

This will create:
- ✅ 24 Municipal Wards
- ✅ 8 Infrastructure Projects with real Mumbai locations
- ✅ Contractors and Tenders
- ✅ Progress Updates
- ✅ Sample Comments

### 3.6 Start Backend Server
```powershell
# Start the FastAPI server
uvicorn app.main:app --reload --port 8000
```

Backend will be running at: **http://localhost:8000**

API Documentation: **http://localhost:8000/docs**

---

## 🎨 Step 4: Frontend Setup

### 4.1 Open New Terminal
Keep the backend running and open a **new PowerShell terminal**

### 4.2 Navigate to Frontend Directory
```powershell
cd frontend
```

### 4.3 Install Node Dependencies
```powershell
# Install all npm packages
npm install
```

This will install:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- React Leaflet (for maps)
- Zustand (state management)
- And all other dependencies

### 4.4 Configure Frontend Environment

The frontend is already configured to connect to `http://localhost:8000/api/v1`

If you need to change this, create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### 4.5 Start Frontend Development Server
```powershell
# Start Next.js development server
npm run dev
```

Frontend will be running at: **http://localhost:3000**

---

## ✅ Step 5: Verify Installation

### 5.1 Check Backend
Open browser and visit:
- **API Health Check:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs
- **Test Endpoint:** http://localhost:8000/api/v1/projects

You should see JSON response with projects data.

### 5.2 Check Frontend
Open browser and visit:
- **Main Application:** http://localhost:3000

You should see:
- ✅ Interactive map with project markers
- ✅ Dashboard statistics (Total Projects, Budget, etc.)
- ✅ Toggleable sidebars (Filters and Project List)
- ✅ 8 projects marked on the map across Mumbai

### 5.3 Test Features
1. Click on map markers to see project popups
2. Click "View Details" to see project detail page
3. Toggle left sidebar (Filters) using the arrow button
4. Toggle right sidebar (Projects) using the arrow button
5. Click "About" in header to see About page
6. Add comments to projects and rate them

---

## 🔧 Troubleshooting

### Issue: PostgreSQL Connection Error
```
sqlalchemy.exc.OperationalError: could not connect to server
```

**Solution:**
1. Verify PostgreSQL service is running
2. Check database name and credentials in `.env`
3. Ensure PostGIS extension is installed

### Issue: PostGIS Extension Error
```
ERROR: could not open extension control file
```

**Solution:**
```powershell
# Reinstall PostgreSQL with PostGIS bundle
# Or install PostGIS separately from: https://postgis.net/install/
```

### Issue: Python Virtual Environment Error
```
cannot be loaded because running scripts is disabled
```

**Solution:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue: Port Already in Use
```
Address already in use
```

**Solution:**
```powershell
# For backend (port 8000)
# Find and kill the process
netstat -ano | findstr :8000
taskkill /PID <process_id> /F

# For frontend (port 3000)
netstat -ano | findstr :3000
taskkill /PID <process_id> /F
```

### Issue: Module Not Found Error (Python)
```
ModuleNotFoundError: No module named 'fastapi'
```

**Solution:**
```powershell
# Make sure virtual environment is activated
.\venv\Scripts\Activate.ps1

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue: Cannot Find Module (Node)
```
Cannot find module 'next'
```

**Solution:**
```powershell
# Delete node_modules and reinstall
rm -r node_modules
rm package-lock.json
npm install
```

---

## 📁 Project Structure

```
mumbai-civil-budget-portal/
├── backend/
│   ├── app/
│   │   ├── api/              # API route handlers
│   │   ├── core/             # Configuration
│   │   ├── db/               # Database models and CRUD
│   │   └── scripts/          # Seed data and utilities
│   ├── alembic/              # Database migrations
│   ├── requirements.txt      # Python dependencies
│   └── .env                  # Environment variables (create this)
│
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js pages
│   │   ├── components/       # React components
│   │   ├── lib/              # Utilities and API client
│   │   ├── store/            # Zustand state management
│   │   └── types/            # TypeScript types
│   ├── package.json          # Node dependencies
│   └── .env.local            # Frontend env (optional)
│
└── README.md
```

---

## 🎯 Default Data After Seeding

### Projects (8):
1. **Coastal Road Project - Phase 1** (In Progress) - ₹3,500 Cr
2. **Bandra-Kurla Complex Road Widening** (Awarded) - ₹45 Cr
3. **Dadar Market Renovation** (Completed) - ₹15 Cr
4. **Andheri Metro Station Upgradation** (Tendered) - ₹85 Cr
5. **Colaba Water Supply Network Upgrade** (In Progress) - ₹120 Cr
6. **Kurla MSEB Substation Modernization** (Awarded) - ₹65 Cr
7. **Borivali National Park Buffer Zone** (Proposed) - ₹200 Cr
8. **Malad Smart City Initiative** (Proposed) - ₹62 Cr

### Statistics:
- **Total Budget:** ₹4,092 Crores (approximately)
- **Active Projects:** 2
- **Completed Projects:** 1
- **Proposed Projects:** 2
- **24 Municipal Wards** covering all of Mumbai

---

## 🔄 Common Commands

### Backend Commands:
```powershell
# Activate virtual environment
cd backend
.\venv\Scripts\Activate.ps1

# Start server
uvicorn app.main:app --reload --port 8000

# Run migrations
alembic upgrade head

# Create new migration
alembic revision --autogenerate -m "description"

# Seed database
python -m app.scripts.seed_data

# Deactivate virtual environment
deactivate
```

### Frontend Commands:
```powershell
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

---

## 🌐 URLs Reference

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Main application |
| Backend API | http://localhost:8000 | API server |
| API Docs (Swagger) | http://localhost:8000/docs | Interactive API documentation |
| API Docs (ReDoc) | http://localhost:8000/redoc | Alternative API documentation |
| PostgreSQL | localhost:5432 | Database server |

---

## 📝 Environment Variables Summary

### Backend `.env`:
```env
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/mcportal
API_V1_STR=/api/v1
PROJECT_NAME=Mumbai Civic Budget Portal
BACKEND_CORS_ORIGINS=http://localhost:3000,http://localhost:3002
```

### Frontend `.env.local` (optional):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

## 🎉 Success Checklist

After setup, you should have:
- ✅ PostgreSQL running with PostGIS extension
- ✅ Database `mcportal` created with seeded data
- ✅ Backend server running on port 8000
- ✅ Frontend server running on port 3000
- ✅ Interactive map showing 8 project markers
- ✅ Dashboard with live statistics
- ✅ Functional filters and project list
- ✅ About page accessible
- ✅ Project detail pages with comments

---

## 🆘 Need Help?

If you encounter issues:

1. **Check Prerequisites:** Ensure all required software is installed
2. **Read Error Messages:** They often contain the solution
3. **Check Logs:** Look at terminal output for both frontend and backend
4. **Database Connection:** Verify PostgreSQL is running and credentials are correct
5. **Port Conflicts:** Ensure ports 8000 and 3000 are available

---

## 📚 Additional Resources

- **FastAPI Documentation:** https://fastapi.tiangolo.com/
- **Next.js Documentation:** https://nextjs.org/docs
- **PostgreSQL Documentation:** https://www.postgresql.org/docs/
- **PostGIS Documentation:** https://postgis.net/documentation/
- **React Leaflet:** https://react-leaflet.js.org/

---

## 🔒 Security Notes

For production deployment:
1. Change default PostgreSQL password
2. Use environment-specific `.env` files
3. Enable HTTPS
4. Set up proper CORS policies
5. Use production-grade database hosting
6. Implement authentication and authorization
7. Add rate limiting
8. Enable database backups

---

**Made with ❤️ for the citizens of Mumbai**

© 2025 Mumbai Civic Budget Portal. All rights reserved.
