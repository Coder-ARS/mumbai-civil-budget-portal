# Mumbai Civil Budget Portal - Architecture Diagrams

Visual representations of the system architecture.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                            │
│                     (Browser / Mobile)                           │
└────────────┬────────────────────────────────────────────────────┘
             │
             │ HTTP/HTTPS
             │
┌────────────▼────────────────────────────────────────────────────┐
│                      FRONTEND LAYER                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │          Next.js 14 (React 18 + TypeScript)              │   │
│  │                                                           │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐    │   │
│  │  │  Pages      │  │  Components  │  │   State     │    │   │
│  │  │  (Routes)   │  │   (UI/Map/   │  │  (Zustand)  │    │   │
│  │  │             │  │   Projects)  │  │             │    │   │
│  │  └─────────────┘  └──────────────┘  └─────────────┘    │   │
│  │                                                           │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐    │   │
│  │  │  API Client │  │   Utils      │  │   Types     │    │   │
│  │  │  (Axios)    │  │  (Helpers)   │  │(TypeScript) │    │   │
│  │  └─────────────┘  └──────────────┘  └─────────────┘    │   │
│  │                                                           │   │
│  │  Styling: Tailwind CSS + Custom Styles                   │   │
│  │  Maps: React-Leaflet + OpenStreetMap                     │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────┬────────────────────────────────────────────────────┘
             │
             │ REST API (JSON)
             │ http://localhost:8000/api
             │
┌────────────▼────────────────────────────────────────────────────┐
│                       BACKEND LAYER                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              FastAPI (Python 3.9+)                       │   │
│  │                                                           │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐    │   │
│  │  │   Routes    │  │   Schemas    │  │   Config    │    │   │
│  │  │  (API       │  │  (Pydantic)  │  │  (Settings) │    │   │
│  │  │  Endpoints) │  │              │  │             │    │   │
│  │  └─────────────┘  └──────────────┘  └─────────────┘    │   │
│  │                                                           │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐    │   │
│  │  │  Database   │  │   Models     │  │    CRUD     │    │   │
│  │  │  Session    │  │ (SQLAlchemy) │  │ Operations  │    │   │
│  │  │  (Async)    │  │              │  │             │    │   │
│  │  └─────────────┘  └──────────────┘  └─────────────┘    │   │
│  │                                                           │   │
│  │  Features:                                                │   │
│  │  - Async operations (asyncpg)                            │   │
│  │  - Request validation (Pydantic)                         │   │
│  │  - CORS enabled                                          │   │
│  │  - Error handling                                        │   │
│  │  - Auto-generated docs (Swagger/ReDoc)                   │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────┬────────────────────────────────────────────────────┘
             │
             │ asyncpg
             │ SQL Queries
             │
┌────────────▼────────────────────────────────────────────────────┐
│                      DATABASE LAYER                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           PostgreSQL 14+ with PostGIS                    │   │
│  │                                                           │   │
│  │  Tables (13):                                             │   │
│  │  • projects          • wards             • contractors   │   │
│  │  • tenders           • contracts         • progress_upd  │   │
│  │  • sources           • documents         • users         │   │
│  │  • reports           • approvals         • audit_logs    │   │
│  │  • payments                                               │   │
│  │                                                           │   │
│  │  Extensions:                                              │   │
│  │  • PostGIS (geospatial data)                             │   │
│  │  • uuid-ossp (UUID generation)                           │   │
│  │                                                           │   │
│  │  Features:                                                │   │
│  │  - Relationships & Foreign Keys                          │   │
│  │  - Indexes for performance                               │   │
│  │  - Geometry columns (POINT, MULTIPOLYGON)                │   │
│  │  - JSONB columns for flexible data                       │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow

### 1. Project List Display

```
User
  │
  ├─> Visits homepage (/)
  │
  └─> Next.js Page Component
        │
        ├─> useEffect() hook fires
        │
        └─> Zustand store action: loadProjects()
              │
              └─> API Client: getProjects(filters)
                    │
                    └─> HTTP GET /api/projects?status=in_progress&ward_id=123
                          │
                          └─> FastAPI Route Handler
                                │
                                ├─> Validate query params (Pydantic)
                                │
                                └─> CRUD: get_projects(filters)
                                      │
                                      └─> SQLAlchemy Query
                                            │
                                            └─> PostgreSQL Database
                                                  │
                                                  ├─> SELECT * FROM projects
                                                  │   WHERE status = 'in_progress'
                                                  │   AND ward_id = '123'
                                                  │
                                                  └─> Returns: List[Project]
                                                        │
                                                        └─> Transform to JSON
                                                              │
                                                              └─> Response to Frontend
                                                                    │
                                                                    └─> Update Zustand Store
                                                                          │
                                                                          └─> Re-render Components
                                                                                │
                                                                                ├─> ProjectList updates
                                                                                ├─> Map markers update
                                                                                └─> User sees projects
```

