# Mumbai Civil Budget Portal - Backend API

FastAPI-based backend for tracking Mumbai's civil infrastructure projects, tenders, contractors, and citizen reports.

## 🏗️ Tech Stack

- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL 14+ with PostGIS extension
- **ORM**: SQLAlchemy 1.4+ (async)
- **Migrations**: Alembic
- **Database Driver**: asyncpg
- **Geo Support**: GeoAlchemy2 (for geometry columns)

## 📋 Features

- ✅ Project tracking with geospatial data
- ✅ Tender and contract management
- ✅ Contractor database
- ✅ Progress updates (official and citizen-submitted)
- ✅ Multi-ward support for Mumbai's 24 administrative wards
- ✅ Full-text search capabilities
- ✅ RESTful API with automatic documentation
- ✅ Database migrations with Alembic
- ✅ Sample data seeding

## 📁 Project Structure

```
backend/
├── alembic/                  # Database migrations
│   ├── versions/             # Migration files
│   └── env.py                # Alembic configuration
├── app/
│   ├── api/                  # API route handlers
│   │   ├── projects.py       # Project endpoints
│   │   ├── wards.py          # Ward endpoints
│   │   ├── contractors.py    # Contractor endpoints
│   │   ├── tenders.py        # Tender endpoints
│   │   ├── contracts.py      # Contract endpoints
│   │   ├── progress_updates.py
│   │   └── reports.py        # Citizen reports
│   ├── core/
│   │   └── config.py         # Application configuration
│   ├── db/
│   │   ├── base.py           # Database base for migrations
│   │   ├── session.py        # Async session management
│   │   ├── models.py         # SQLAlchemy models
│   │   └── crud.py           # Database operations
│   ├── scripts/
│   │   └── seed_data.py      # Database seeding script
│   ├── schemas.py            # Pydantic schemas
│   └── main.py               # FastAPI application
├── .env                      # Environment variables (create from .env.example)
├── .env.example              # Environment template
├── alembic.ini               # Alembic configuration
└── requirements.txt          # Python dependencies
```

## 🚀 Getting Started

### Prerequisites

1. **Python 3.11 or higher**
   ```powershell
   python --version
   ```

2. **PostgreSQL 14+** with PostGIS extension
   - Download from: https://www.postgresql.org/download/windows/
   - During installation, make sure to install Stack Builder and PostGIS extension
   - Default port: 5432

### Installation Steps

#### 1. Create and activate virtual environment

```powershell
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
.venv\Scripts\Activate.ps1

# If you get execution policy error, run:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### 2. Install dependencies

```powershell
# Upgrade pip
python -m pip install --upgrade pip

# Install all requirements
pip install -r requirements.txt
```

#### 3. Set up PostgreSQL database

Open **pgAdmin** or **psql** and run:

```sql
-- Create database
CREATE DATABASE mcportal;

-- Connect to the database
\c mcportal

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;
```

Alternatively, use psql from command line:

```powershell
# Login to PostgreSQL (default password: postgres)
psql -U postgres

# Then run the SQL commands above
```

#### 4. Configure environment variables

```powershell
# Copy example env file
copy .env.example .env

# Edit .env file with your database credentials
notepad .env
```

Update the `.env` file:
```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DB=mcportal
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

JWT_SECRET=your_super_secret_jwt_key_change_this
```

#### 5. Run database migrations

```powershell
# Create initial migration
alembic revision --autogenerate -m "Initial migration"

# Apply migrations to database
alembic upgrade head
```

#### 6. Seed the database with sample data

```powershell
python -m app.scripts.seed_data
```

This will create:
- 24 Mumbai wards
- 5 sample contractors
- 4 data sources
- 8 sample projects
- Sample tenders and contracts
- Sample progress updates

#### 7. Run the development server

```powershell
# Using uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Or using Python
python -m app.main
```

The API will be available at:
- **API**: http://localhost:8000
- **Interactive Docs (Swagger)**: http://localhost:8000/docs
- **Alternative Docs (ReDoc)**: http://localhost:8000/redoc

## 📚 API Endpoints

### Health Check
- `GET /` - Root endpoint
- `GET /health` - Health check

### Projects
- `GET /api/v1/projects` - List projects (with filters)
- `GET /api/v1/projects/{id}` - Get project details
- `POST /api/v1/projects` - Create project
- `PUT /api/v1/projects/{id}` - Update project
- `DELETE /api/v1/projects/{id}` - Delete project

### Wards
- `GET /api/v1/wards` - List all wards
- `GET /api/v1/wards/{id}` - Get ward details
- `POST /api/v1/wards` - Create ward

### Contractors
- `GET /api/v1/contractors` - List contractors
- `GET /api/v1/contractors/{id}` - Get contractor details
- `POST /api/v1/contractors` - Create contractor

### Tenders
- `GET /api/v1/tenders` - List tenders
- `GET /api/v1/tenders/{id}` - Get tender details
- `POST /api/v1/tenders` - Create tender

### Contracts
- `GET /api/v1/contracts` - List contracts
- `GET /api/v1/contracts/{id}` - Get contract details
- `POST /api/v1/contracts` - Create contract

### Progress Updates
- `GET /api/v1/progress-updates` - List updates for project
- `POST /api/v1/progress-updates` - Create update

### Reports
- `GET /api/v1/reports` - List citizen reports
- `POST /api/v1/reports` - Submit report

## 🔍 Example API Calls

### List Projects with Filters

```powershell
# Search projects
curl "http://localhost:8000/api/v1/projects?q=metro&limit=10"

