# Setup Checklist - Mumbai Civil Budget Portal Backend

Use this checklist to ensure everything is set up correctly.

## ☑️ Pre-Installation

- [ ] Python 3.11 or higher installed
  - Check: `python --version`
  
- [ ] PostgreSQL 14+ installed
  - Download: https://www.postgresql.org/download/windows/
  - Remember your postgres password during installation
  
- [ ] PostGIS extension installed
  - Installed via Stack Builder during PostgreSQL setup

## ☑️ Project Setup

- [ ] Navigate to backend folder
  ```powershell
  cd c:\Users\Welcome\Desktop\projectMajor\backend
  ```

- [ ] Create virtual environment
  ```powershell
  python -m venv .venv
  ```

- [ ] Activate virtual environment
  ```powershell
  .venv\Scripts\Activate.ps1
  ```
  - If error, run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

- [ ] Upgrade pip
  ```powershell
  python -m pip install --upgrade pip
  ```

- [ ] Install dependencies
  ```powershell
  pip install -r requirements.txt
  ```

## ☑️ Database Setup

- [ ] PostgreSQL service is running
  - Check in Services app or Task Manager
  
- [ ] Create database
  ```powershell
  psql -U postgres
  ```
  ```sql
  CREATE DATABASE mcportal;
  ```

- [ ] Connect to database
  ```sql
  \c mcportal
  ```

- [ ] Enable uuid-ossp extension
  ```sql
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  ```

- [ ] Enable PostGIS extension
  ```sql
  CREATE EXTENSION IF NOT EXISTS postgis;
  ```

- [ ] Exit psql
  ```sql
  \q
  ```

## ☑️ Configuration

- [ ] Copy .env.example to .env
  ```powershell
  copy .env.example .env
  ```

- [ ] Edit .env file
  ```powershell
  notepad .env
  ```

- [ ] Set POSTGRES_PASSWORD to your postgres password
- [ ] Set POSTGRES_USER (usually 'postgres')
- [ ] Set POSTGRES_DB to 'mcportal'
- [ ] Set POSTGRES_HOST to 'localhost'
- [ ] Set POSTGRES_PORT to '5432'
- [ ] Set a strong JWT_SECRET

## ☑️ Database Migration

- [ ] Generate initial migration
  ```powershell
  alembic revision --autogenerate -m "Initial migration"
  ```

- [ ] Review migration file
  - Check in `alembic/versions/` folder
  - Should contain all table definitions

- [ ] Apply migrations
  ```powershell
  alembic upgrade head
  ```

- [ ] Verify tables created
  ```powershell
  psql -U postgres -d mcportal -c "\dt"
  ```
  - Should see: projects, wards, contractors, tenders, contracts, etc.

## ☑️ Seed Data

- [ ] Run seed script
  ```powershell
  python -m app.scripts.seed_data
  ```

- [ ] Verify data created
  - Should see: 24 wards, 8 projects, 5 contractors, etc.

- [ ] Check in database
  ```powershell
  psql -U postgres -d mcportal -c "SELECT COUNT(*) FROM projects;"
  ```

## ☑️ Start Server

- [ ] Start development server
  ```powershell
  uvicorn app.main:app --reload
  ```
  OR
  ```powershell
  .\run_dev.ps1
  ```

- [ ] Server starts without errors
- [ ] See startup message with URL

## ☑️ Test API

- [ ] Open browser to http://localhost:8000
  - Should see welcome message

- [ ] Open API docs: http://localhost:8000/docs
  - Should see Swagger UI with all endpoints

- [ ] Test health endpoint: http://localhost:8000/health
  - Should return: `{"status": "healthy"}`

- [ ] Test projects list: http://localhost:8000/api/v1/projects
  - Should return list of 8 projects

- [ ] Test wards list: http://localhost:8000/api/v1/wards
  - Should return 24 Mumbai wards

## ☑️ Verify Features

- [ ] Try search: http://localhost:8000/api/v1/projects?q=metro
- [ ] Try filter: http://localhost:8000/api/v1/projects?status=in_progress
- [ ] Try pagination: http://localhost:8000/api/v1/projects?limit=5
- [ ] Test in Swagger UI - Try POST request to create a project

## ✅ Success Criteria

Your setup is complete when:

✅ Server starts without errors
✅ API docs load at http://localhost:8000/docs
✅ All endpoints return data
✅ Sample projects, wards, and contractors exist
✅ No database connection errors
✅ Can create, read, update data via API

## 🐛 If Something Fails

### Can't activate virtual environment
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Database connection error
- Check PostgreSQL is running
- Verify .env credentials match your PostgreSQL setup
- Test: `psql -U postgres -d mcportal`

### Import errors
- Make sure virtual environment is activated (you should see `(.venv)` in prompt)
- Reinstall: `pip install -r requirements.txt`

### Migration errors
- Check database exists: `psql -U postgres -l`
- Check extensions: `psql -U postgres -d mcportal -c "SELECT * FROM pg_extension;"`
- Delete versions and try again

### Seed script fails
- Make sure migrations ran successfully
- Check database is empty or delete existing data
- Review error message for specific table issues

## 📞 Need Help?

1. Check QUICKSTART.md for quick solutions
2. Read README.md for detailed documentation
3. Review IMPLEMENTATION_SUMMARY.md for architecture details
4. Check error logs in terminal

## 🎉 You're Done!

Once all items are checked, your backend is fully operational!

Start building your frontend or test the API endpoints.

---
**Note**: Save this file and refer back to it if you need to set up the project again on another machine.