---

## 🗺️ Map Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      MumbaiMap Component                     │
│                                                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │           MapContainer (React-Leaflet)             │     │
│  │                                                     │     │
│  │  ┌──────────────┐  ┌──────────────────────────┐   │     │
│  │  │  TileLayer   │  │   Bounds Restrictor      │   │     │
│  │  │ (OSM tiles)  │  │  (Mumbai boundaries)     │   │     │
│  │  └──────────────┘  └──────────────────────────┘   │     │
│  │                                                     │     │
│  │  ┌──────────────────────────────────────────────┐ │     │
│  │  │         Project Markers                      │ │     │
│  │  │                                               │ │     │
│  │  │  projects.map(p => (                         │ │     │
│  │  │    <Marker                                    │ │     │
│  │  │      position={[p.lat, p.lng]}               │ │     │
│  │  │      icon={getStatusIcon(p.status)}          │ │     │
│  │  │    >                                          │ │     │
│  │  │      <Popup>                                  │ │     │
│  │  │        Project Info Card                     │ │     │
│  │  │      </Popup>                                 │ │     │
│  │  │    </Marker>                                  │ │     │
│  │  │  ))                                           │ │     │
│  │  └──────────────────────────────────────────────┘ │     │
│  │                                                     │     │
│  │  Features:                                          │     │
│  │  • Min/Max Zoom: 11-18                             │     │
│  │  • Bounds: Mumbai only                             │     │
│  │  • Center: 19.0760, 72.8777                        │     │
│  │  • Click handler → setSelectedProject()            │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
│  Props:                                                      │
│  • projects: ProjectSummary[]                               │
│  • onProjectClick?: (project) => void                       │
│                                                              │
│  State (from Zustand):                                       │
│  • mapCenter: { lat, lng }                                  │
│  • mapZoom: number                                          │
│  • selectedProject: ProjectSummary | null                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Component Hierarchy

```
App (layout.tsx)
│
├─── Metadata & Fonts
├─── Toaster (notifications)
│
└─── Page (page.tsx)
      │
      ├─── Header
      │     ├─── Logo
      │     ├─── Navigation
      │     └─── Actions (Add Project, Profile)
      │
      ├─── Main Content (3-column layout)
      │     │
      │     ├─── Left Sidebar (Filters)
      │     │     └─── FilterPanel
      │     │           ├─── Search Input
      │     │           ├─── Status Checkboxes
      │     │           ├─── Ward Selector
      │     │           └─── Budget Range
      │     │
      │     ├─── Center (Map)
      │     │     └─── MumbaiMap
      │     │           ├─── TileLayer
      │     │           ├─── BoundsRestrictor
      │     │           └─── ProjectMarkers[]
      │     │                 └─── Popup
      │     │
      │     └─── Right Sidebar (Project List)
      │           └─── ProjectList
      │                 └─── ProjectCard[]
      │                       ├─── Title
      │                       ├─── Status Badge
      │                       ├─── Description
      │                       ├─── Ward Info
      │                       ├─── Budget
      │                       └─── Start Date
      │
      └─── Modals (conditional)
            ├─── ProjectDetailModal
            ├─── ReportIssueModal
            └─── AuthModal
```

---