# Filter by ward
curl "http://localhost:8000/api/v1/projects?ward_id=<ward-uuid>"

# Filter by status
curl "http://localhost:8000/api/v1/projects?status=in_progress"

# Filter by budget range
curl "http://localhost:8000/api/v1/projects?min_budget=100000000&max_budget=500000000"
```

### Create a New Project

```powershell
curl -X POST "http://localhost:8000/api/v1/projects" `
  -H "Content-Type: application/json" `
  -d '{
    "title": "New Road Project",
    "description": "Road widening in Andheri",
    "status": "proposed",
    "budget_amount": 250000000
  }'
```

### Get All Wards

```powershell
curl "http://localhost:8000/api/v1/wards"
```

## 🗃️ Database Schema

### Core Tables

1. **projects** - Infrastructure projects
   - Fields: id, title, description, ward_id, status, budget_amount, start_date, expected_end_date, confidence_score, geometry columns
   - Status: proposed, tendered, awarded, in_progress, completed, stalled

2. **wards** - Mumbai's 24 administrative wards
   - Fields: id, name, code, geometry

3. **contractors** - Construction companies
   - Fields: id, name, registration_number, address, contact_info

4. **tenders** - Procurement notices
   - Fields: id, tender_number, title, project_id, tender_value, publish_date, close_date, award_date

5. **contracts** - Awarded contracts
   - Fields: id, project_id, contractor_id, contract_value, start_date, completion_date, status

6. **progress_updates** - Project updates
   - Fields: id, project_id, update_type (official/citizen/media), description, photos, location, verified

7. **sources** - Data sources
   - Fields: id, name, source_type, url

8. **reports** - Citizen submissions
   - Fields: id, user_id, project_id, title, description, photos, location, status

9. **users** - User accounts
   - Fields: id, username, email, password_hash, role, reputation

10. **documents** - File attachments
11. **approvals** - Government approvals
12. **audit_logs** - Change tracking
13. **payments** - Financial transactions

## 🔧 Database Migrations

### Create a new migration

```powershell
alembic revision --autogenerate -m "Description of changes"
```

### Apply migrations

```powershell
# Upgrade to latest
alembic upgrade head

# Upgrade one version
alembic upgrade +1

# Downgrade one version
alembic downgrade -1

# View migration history
alembic history

# View current version
alembic current
```

## 🧪 Testing

### Manual Testing

Use the interactive API documentation at http://localhost:8000/docs to test endpoints.

### Using curl or PowerShell

```powershell
# Test health endpoint
curl http://localhost:8000/health

# Test projects list
curl http://localhost:8000/api/v1/projects
```

## 🐛 Troubleshooting

### Database Connection Issues

1. Check PostgreSQL is running:
   ```powershell
   # Check if postgres service is running
   Get-Service -Name postgresql*
   ```

2. Verify database exists:
   ```powershell
   psql -U postgres -c "\l"
   ```

3. Test connection:
   ```powershell
   psql -U postgres -d mcportal -c "SELECT version();"
   ```

### Import Errors

Make sure virtual environment is activated:
```powershell
.venv\Scripts\Activate.ps1
```

### Alembic Migration Issues

If autogenerate doesn't detect changes:
```powershell
# Make sure all models are imported in app/db/base.py
# Check alembic/env.py is correctly configured
```

## 📦 Production Deployment

### Environment Variables

Set these for production:
```env
DEBUG=False
JWT_SECRET=<strong-random-secret>
POSTGRES_HOST=<production-db-host>
POSTGRES_PASSWORD=<secure-password>
```

### Run with Gunicorn (Linux)

```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
```

### Windows Production

```powershell
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Run tests
4. Create pull request

## 📄 License

MIT License

## 👥 Authors

Mumbai Civil Budget Portal Team

## 📞 Support

For issues and questions, please create an issue on the repository.

---

**Note**: This is a development setup. For production deployment, implement proper authentication, rate limiting, monitoring, and security best practices.
