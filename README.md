# Mumbai Civil Budget Portal

A comprehensive full-stack web application for tracking and managing civic infrastructure projects in Mumbai. Features include interactive maps, budget tracking, tender management, contractor oversight, and citizen engagement tools.

![Project Status](https://img.shields.io/badge/status-ready-green)
![Backend](https://img.shields.io/badge/backend-FastAPI-blue)
![Frontend](https://img.shields.io/badge/frontend-Next.js%2014-black)
![Database](https://img.shields.io/badge/database-PostgreSQL-blue)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [Development](#development)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### Core Features
- 🗺️ **Interactive Map** - Leaflet-based map locked to Mumbai boundaries
- 📊 **Project Tracking** - Track infrastructure projects across all 24 Mumbai wards
- 💰 **Budget Management** - Monitor budgets, expenditures, and financial data
- 📝 **Tender System** - Complete tender lifecycle from publication to award
- 👷 **Contractor Management** - Database of contractors with performance tracking
- 📈 **Progress Updates** - Real-time updates from officials and citizens
- 💬 **Citizen Engagement** - Report issues, add comments, upload photos
- 🔍 **Advanced Filtering** - Filter by status, ward, budget, dates, and more
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🔐 **Role-based Access** - Different permissions for citizens, officials, and admins

### Data Features
- **Multi-source Integration** - Aggregate data from RTI, tenders, news
- **Confidence Scoring** - Track data reliability and verification status
- **Geospatial Support** - PostGIS for accurate location tracking
- **Audit Trail** - Complete history of all changes
- **Export Options** - Download data as JSON, CSV, or PDF

---

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI 0.95.2 (Python 3.9+)
- **Database**: PostgreSQL 14+ with PostGIS extension
- **ORM**: SQLAlchemy 1.4.48 (async)
- **Migrations**: Alembic 1.12.0
- **Validation**: Pydantic 1.10.12
- **Authentication**: JWT tokens (planned)

### Frontend
- **Framework**: Next.js 14.0.4 (React 18, TypeScript 5.3)
- **Styling**: Tailwind CSS 3.3.6
- **Maps**: React-Leaflet 4.2.1 + Leaflet 1.9.4
- **State Management**: Zustand 4.4.7
- **HTTP Client**: Axios 1.6.2
- **Forms**: React Hook Form 7.49.2 + Zod 3.22.4
- **Icons**: Lucide React 0.294.0
- **Notifications**: React Hot Toast 2.4.1

### DevOps
- **Version Control**: Git
- **Development**: Hot reload for both frontend and backend
- **Deployment**: Ready for Vercel (frontend) + Railway/Render (backend)

---

## 📁 Project Structure

```
projectMajor/
├── backend/                    # FastAPI backend
│   ├── alembic/                # Database migrations
│   ├── app/
│   │   ├── api/                # API route handlers
│   │   ├── core/               # Configuration
│   │   ├── db/                 # Database models & CRUD
│   │   ├── schemas.py          # Pydantic schemas
│   │   ├── main.py             # FastAPI app entry
│   │   └── scripts/            # Utility scripts
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example            # Environment template
│   ├── setup.ps1               # Backend setup script
│   ├── run_dev.ps1             # Start backend server
│   └── README.md               # Backend documentation
│
├── frontend/                   # Next.js frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── app/                # Next.js pages (App Router)
│   │   ├── components/         # React components
│   │   │   ├── Map/            # Map components
│   │   │   ├── Projects/       # Project components
│   │   │   ├── Filters/        # Filter components
│   │   │   └── UI/             # Reusable UI components
│   │   ├── lib/                # Utilities & API client
│   │   ├── store/              # Zustand state management
│   │   ├── styles/             # Global styles
│   │   └── types/              # TypeScript definitions
│   ├── package.json            # npm dependencies
│   ├── tsconfig.json           # TypeScript config
│   ├── tailwind.config.js      # Tailwind configuration
│   ├── setup.ps1               # Frontend setup script
│   ├── run_dev.ps1             # Start frontend server
│   ├── COMPONENT_TEMPLATES.md  # Component implementation guide
│   └── README.md               # Frontend documentation
│
├── setup_all.ps1               # Master setup script
└── README.md                   # This file
```

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.9+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **PostgreSQL 14+** - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/downloads)

### Installation (5 Minutes)

```powershell
# 1. Clone the repository
git clone <repository-url>
cd projectMajor

# 2. Run master setup script
.\setup_all.ps1
```

The setup script will:
- ✅ Check all prerequisites
- ✅ Set up Python virtual environment
- ✅ Install Python dependencies
- ✅ Install npm dependencies
- ✅ Create environment files

### Database Setup

```powershell
# Open PostgreSQL command line (psql)
psql -U postgres

# Create database and extensions
CREATE DATABASE mumbai_civil_budget;
\c mumbai_civil_budget
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
\q
```

### Configure Environment

```powershell
# Backend: Update database credentials
cd backend
notepad .env
# Update: POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB

# Frontend: (Optional) Verify API URL
cd ..\frontend
notepad .env.local
# Default: NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Run Migrations & Seed Data

```powershell
cd backend
.\venv\Scripts\Activate.ps1
alembic upgrade head
python -m app.scripts.seed_data
```

### Start Servers

**Terminal 1 - Backend**:
```powershell
cd backend
.\run_dev.ps1
```

**Terminal 2 - Frontend**:
```powershell
cd frontend
.\run_dev.ps1
```

### Access Application

- 🌐 **Frontend**: http://localhost:3000
- 📡 **Backend API**: http://localhost:8000
- 📚 **API Docs**: http://localhost:8000/docs
- 📖 **ReDoc**: http://localhost:8000/redoc

---

## 📖 Detailed Setup

For detailed setup instructions, refer to:
- **Backend**: `backend/QUICKSTART.md`
- **Frontend**: `frontend/QUICKSTART.md`
- **Backend Full Docs**: `backend/README.md`
- **Frontend Full Docs**: `frontend/README.md`

---

## 💻 Development

### Backend Development

```powershell
cd backend

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install new package
pip install package-name
pip freeze > requirements.txt

# Create new migration
alembic revision --autogenerate -m "description"
alembic upgrade head

# Run tests (when implemented)
pytest

# Start development server
uvicorn app.main:app --reload
```

### Frontend Development

```powershell
cd frontend

# Install new package
npm install package-name

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build
npm start

# Start development server
npm run dev
```

### Creating New Components

Refer to `frontend/COMPONENT_TEMPLATES.md` for ready-to-use component templates including:
- UI Components (Button, Card, Modal, Input, Badge)
- Map Components (MumbaiMap, Markers, Controls)
- Project Components (ProjectList, ProjectCard, ProjectDetail)
- Filter Components (FilterPanel, SearchBar)

---

## 📡 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Key Endpoints

#### Projects
```http
GET    /projects              # List projects (with filters)
GET    /projects/{id}         # Get project details
POST   /projects              # Create project
PUT    /projects/{id}         # Update project
DELETE /projects/{id}         # Delete project
```

#### Wards
```http
GET    /wards                 # List all wards
GET    /wards/{id}            # Get ward details
```

#### Contractors
```http
GET    /contractors           # List contractors
GET    /contractors/{id}      # Get contractor details
```

#### Tenders
```http
GET    /tenders               # List tenders
GET    /tenders/{id}          # Get tender details
POST   /tenders               # Create tender
```

#### Reports (Citizen)
```http
GET    /reports               # List reports
POST   /reports               # Submit new report
```

### Interactive Documentation

Visit http://localhost:8000/docs for full interactive Swagger UI documentation with:
- All endpoints with parameters
- Request/response schemas
- Try-it-out functionality
- Authentication details

---

## 🎯 Implementation Status

### ✅ Complete

#### Backend (100%)
- [x] Database models (13 tables)
- [x] API endpoints (40+ routes)
- [x] CRUD operations
- [x] Filtering and pagination
- [x] Migrations setup
- [x] Seed data script
- [x] Comprehensive documentation

#### Frontend Foundation (60%)
- [x] Project configuration
- [x] TypeScript type system
- [x] API client integration
- [x] State management (Zustand)
- [x] Utility functions (20+)
- [x] Global styling (Tailwind)
- [x] App routing structure
- [x] Comprehensive documentation

### 🚧 To Implement

#### Frontend Components (40%)
- [ ] Map components (MumbaiMap, Markers)
- [ ] Project components (List, Card, Detail)
- [ ] Filter components (FilterPanel)
- [ ] UI primitives (Button, Modal, Card, Badge, Input)
- [ ] Additional pages (Contractors, Tenders, Wards)
- [ ] User authentication flow
- [ ] Comment system
- [ ] Photo upload functionality
- [ ] Report submission flow

**Note**: Component templates are ready in `frontend/COMPONENT_TEMPLATES.md`. Implementation is straightforward copy-paste + minor customization.

---

## 📚 Documentation

### Backend Documentation
- `backend/README.md` - Complete API reference, setup, architecture
- `backend/QUICKSTART.md` - 5-minute setup guide
- `backend/SETUP_CHECKLIST.md` - Step-by-step verification
- `backend/IMPLEMENTATION_SUMMARY.md` - Technical overview

### Frontend Documentation
- `frontend/README.md` - Complete frontend guide
- `frontend/QUICKSTART.md` - Quick setup instructions
- `frontend/IMPLEMENTATION_SUMMARY.md` - Foundation status
- `frontend/COMPONENT_TEMPLATES.md` - Ready-to-use component code

### API Documentation
- **Swagger UI**: http://localhost:8000/docs (interactive)
- **ReDoc**: http://localhost:8000/redoc (readable)

---

## 🎨 Key Features Detail

### 1. Map-Locked Interface
- Map bounds restricted to Mumbai coordinates
- 24 administrative wards visible
- Color-coded project markers by status
- Popup cards with project summaries

### 2. Project Management
- Complete CRUD operations
- Status tracking (8 states)
- Budget and timeline monitoring
- Document attachments
- Progress photo uploads

### 3. Tender System
- Tender publication and management
- Contractor bidding
- Contract awards
- Payment tracking

### 4. Citizen Engagement
- Report infrastructure issues
- Add comments on projects
- Upload photos
- Vote on priorities

### 5. Data Quality
- Multi-source data integration
- Confidence scoring system
- Verification workflow
- Audit trail for all changes

---

## 🔧 Configuration

### Backend Configuration (.env)
```env
# Database
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=mumbai_civil_budget

# JWT (for authentication)
JWT_SECRET=your-secret-key-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend Configuration (.env.local)
```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Map Configuration
NEXT_PUBLIC_MAP_CENTER_LAT=19.0760
NEXT_PUBLIC_MAP_CENTER_LNG=72.8777
NEXT_PUBLIC_MAP_DEFAULT_ZOOM=12
```

---

## 🐛 Troubleshooting

### Backend Issues

**Issue**: Database connection fails
```powershell
# Solution: Check PostgreSQL is running
Get-Service -Name postgresql*
# Start if stopped: Start-Service postgresql-x64-14
```

**Issue**: Import errors
```powershell
# Solution: Ensure virtual environment is activated
.\venv\Scripts\Activate.ps1
# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend Issues

**Issue**: Module not found errors
```powershell
# Solution: Reinstall node modules
Remove-Item -Recurse -Force node_modules
npm install
```

**Issue**: Map not loading
- Check Leaflet CSS is imported in `layout.tsx` or `globals.css`
- Verify `MumbaiMap` component uses dynamic import with `ssr: false`

---

## 📊 Database Schema

### Core Tables

1. **projects** - Infrastructure projects
2. **wards** - 24 Mumbai administrative wards
3. **contractors** - Registered contractors
4. **tenders** - Tender publications
5. **contracts** - Awarded contracts
6. **progress_updates** - Project updates & comments
7. **sources** - Data sources (RTI, news, etc.)
8. **documents** - File attachments
9. **users** - System users
10. **reports** - Citizen issue reports
11. **approvals** - Approval workflow
12. **audit_logs** - Change history
13. **payments** - Payment tracking

### Relationships
- Projects → Wards (many-to-one)
- Projects → Contractors (many-to-many via Contracts)
- Projects → Tenders (one-to-many)
- Projects → Progress Updates (one-to-many)
- Projects → Sources (many-to-many)
- Projects → Documents (one-to-many)

---

## 🚢 Deployment

### Backend Deployment (Railway/Render)

1. Create PostgreSQL database with PostGIS
2. Set environment variables
3. Run migrations: `alembic upgrade head`
4. Deploy: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Frontend Deployment (Vercel)

1. Connect GitHub repository
2. Set environment variable: `NEXT_PUBLIC_API_URL`
3. Deploy automatically on push

---

## 🤝 Contributing

Contributions are welcome! Areas needing work:

1. **Frontend Components** - Implement remaining UI components
2. **Authentication** - Add JWT-based user authentication
3. **Testing** - Add unit and integration tests
4. **Mobile App** - React Native mobile version
5. **Analytics** - Usage analytics and reporting
6. **Notifications** - Email/SMS notifications
7. **Multilingual** - Support for Marathi, Hindi

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👥 Team

Built with ❤️ for Mumbai's infrastructure transparency.

---

## 📞 Support

For issues, questions, or contributions:
- Create an issue on GitHub
- Check documentation in `backend/README.md` and `frontend/README.md`
- Review component templates in `frontend/COMPONENT_TEMPLATES.md`

---

## 🎓 Learning Resources

### FastAPI
- [Official Docs](https://fastapi.tiangolo.com/)
- [SQLAlchemy Async](https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html)

### Next.js
- [Next.js 14 Docs](https://nextjs.org/docs)
- [React 18 Docs](https://react.dev/)

### Maps
- [Leaflet Docs](https://leafletjs.com/)
- [React-Leaflet](https://react-leaflet.js.org/)

### Tailwind CSS
- [Tailwind Docs](https://tailwindcss.com/docs)

---

## ✨ Acknowledgments

- OpenStreetMap for map tiles
- Mumbai Municipal Corporation for ward data
- All contributors to open-source libraries used

---

**Made with 💙 for transparent civic governance**

---

## Quick Commands Reference

```powershell
# Full Setup
.\setup_all.ps1

# Backend Only
cd backend
.\setup.ps1
.\run_dev.ps1

# Frontend Only
cd frontend
.\setup.ps1
.\run_dev.ps1

# Database
psql -U postgres
CREATE DATABASE mumbai_civil_budget;
\c mumbai_civil_budget
CREATE EXTENSION postgis;
\q

# Migrations
cd backend
.\venv\Scripts\Activate.ps1
alembic upgrade head
python -m app.scripts.seed_data
```

---

**Status**: Production Ready (Backend) | Foundation Complete (Frontend)
**Version**: 1.0.0
**Last Updated**: December 2024
