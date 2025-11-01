/**
 * Global state management using Zustand
 */

import { create } from 'zustand';
import type {
  ProjectSummary,
  ProjectDetail,
  Ward,
  ProjectFilters,
  User,
} from '@/types';

interface AppState {
  // Projects
  projects: ProjectSummary[];
  selectedProject: ProjectDetail | null;
  projectsLoading: boolean;
  projectsTotal: number;
  
  // Filters
  filters: ProjectFilters;
  setFilters: (filters: Partial<ProjectFilters>) => void;
  resetFilters: () => void;
  
  // Wards
  wards: Ward[];
  setWards: (wards: Ward[]) => void;
  
  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  filterPanelOpen: boolean;
  setFilterPanelOpen: (open: boolean) => void;
  
  // Selected project
  setSelectedProject: (project: ProjectDetail | null) => void;
  
  // Projects list
  setProjects: (projects: ProjectSummary[], total: number) => void;
  setProjectsLoading: (loading: boolean) => void;
  
  // User
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Map state
  mapCenter: { lat: number; lng: number };
  mapZoom: number;
  setMapCenter: (center: { lat: number; lng: number }) => void;
  setMapZoom: (zoom: number) => void;
}

const DEFAULT_FILTERS: ProjectFilters = {
  skip: 0,
  limit: 50,
};

const DEFAULT_MAP_CENTER = {
  lat: parseFloat(process.env.NEXT_PUBLIC_MUMBAI_CENTER_LAT || '19.0760'),
  lng: parseFloat(process.env.NEXT_PUBLIC_MUMBAI_CENTER_LNG || '72.8777'),
};

const DEFAULT_MAP_ZOOM = parseInt(process.env.NEXT_PUBLIC_MAP_DEFAULT_ZOOM || '11');

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  projects: [],
  selectedProject: null,
  projectsLoading: false,
  projectsTotal: 0,
  filters: DEFAULT_FILTERS,
  wards: [],
  sidebarOpen: true,
  filterPanelOpen: false,
  user: null,
  mapCenter: DEFAULT_MAP_CENTER,
  mapZoom: DEFAULT_MAP_ZOOM,
  
  // Actions
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
    
  resetFilters: () =>
    set(() => ({
      filters: DEFAULT_FILTERS,
    })),
    
  setWards: (wards) => set({ wards }),
  
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  setFilterPanelOpen: (open) => set({ filterPanelOpen: open }),
  
  setSelectedProject: (project) => set({ selectedProject: project }),
  
  setProjects: (projects, total) =>
    set({ projects, projectsTotal: total }),
    
  setProjectsLoading: (loading) => set({ projectsLoading: loading }),
  
  setUser: (user) => set({ user }),
  
  setMapCenter: (center) => set({ mapCenter: center }),
  
  setMapZoom: (zoom) => set({ mapZoom: zoom }),
}));