## 🔄 State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   Zustand Store (Global State)               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  Project State   │  │   UI State       │                │
│  ├──────────────────┤  ├──────────────────┤                │
│  │ • projects[]     │  │ • sidebarOpen    │                │
│  │ • selectedProject│  │ • filterPanelOpen│                │
│  │ • loading        │  │ • modalOpen      │                │
│  │ • error          │  │                  │                │
│  └──────────────────┘  └──────────────────┘                │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  Filter State    │  │   Map State      │                │
│  ├──────────────────┤  ├──────────────────┤                │
│  │ • status[]       │  │ • mapCenter      │                │
│  │ • ward_id        │  │ • mapZoom        │                │
│  │ • min_budget     │  │                  │                │
│  │ • max_budget     │  │                  │                │
│  │ • q (search)     │  │                  │                │
│  └──────────────────┘  └──────────────────┘                │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │    Actions       │  │  Other Data      │                │
│  ├──────────────────┤  ├──────────────────┤                │
│  │ • setProjects()  │  │ • wards[]        │                │
│  │ • setFilters()   │  │ • user           │                │
│  │ • resetFilters() │  │                  │                │
│  │ • setSelected()  │  │                  │                │
│  └──────────────────┘  └──────────────────┘                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         │                    │                    │
    Component A          Component B          Component C
    (MumbaiMap)         (ProjectList)       (FilterPanel)
         │                    │                    │
         └────────────────────┴────────────────────┘
                    All access same store
                    Re-render on state changes
```

---

## 🗄️ Database Schema (ER Diagram)

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│    wards     │         │   projects   │         │ contractors  │
├──────────────┤         ├──────────────┤         ├──────────────┤
│ id (PK)      │◄────┐   │ id (PK)      │   ┌────►│ id (PK)      │
│ name         │     │   │ title        │   │     │ name         │
│ number       │     └───│ ward_id (FK) │   │     │ registration │
│ geometry     │         │ status       │   │     │ rating       │
│ population   │         │ budget       │   │     │ projects_done│
└──────────────┘         │ start_date   │   │     └──────────────┘
                         │ latitude     │   │
                         │ longitude    │   │
                         │ confidence   │   │
                         └──────┬───────┘   │
                                │           │
                 ┌──────────────┼───────────┼──────────────┐
                 │              │           │              │
                 ▼              ▼           ▼              ▼
         ┌──────────┐   ┌──────────┐   ┌──────────┐  ┌──────────┐
         │ tenders  │   │contracts │   │progress_ │  │documents │
         ├──────────┤   ├──────────┤   │ updates  │  ├──────────┤
         │ id (PK)  │   │ id (PK)  │   ├──────────┤  │ id (PK)  │
         │ proj (FK)│   │ proj (FK)│   │ id (PK)  │  │ proj (FK)│
         │ pub_date │   │ cont (FK)│   │ proj (FK)│  │ file_url │
         │ deadline │   │ amount   │   │ user_id  │  │ type     │
         │ status   │   │ status   │   │ comment  │  │ uploaded │
         └──────────┘   └──────────┘   │ photos[] │  └──────────┘
                                        │ timestamp│
                                        └──────────┘
                                             │
                                             │
                    ┌────────────────────────┼────────────────┐
                    │                        │                │
                    ▼                        ▼                ▼
            ┌──────────┐              ┌──────────┐    ┌──────────┐
            │ reports  │              │  users   │    │ payments │
            ├──────────┤              ├──────────┤    ├──────────┤
            │ id (PK)  │              │ id (PK)  │    │ id (PK)  │
            │ proj (FK)│              │ email    │    │ cont (FK)│
            │ type     │              │ role     │    │ proj (FK)│
            │ desc     │              │ name     │    │ amount   │
            │ photos[] │              │ created  │    │ date     │
            │ status   │              └──────────┘    │ status   │
            └──────────┘                              └──────────┘

Legend:
  PK = Primary Key
  FK = Foreign Key
  ◄──┐ = One-to-Many relationship
```

---

## 📱 Responsive Layout

### Desktop (1024px+)
```
┌────────────────────────────────────────────────────────────┐
│                         Header                              │
├──────────┬─────────────────────────────────┬───────────────┤
│          │                                 │               │
│ Filters  │           Map                   │  Project List │
│          │                                 │               │
│ 20%      │           50%                   │     30%       │
│          │                                 │               │
│  [🔍]    │     [🗺️ Mumbai Map]            │  [📋 Cards]  │
│          │                                 │               │
│  Status  │     • Projects as markers       │   Card 1      │
│  ☐ Prop  │     • Popup on click            │   Card 2      │
│  ☑ Prog  │     • Locked bounds             │   Card 3      │
│          │                                 │   ...         │
│  Ward    │                                 │               │
│  [▼]     │                                 │  [Scroll]     │
│          │                                 │               │
│  Budget  │                                 │               │
│  [──●──] │                                 │               │
│          │                                 │               │
└──────────┴─────────────────────────────────┴───────────────┘
```

