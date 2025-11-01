# Mumbai Civil Budget Portal - Quick Reference

One-page cheat sheet for common tasks and commands.

---

## 🚀 Quick Start Commands

```powershell
# Full Setup (First Time)
.\setup_all.ps1

# Start Backend
cd backend
.\run_dev.ps1

# Start Frontend  
cd frontend
.\run_dev.ps1
```

---

## 📁 Key File Locations

| Purpose | File Path |
|---------|-----------|
| Backend API | `backend/app/main.py` |
| Database Models | `backend/app/db/models.py` |
| API Routes | `backend/app/api/*.py` |
| Frontend Home | `frontend/src/app/page.tsx` |
| API Client | `frontend/src/lib/api-client.ts` |
| State Store | `frontend/src/store/index.ts` |
| Types | `frontend/src/types/index.ts` |
| Global Styles | `frontend/src/styles/globals.css` |

---

## 🌐 URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| API Docs (ReDoc) | http://localhost:8000/redoc |
| Health Check | http://localhost:8000/health |

---

## 🔧 Backend Commands

```powershell
# Activate virtual environment
cd backend
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Create migration
alembic revision --autogenerate -m "description"

# Run migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1

# Seed database
python -m app.scripts.seed_data

# Start server
uvicorn app.main:app --reload

# Or use script
.\run_dev.ps1
```

---

## 💻 Frontend Commands

```powershell
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Type check
npm run type-check

# Lint code
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

---

## 🗄️ Database Commands

```powershell
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE mumbai_civil_budget;

# Connect to database
\c mumbai_civil_budget

# Enable extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

# List tables
\dt

# Describe table
\d projects

# Exit
\q
```

---

## 📊 Common API Endpoints

### Projects
```http
GET    /api/projects              # List all (with filters)
GET    /api/projects/{id}         # Get by ID
POST   /api/projects              # Create new
PUT    /api/projects/{id}         # Update
DELETE /api/projects/{id}         # Delete
```

### Filters (Query Params)
```
?q=coastal               # Search by title
?status=in_progress      # Filter by status
?ward_id={uuid}          # Filter by ward
?min_budget=1000000      # Min budget
?max_budget=10000000     # Max budget
?limit=10                # Results per page
?offset=0                # Page offset
```

---

## 🎨 Component Locations

```
frontend/src/components/
├── UI/
│   ├── Button.tsx          # Reusable button
│   ├── Card.tsx            # Content cards
│   ├── Modal.tsx           # Dialog modals
│   ├── Badge.tsx           # Status badges
│   └── Input.tsx           # Form inputs
│
├── Map/
│   ├── MumbaiMap.tsx       # Main map component
│   ├── ProjectMarker.tsx   # Map markers
│   └── MapControls.tsx     # Zoom controls
│
├── Projects/
│   ├── ProjectList.tsx     # Project list
│   ├── ProjectCard.tsx     # List item
│   └── ProjectDetail.tsx   # Full details
│
├── Filters/
│   └── FilterPanel.tsx     # Filter sidebar
│
└── Layout/
    ├── Header.tsx          # App header
    ├── Sidebar.tsx         # Side navigation
    └── Footer.tsx          # App footer
```

---

## 🔍 Utility Functions

### Frontend (`src/lib/utils.ts`)

```typescript
// Formatting
formatCurrency(1250000000)        // "₹12.50 Cr"
formatDate("2024-01-15")          // "Jan 15, 2024"
formatRelativeTime("2024-01-01")  // "2 days ago"

// Status helpers
getStatusColor("in_progress")     // "orange-500"
getStatusLabel("in_progress")     // "In Progress"

// Map helpers
MUMBAI_BOUNDS                     // Boundary coordinates
MUMBAI_CENTER                     // Center point
isWithinMumbai(19.07, 72.87)     // true/false

// Utilities
cn("class1", "class2")            // Merge classes
debounce(fn, 500)                 // Debounce function
```

---

## 📦 Environment Variables

### Backend (`.env`)
```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=mumbai_civil_budget
JWT_SECRET=your-secret-key
ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_MAP_CENTER_LAT=19.0760
NEXT_PUBLIC_MAP_CENTER_LNG=72.8777
NEXT_PUBLIC_MAP_DEFAULT_ZOOM=12
```

---

## 🎯 Project Status Types

```typescript
type ProjectStatus =
  | 'proposed'      // Initial proposal
  | 'approved'      // Approved by authorities
  | 'tendered'      // Tender published
  | 'awarded'       // Contract awarded
  | 'in_progress'   // Work ongoing
  | 'completed'     // Finished
  | 'delayed'       // Behind schedule
  | 'cancelled'     // Cancelled
```

---

## 🗺️ Mumbai Wards

24 administrative wards (A-T + islands):
- A (Colaba)
- B (Marine Lines)
- C (Malabar Hill)
- D (Grant Road)
- E (Byculla)
- F (Mahalaxmi)
- G/N (Dadar)
- H/E (Bandra East)
- K/E (Andheri East)
- K/W (Andheri West)
- L (Kurla)
- M/E (Chembur)
- M/W (Trombay)
- N (Ghatkopar)
- P/N (Goregaon North)
- P/S (Goregaon South)
- R/C (Borivali Central)
- R/N (Borivali North)
- R/S (Borivali South)
- S (Kandivali)
- T (Malad)
- RC (Colaba Islands)
- ME (Mumbai East)

---

## 🛠️ Troubleshooting

### Backend not starting
```powershell
# Check PostgreSQL is running
Get-Service postgresql*

