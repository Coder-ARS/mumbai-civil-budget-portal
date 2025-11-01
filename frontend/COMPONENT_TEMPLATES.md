# Component Implementation Guide

This guide provides ready-to-use templates for implementing the remaining frontend components.

## 📋 Table of Contents
1. [UI Components](#ui-components)
2. [Map Components](#map-components)
3. [Project Components](#project-components)
4. [Filter Components](#filter-components)
5. [Layout Components](#layout-components)

---

## UI Components

### 1. Button Component

**File**: `src/components/UI/Button.tsx`

```typescript
'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'md',
    loading = false,
    icon,
    className,
    disabled,
    ...props 
  }, ref) => {
    const variants = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      ghost: 'btn-ghost',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium',
          'transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : icon ? (
          icon
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
```

**Usage**:
```typescript
import Button from '@/components/UI/Button';
import { Plus } from 'lucide-react';

<Button variant="primary" icon={<Plus size={16} />}>
  Add Project
</Button>
```

---

### 2. Card Component

**File**: `src/components/UI/Card.tsx`

```typescript
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export default function Card({ 
  children, 
  className, 
  hoverable = false,
  onClick 
}: CardProps) {
  return (
    <div
      className={cn(
        'card',
        hoverable && 'hover:shadow-lg cursor-pointer transition-shadow duration-200',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-6 py-4 border-b border-gray-200', className)}>{children}</div>;
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-6 py-4', className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-6 py-4 border-t border-gray-200 bg-gray-50', className)}>{children}</div>;
}
```

**Usage**:
```typescript
import Card, { CardHeader, CardBody, CardFooter } from '@/components/UI/Card';

<Card hoverable>
  <CardHeader>
    <h3 className="font-semibold">Project Title</h3>
  </CardHeader>
  <CardBody>
    <p>Project details here...</p>
  </CardBody>
  <CardFooter>
    <button>View Details</button>
  </CardFooter>
</Card>
```

---

### 3. Badge Component

**File**: `src/components/UI/Badge.tsx`

```typescript
import { cn } from '@/lib/utils';
import type { ProjectStatus } from '@/types';
import { getStatusColor, getStatusLabel } from '@/lib/utils';

interface BadgeProps {
  status: ProjectStatus;
  className?: string;
}

export default function Badge({ status, className }: BadgeProps) {
  const colorClasses = {
    proposed: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    tendered: 'bg-purple-100 text-purple-800',
    awarded: 'bg-indigo-100 text-indigo-800',
    in_progress: 'bg-orange-100 text-orange-800',
    completed: 'bg-emerald-100 text-emerald-800',
    delayed: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800',
  };

  return (
    <span
      className={cn(
        'badge px-2.5 py-0.5 rounded-full text-xs font-medium',
        colorClasses[status],
        className
      )}
    >
      {getStatusLabel(status)}
    </span>
  );
}
```

---

### 4. Modal Component

**File**: `src/components/UI/Modal.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className={cn(
          'bg-white rounded-lg shadow-xl w-full animate-slide-up',
          sizes[size]
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            {title && <h2 className="text-xl font-semibold text-gray-900">{title}</h2>}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}

export function ModalFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3', className)}>
      {children}
    </div>
  );
}
```

**Usage**:
```typescript
const [isOpen, setIsOpen] = useState(false);

<Modal 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)}
  title="Add New Project"
  size="lg"
>
  <p>Modal content here...</p>
  <ModalFooter>
    <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
    <Button variant="primary">Submit</Button>
  </ModalFooter>
</Modal>
```

---

### 5. Input Component

**File**: `src/components/UI/Input.tsx`

```typescript
'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            className={cn(
              'input w-full',
              icon && 'pl-10',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          />
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
```

---

## Map Components

### 1. Mumbai Map Component

**File**: `src/components/Map/MumbaiMap.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAppStore } from '@/store';
import { MUMBAI_CENTER, MUMBAI_BOUNDS } from '@/lib/utils';
import type { ProjectSummary } from '@/types';
import Badge from '@/components/UI/Badge';

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Create custom icons based on status
const getMarkerIcon = (status: string) => {
  const colors = {
    proposed: '#3B82F6',
    approved: '#10B981',
    in_progress: '#F59E0B',
    completed: '#059669',
    delayed: '#EF4444',
    cancelled: '#6B7280',
  };

  const color = colors[status as keyof typeof colors] || '#3B82F6';
  
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "></div>
    `,
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

// Component to restrict map bounds
function BoundsRestrictor() {
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds(
      [MUMBAI_BOUNDS.south, MUMBAI_BOUNDS.west],
      [MUMBAI_BOUNDS.north, MUMBAI_BOUNDS.east]
    );

    map.setMaxBounds(bounds);
    map.on('drag', () => {
      map.panInsideBounds(bounds, { animate: false });
    });
  }, [map]);

  return null;
}

interface MumbaiMapProps {
  projects: ProjectSummary[];
  onProjectClick?: (project: ProjectSummary) => void;
}

export default function MumbaiMap({ projects, onProjectClick }: MumbaiMapProps) {
  const { mapCenter, mapZoom, setSelectedProject } = useAppStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="map-container flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  const handleMarkerClick = (project: ProjectSummary) => {
    setSelectedProject(project);
    if (onProjectClick) {
      onProjectClick(project);
    }
  };

  return (
    <div className="map-container">
      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={mapZoom}
        className="h-full w-full"
        zoomControl={false}
        minZoom={11}
        maxZoom={18}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <BoundsRestrictor />

        {projects.map((project) => {
          if (!project.latitude || !project.longitude) return null;
          
          return (
            <Marker
              key={project.id}
              position={[project.latitude, project.longitude]}
              icon={getMarkerIcon(project.status)}
              eventHandlers={{
                click: () => handleMarkerClick(project),
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {project.title}
                  </h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge status={project.status} />
                    </div>
                    {project.budget && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Budget:</span>
                        <span className="font-medium">₹{(project.budget / 10000000).toFixed(2)} Cr</span>
                      </div>
                    )}
                    {project.ward_name && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Ward:</span>
                        <span className="font-medium">{project.ward_name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
```

---

## Project Components

### 1. Project Card Component

**File**: `src/components/Projects/ProjectCard.tsx`

```typescript
'use client';

import { MapPin, Calendar, DollarSign } from 'lucide-react';
import type { ProjectSummary } from '@/types';
import Badge from '@/components/UI/Badge';
import Card from '@/components/UI/Card';
import { formatCurrency, formatDate } from '@/lib/utils';

interface ProjectCardProps {
  project: ProjectSummary;
  onClick?: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <Card hoverable onClick={onClick} className="mb-4">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-gray-900 text-lg flex-1 pr-2">
            {project.title}
          </h3>
          <Badge status={project.status} />
        </div>

        {/* Description */}
        {project.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {project.description}
          </p>
        )}

        {/* Info Grid */}
        <div className="space-y-2">
          {project.ward_name && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin size={16} className="mr-2 text-gray-400" />
              <span>{project.ward_name}</span>
            </div>
          )}

          {project.budget && (
            <div className="flex items-center text-sm text-gray-600">
              <DollarSign size={16} className="mr-2 text-gray-400" />
              <span>Budget: {formatCurrency(project.budget)}</span>
            </div>
          )}

          {project.start_date && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar size={16} className="mr-2 text-gray-400" />
              <span>Start: {formatDate(project.start_date)}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        {project.confidence_score && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Data Confidence</span>
              <span className="font-medium text-gray-700">
                {(project.confidence_score * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
```

---

### 2. Project List Component

**File**: `src/components/Projects/ProjectList.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store';
import ProjectCard from './ProjectCard';
import { Loader2, AlertCircle } from 'lucide-react';
import type { ProjectSummary } from '@/types';

interface ProjectListProps {
  onProjectClick?: (project: ProjectSummary) => void;
}

export default function ProjectList({ onProjectClick }: ProjectListProps) {
  const { projects, projectsLoading, selectedProject } = useAppStore();
  const [error, setError] = useState<string | null>(null);

  if (projectsLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        <p className="text-gray-600">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div className="text-center">
          <p className="text-gray-900 font-medium mb-1">Failed to load projects</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <AlertCircle className="h-12 w-12 text-gray-400" />
        <div className="text-center">
          <p className="text-gray-900 font-medium mb-1">No projects found</p>
          <p className="text-sm text-gray-600">Try adjusting your filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Projects ({projects.length})
        </h2>
      </div>

      <div className="space-y-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => onProjectClick?.(project)}
          />
        ))}
      </div>
    </div>
  );
}
```

---

## Filter Components

### Filter Panel Component

**File**: `src/components/Filters/FilterPanel.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import { Search, X, Filter } from 'lucide-react';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';
import type { ProjectStatus } from '@/types';
import { getStatusLabel } from '@/lib/utils';

const PROJECT_STATUSES: ProjectStatus[] = [
  'proposed',
  'approved',
  'tendered',
  'awarded',
  'in_progress',
  'completed',
  'delayed',
  'cancelled',
];

export default function FilterPanel() {
  const { filters, setFilters, resetFilters, wards } = useAppStore();
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApply = () => {
    setFilters(localFilters);
  };

  const handleReset = () => {
    resetFilters();
    setLocalFilters({});
  };

  const toggleStatus = (status: ProjectStatus) => {
    const currentStatuses = localFilters.status || [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter((s) => s !== status)
      : [...currentStatuses, status];
    
    setLocalFilters({ ...localFilters, status: newStatuses.length > 0 ? newStatuses : undefined });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-600" />
          <h2 className="font-semibold text-gray-900">Filters</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          Clear All
        </Button>
      </div>

      {/* Search */}
      <div>
        <Input
          placeholder="Search projects..."
          value={localFilters.q || ''}
          onChange={(e) => setLocalFilters({ ...localFilters, q: e.target.value || undefined })}
          icon={<Search size={18} />}
        />
      </div>

      {/* Status Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Status</h3>
        <div className="space-y-2">
          {PROJECT_STATUSES.map((status) => (
            <label key={status} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.status?.includes(status) || false}
                onChange={() => toggleStatus(status)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">{getStatusLabel(status)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Ward Filter */}
      {wards.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Ward</h3>
          <select
            value={localFilters.ward_id || ''}
            onChange={(e) => setLocalFilters({ ...localFilters, ward_id: e.target.value || undefined })}
            className="input w-full"
          >
            <option value="">All Wards</option>
            {wards.map((ward) => (
              <option key={ward.id} value={ward.id}>
                Ward {ward.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Budget Range */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Budget (Crores)</h3>
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            placeholder="Min"
            value={localFilters.min_budget ? localFilters.min_budget / 10000000 : ''}
            onChange={(e) => setLocalFilters({
              ...localFilters,
              min_budget: e.target.value ? parseFloat(e.target.value) * 10000000 : undefined,
            })}
          />
          <Input
            type="number"
            placeholder="Max"
            value={localFilters.max_budget ? localFilters.max_budget / 10000000 : ''}
            onChange={(e) => setLocalFilters({
              ...localFilters,
              max_budget: e.target.value ? parseFloat(e.target.value) * 10000000 : undefined,
            })}
          />
        </div>
      </div>

      {/* Apply Button */}
      <Button variant="primary" className="w-full" onClick={handleApply}>
        Apply Filters
      </Button>
    </div>
  );
}
```

---

## Next Steps

1. **Create component directories**:
   ```powershell
   mkdir src\components\UI
   mkdir src\components\Map
   mkdir src\components\Projects
   mkdir src\components\Filters
   mkdir src\components\Layout
   ```

2. **Copy templates** from this guide into the appropriate files

3. **Install Leaflet CSS** by ensuring `globals.css` imports it or add to `layout.tsx`:
   ```typescript
   import 'leaflet/dist/leaflet.css';
   ```

4. **Test components** individually before integrating

5. **Customize** styling and behavior as needed

---

## Tips

- Use `'use client'` directive for all interactive components
- Import types from `@/types`
- Use utility functions from `@/lib/utils`
- Access global state with `useAppStore()`
- Follow existing patterns from `page.tsx`

**Happy coding!** 🚀
