# Mumbai Civil Budget Portal - Frontend

Modern, responsive React + Next.js frontend for tracking Mumbai's infrastructure projects with an interactive locked Mumbai map.

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Maps**: React-Leaflet + Leaflet
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Toast Notifications**: React Hot Toast
- **Image Handling**: React Dropzone
- **Animations**: Framer Motion

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── projects/           # Project pages
│   ├── components/
│   │   ├── Map/                # Map components
│   │   │   ├── MumbaiMap.tsx   # Main locked map
│   │   │   ├── ProjectMarker.tsx
│   │   │   └── MapControls.tsx
│   │   ├── Projects/
│   │   │   ├── ProjectList.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   └── ProjectDetail.tsx
│   │   ├── Filters/
│   │   │   └── FilterPanel.tsx
│   │   ├── UI/                 # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Badge.tsx
│   │   └── Layout/
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── Footer.tsx
│   ├── lib/
│   │   ├── api-client.ts       # API client
│   │   └── utils.ts            # Utility functions
│   ├── store/
│   │   └── index.ts            # Zustand store
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   └── styles/
│       └── globals.css         # Global styles
├── public/                     # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** and npm/yarn/pnpm
- **Backend API running** on `http://localhost:8000`

### Installation

```powershell
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Configuration

1. **Copy environment file**:
```powershell
copy .env.local.example .env.local
```

2. **Edit `.env.local`** with your settings:
```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_VERSION=v1

# Map Configuration
NEXT_PUBLIC_MUMBAI_CENTER_LAT=19.0760
NEXT_PUBLIC_MUMBAI_CENTER_LNG=72.8777
NEXT_PUBLIC_MAP_DEFAULT_ZOOM=11
NEXT_PUBLIC_MAP_MIN_ZOOM=10
NEXT_PUBLIC_MAP_MAX_ZOOM=18
```

### Development

```powershell
# Start development server
npm run dev

# Or use specific port
npm run dev -- -p 3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```powershell
# Build the application
npm run build

# Start production server
npm start
```

### Type Checking

```powershell
# Run TypeScript compiler
npm run type-check
```

### Linting

```powershell
# Run ESLint
npm run lint
```

## 🗺️ Key Features

### 1. Locked Mumbai Map
- **Restricted Bounds**: Users cannot pan outside Mumbai's boundaries
- **Zoom Control**: Min/max zoom levels configured
- **Clustering**: Projects cluster at lower zoom levels
- **Status-based Markers**: Different colors for project statuses
- **Interactive Popups**: Click markers to see project summaries

### 2. Project Tracking
- **List View**: Scrollable project list with cards
- **Detail View**: Full project information with timeline
- **Filtering**: By status, ward, budget, date range
- **Search**: Real-time search across projects
- **Sort Options**: By date, budget, confidence

### 3. Comments & Updates
- **Citizen Reports**: Users can submit progress updates
- **Official Updates**: Marked as verified
- **Photo Uploads**: Attach images to reports
- **Upvoting**: Community verification system
- **Moderation**: Flag inappropriate content

### 4. Responsive Design
- **Desktop**: Three-column layout (filters, map, list)
- **Tablet**: Two-column layout with drawer
- **Mobile**: Full-screen map with bottom sheet

## 🎨 UI Components

### Core Components

#### MumbaiMap
Leaflet-based map with Mumbai bounds restriction:
```typescript
<MumbaiMap
  projects={projects}
  selectedId={selectedProjectId}
  onProjectSelect={(id) => setSelectedProject(id)}
/>
```

#### ProjectCard
Display project summary:
```typescript
<ProjectCard
  project={project}
  onClick={() => router.push(`/projects/${project.id}`)}
/>
```

#### FilterPanel
Advanced filtering UI:
```typescript
<FilterPanel
  filters={filters}
  onFilterChange={(newFilters) => setFilters(newFilters)}
/>
```

#### ProjectDetail
Full project information:
```typescript
<ProjectDetail
  projectId={projectId}
  showComments={true}
/>
```

### UI Utilities

#### Status Badge
```typescript
<Badge status={project.status}>
  {getStatusLabel(project.status)}
</Badge>
```

#### Currency Formatting
```typescript
{formatCurrency(project.budget_amount)}
// Output: ₹12.50 Cr
```

#### Date Formatting
```typescript
{formatRelativeTime(project.updated_at)}
// Output: "2 days ago"
```

## 📊 State Management

Using Zustand for global state:

```typescript
// Access state
const { projects, filters, setFilters } = useAppStore();

// Update filters
setFilters({ status: 'in_progress' });

// Select project
setSelectedProject(projectDetail);
```

## 🔌 API Integration

All API calls go through the centralized client:

```typescript
import { apiClient } from '@/lib/api-client';

// Get projects with filters
const response = await apiClient.getProjects({
  q: 'metro',
  status: 'in_progress',
  limit: 50,
});

// Get project details
const project = await apiClient.getProject(projectId);

// Create report
await apiClient.createReport({
  title: 'Road pothole',
  description: 'Large pothole affecting traffic',
});
```

## 🎯 Key Pages

### Home Page (`/`)
- Main map interface
- Filter panel on left
- Project list on right
- Quick stats bar at bottom

### Project Detail (`/projects/[id]`)
- Full project information
- Timeline and milestones
- Documents and photos
- Comments section
- Related projects

### Wards (`/wards`)
- List of all 24 Mumbai wards
- Ward-level statistics
- Projects per ward

### Contractors (`/contractors`)
- Contractor directory
- Projects awarded
- Performance metrics

### Tenders (`/tenders`)
- Active and past tenders
- Filter by status and date
- Link to projects

## 🎨 Styling Guide

### Color System

```typescript
// Primary (Indigo)
primary-50 to primary-900

// Status Colors
status-proposed: gray
status-tendered: blue
status-awarded: purple
status-in_progress: amber
status-completed: green
status-stalled: red
```

### Common Patterns

```tsx
// Button
<button className="btn-primary">
  Primary Action
</button>

// Card
<div className="card">
  Content
</div>

// Input
<input className="input" />

// Badge
<span className="badge bg-blue-100 text-blue-800">
  Status
</span>
```

## 📱 Responsive Breakpoints

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

## 🔧 Configuration

### Map Settings

Adjust in `.env.local`:
- `NEXT_PUBLIC_MUMBAI_CENTER_LAT`: Map center latitude
- `NEXT_PUBLIC_MUMBAI_CENTER_LNG`: Map center longitude
- `NEXT_PUBLIC_MAP_DEFAULT_ZOOM`: Initial zoom level
- `NEXT_PUBLIC_MAP_MIN_ZOOM`: Minimum zoom (restrict zoom out)
- `NEXT_PUBLIC_MAP_MAX_ZOOM`: Maximum zoom

### API Settings

- `NEXT_PUBLIC_API_BASE_URL`: Backend API URL
- `NEXT_PUBLIC_API_VERSION`: API version (v1)

## 🧪 Testing

```powershell
# Unit tests (to be implemented)
npm test

# E2E tests (to be implemented)
npm run test:e2e
```

## 📈 Performance Optimization

- **Code Splitting**: Dynamic imports for heavy components
- **Image Optimization**: Next.js Image component
- **Lazy Loading**: React Suspense for below-fold content
- **Memoization**: React.memo for expensive components
- **Debouncing**: Search and filter inputs
- **Virtual Scrolling**: Large lists (to be implemented)

## ♿ Accessibility

- **Keyboard Navigation**: All interactive elements accessible
- **ARIA Labels**: Proper labels on controls
- **Focus Management**: Visible focus indicators
- **Color Contrast**: WCAG AA compliant
- **Screen Reader**: Semantic HTML

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🚧 Roadmap

### Phase 1 (MVP) - Completed ✅
- [x] Project structure setup
- [x] API client integration
- [x] Type definitions
- [x] Basic layout and routing
- [x] State management

### Phase 2 - In Progress 🚧
- [ ] Mumbai map with bounds
- [ ] Project list and cards
- [ ] Filter panel
- [ ] Project detail page
- [ ] Search functionality

### Phase 3 - Planned 📋
- [ ] Report submission
- [ ] Comment system
- [ ] Photo uploads
- [ ] User authentication
- [ ] Mobile optimization

### Phase 4 - Future 🔮
- [ ] PWA support
- [ ] Offline mode
- [ ] Push notifications
- [ ] Analytics dashboard
- [ ] Multi-language support

## 🐛 Troubleshooting

### Map not loading
- Check Leaflet CSS is imported
- Ensure `ssr: false` for map component
- Verify Mumbai coordinates in `.env.local`

### API connection errors
- Confirm backend is running on port 8000
- Check CORS settings in backend
- Verify API_BASE_URL in environment

### Build errors
- Run `npm install` to ensure all dependencies
- Clear `.next` folder: `rm -rf .next`
- Check Node version: `node --version` (should be 18+)

### Type errors
- Run `npm run type-check`
- Ensure TypeScript version is correct
- Check `tsconfig.json` paths

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React-Leaflet](https://react-leaflet.js.org/)
- [Zustand](https://github.com/pmndrs/zustand)
- [TypeScript](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Run tests and type-check
4. Submit pull request

## 📄 License

MIT License

## 👥 Team

Mumbai Civil Budget Portal Frontend Team

---

**Note**: This frontend requires the backend API to be running. See `../backend/README.md` for backend setup instructions.

For questions or issues, please create an issue in the repository.