### Tablet (768px-1023px)
```
┌────────────────────────────────────────┐
│             Header                      │
├────────────────────────────────────────┤
│                                        │
│         [🗺️ Map - Full Width]         │
│                                        │
│         Takes 60% height               │
│                                        │
├────────────────────────────────────────┤
│                                        │
│   [Filters: Horizontal Scrolling]     │
│                                        │
├────────────────────────────────────────┤
│                                        │
│   Project List (Grid: 2 columns)      │
│   ┌────────┐  ┌────────┐              │
│   │ Card 1 │  │ Card 2 │              │
│   └────────┘  └────────┘              │
│   ┌────────┐  ┌────────┐              │
│   │ Card 3 │  │ Card 4 │              │
│   └────────┘  └────────┘              │
│                                        │
└────────────────────────────────────────┘
```

### Mobile (<768px)
```
┌────────────────────┐
│  Header (compact)  │
│  [☰] Logo [+]      │
├────────────────────┤
│                    │
│   🗺️ Map           │
│   (Full width)     │
│   70% height       │
│                    │
├────────────────────┤
│ [🔍 Search Bar]    │
├────────────────────┤
│ [≡ Filters]        │
│ (Bottom Sheet)     │
├────────────────────┤
│                    │
│ Project List       │
│ (Single column)    │
│                    │
│ ┌────────────────┐ │
│ │   Card 1       │ │
│ └────────────────┘ │
│ ┌────────────────┐ │
│ │   Card 2       │ │
│ └────────────────┘ │
│                    │
│ [Scroll down]      │
│                    │
└────────────────────┘
```

---

## 🔐 Authentication Flow (Future)

```
User Action
   │
   ├─> Click "Login"
   │
   └─> AuthModal opens
         │
         ├─> Enter credentials
         │
         └─> Submit form
               │
               └─> POST /api/auth/login
                     │
                     ├─> Validate credentials
                     │
                     ├─> Generate JWT token
                     │
                     └─> Return { token, user }
                           │
                           └─> Store in localStorage
                                 │
                                 ├─> Update Zustand store
                                 │   (user, isAuthenticated)
                                 │
                                 └─> Redirect to dashboard
                                       │
                                       └─> All future requests
                                           include Authorization header
                                           "Bearer <token>"
```

---

## 📊 API Request/Response Flow

### Example: Get Projects with Filters

**Request**:
```
GET /api/projects?status=in_progress&ward_id=abc123&limit=10&offset=0
Headers:
  Content-Type: application/json
```

**Backend Processing**:
```python
@router.get("/projects", response_model=PaginatedResponse[ProjectSummary])
async def get_projects(
    filters: ProjectFilter = Depends(),
    db: AsyncSession = Depends(get_db)
):
    # 1. Parse query params into ProjectFilter
    # 2. Call CRUD function
    projects, total = await crud.get_projects(db, filters)
    
    # 3. Return paginated response
    return PaginatedResponse(
        items=projects,
        total=total,
        limit=filters.limit,
        offset=filters.offset
    )
```

**Response**:
```json
{
  "items": [
    {
      "id": "uuid-here",
      "title": "Coastal Road Project",
      "status": "in_progress",
      "ward_id": "abc123",
      "ward_name": "Ward A",
      "budget": 100000000000,
      "latitude": 19.0760,
      "longitude": 72.8777,
      "confidence_score": 0.95,
      "start_date": "2023-01-15",
      "created_at": "2023-01-01T00:00:00Z"
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0,
  "has_more": false
}
```

---

## 🎯 Key Design Patterns

### 1. Repository Pattern (Backend)
```
Route Handler → CRUD Functions → SQLAlchemy Models → Database
```

### 2. Container/Presenter Pattern (Frontend)
```
Page Component → Data Fetching → Presentational Components
```

### 3. State Management Pattern
```
Action → Update Store → Notify Subscribers → Re-render
```

### 4. API Client Pattern
```
Component → API Client → Axios → Backend → Response → Component
```

---

This architecture ensures:
- ✅ Separation of concerns
- ✅ Scalability
- ✅ Maintainability
- ✅ Type safety
- ✅ Testability
- ✅ Performance

---

**Need more details?** Check the respective README files in backend/ and frontend/ folders.