# Verify database exists
psql -U postgres -l | Select-String mumbai

# Check migrations
alembic current
alembic upgrade head
```

### Frontend not starting
```powershell
# Clear node_modules
Remove-Item -Recurse node_modules
npm install

# Check for port conflicts
netstat -ano | findstr :3000
```

### Database connection issues
```powershell
# Test connection
psql -U postgres -d mumbai_civil_budget

# Verify credentials in .env
notepad backend\.env
```

### Map not loading
- Check Leaflet CSS imported
- Verify dynamic import with `ssr: false`
- Check browser console for errors

---

## 📚 Documentation Links

| Doc | Path |
|-----|------|
| Project README | `README.md` |
| Backend Docs | `backend/README.md` |
| Frontend Docs | `frontend/README.md` |
| Quick Start | `*/QUICKSTART.md` |
| Architecture | `ARCHITECTURE.md` |
| Component Guide | `frontend/COMPONENT_TEMPLATES.md` |
| Checklist | `IMPLEMENTATION_CHECKLIST.md` |

---

## 🔐 Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Success |
| 201 | Created - Resource created |
| 204 | No Content - Deleted |
| 400 | Bad Request - Invalid data |
| 401 | Unauthorized - Auth required |
| 403 | Forbidden - No permission |
| 404 | Not Found - Resource missing |
| 422 | Validation Error |
| 500 | Server Error |

---

## 🎨 Tailwind Class Shortcuts

```css
/* Custom classes in globals.css */
.btn-primary      /* Primary button */
.btn-secondary    /* Secondary button */
.btn-ghost        /* Ghost button */
.input            /* Form input */
.card             /* Content card */
.badge            /* Status badge */
.custom-scrollbar /* Styled scrollbar */
```

---

## 📊 Zustand Store Usage

```typescript
// In any component
import { useAppStore } from '@/store';

function MyComponent() {
  // Get state
  const { projects, filters } = useAppStore();
  
  // Get actions
  const { setFilters, resetFilters } = useAppStore();
  
  // Use them
  const handleFilter = () => {
    setFilters({ status: ['in_progress'] });
  };
}
```

---

## 🔄 Git Workflow

```powershell
# Check status
git status

# Create feature branch
git checkout -b feature/my-feature

# Stage changes
git add .

# Commit
git commit -m "feat: add new feature"

# Push
git push origin feature/my-feature

# Switch back to main
git checkout main
```

---

## 📱 Responsive Breakpoints

```typescript
// Tailwind breakpoints
sm: '640px'   // Small devices
md: '768px'   // Tablets
lg: '1024px'  // Desktops
xl: '1280px'  // Large screens
2xl: '1536px' // Extra large

// Usage in JSX
className="w-full md:w-1/2 lg:w-1/3"
```

---

## 🎯 Next Steps

1. **Install dependencies**
   ```powershell
   .\setup_all.ps1
   ```

2. **Setup database**
   ```powershell
   cd backend
   alembic upgrade head
   python -m app.scripts.seed_data
   ```

3. **Start servers**
   ```powershell
   # Terminal 1
   cd backend
   .\run_dev.ps1
   
   # Terminal 2
   cd frontend
   .\run_dev.ps1
   ```

4. **Implement components**
   - Copy from `frontend/COMPONENT_TEMPLATES.md`
   - Start with MumbaiMap, ProjectList, FilterPanel
   - Test as you go

5. **Customize & Deploy**
   - Add your branding
   - Configure for production
   - Deploy to Vercel + Railway

---

## 💡 Pro Tips

- 📖 **Read the docs first** - Saves debugging time
- 🧪 **Test in small pieces** - Don't write 100 lines without testing
- 🔍 **Use browser DevTools** - Network tab shows API calls
- 📝 **Check console logs** - Errors appear there first
- 🗺️ **Test map separately** - Leaflet can be tricky
- 💾 **Commit often** - Small commits are easier to debug
- 📊 **Use Swagger UI** - Test APIs before frontend integration

---

## ⚡ Performance Tips

- Use `React.memo()` for expensive components
- Implement virtual scrolling for long lists
- Lazy load images with Next.js Image
- Debounce search inputs (already in utils)
- Use `useMemo()` for expensive calculations
- Optimize map markers with clustering

---

## 🎓 Learning Resources

- **FastAPI**: https://fastapi.tiangolo.com/tutorial/
- **Next.js**: https://nextjs.org/learn
- **React**: https://react.dev/learn
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Tailwind**: https://tailwindcss.com/docs
- **Leaflet**: https://leafletjs.com/examples.html
- **PostgreSQL**: https://www.postgresql.org/docs/

---

## 📞 Getting Help

1. Check documentation in respective folders
2. Review COMPONENT_TEMPLATES.md for examples
3. Look at existing code patterns
4. Check browser console for errors
5. Review API response in Network tab
6. Test backend endpoints in Swagger UI
7. Create GitHub issue if stuck

---

**Good luck building! 🚀**

---

**Quick Links**:
- 📘 [Full Documentation](README.md)
- 🏗️ [Architecture](ARCHITECTURE.md)
- ✅ [Implementation Checklist](IMPLEMENTATION_CHECKLIST.md)
- 📝 [Component Templates](frontend/COMPONENT_TEMPLATES.md)
