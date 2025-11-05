'use client';

import { useEffect, useState } from 'react';
import { MapPin, TrendingUp, AlertCircle, CheckCircle, ChevronLeft, ChevronRight, Menu, X, DollarSign, FolderKanban, Activity } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store';
import { apiClient } from '@/lib/api-client';
import type { DashboardStats } from '@/types';
import toast from 'react-hot-toast';

// Dynamically import map to avoid SSR issues
const MumbaiMap = dynamic(() => import('@/components/Map/MumbaiMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 animate-pulse" />,
});

const ProjectList = dynamic(() => import('@/components/Projects/ProjectList'), {
  ssr: false,
});

const FilterPanel = dynamic(() => import('@/components/Filters/FilterPanel'), {
  ssr: false,
});

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [showProjects, setShowProjects] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const { setProjects, setWards, setProjectsLoading, filters } = useAppStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Load dashboard stats
    apiClient.getDashboardStats().then(setStats).catch((err) => {
      console.error('Failed to load stats:', err);
    });

    // Load wards
    apiClient.getWards().then(setWards).catch((err) => {
      console.error('Failed to load wards:', err);
      toast.error('Failed to load ward data');
    });

    // Load projects
    const loadProjects = async () => {
      setProjectsLoading(true);
      try {
        const response = await apiClient.getProjects(filters);
        setProjects(response.items, response.total);
      } catch (err: any) {
        console.error('Failed to load projects:', err);
        toast.error(err.detail || 'Failed to load projects');
      } finally {
        setProjectsLoading(false);
      }
    };

    loadProjects();
  }, [mounted, filters, setProjects, setWards, setProjectsLoading]);

  if (!mounted) {
    return <div className="w-full h-screen bg-gray-50" />;
  }

  return (
    <main className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 z-50 shadow-sm flex-shrink-0">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <MapPin className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Mumbai Civic Budget Portal
                </h1>
                <p className="text-xs text-gray-500">Track infrastructure projects across Mumbai</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push('/about')}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                About
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - No Scrolling */}
      <div className="flex-1 overflow-hidden relative">
        {/* Full-Width Background: Dashboard Stats + Map */}
        <div className="h-full w-full flex flex-col bg-white">
          {/* Dashboard Stats - Full Width */}
          {stats && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 shadow-sm z-0">
              <div className="px-4 py-3">
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                  {/* Total Projects */}
                  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">Total Projects</p>
                        <p className="text-xl font-bold text-gray-900 mt-1">{stats.total_projects.toLocaleString()}</p>
                      </div>
                      <div className="ml-2 bg-blue-100 rounded-lg p-2">
                        <FolderKanban className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  {/* Total Budget */}
                  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">Total Budget</p>
                        <p className="text-xl font-bold text-gray-900 mt-1">₹{stats.total_budget.toLocaleString()} Cr</p>
                      </div>
                      <div className="ml-2 bg-green-100 rounded-lg p-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                  </div>

                  {/* Active Projects */}
                  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">Active</p>
                        <p className="text-xl font-bold text-gray-900 mt-1">{stats.active_projects.toLocaleString()}</p>
                      </div>
                      <div className="ml-2 bg-orange-100 rounded-lg p-2">
                        <Activity className="h-5 w-5 text-orange-600" />
                      </div>
                    </div>
                  </div>

                  {/* Completed Projects */}
                  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">Completed</p>
                        <p className="text-xl font-bold text-gray-900 mt-1">{stats.completed_projects.toLocaleString()}</p>
                      </div>
                      <div className="ml-2 bg-emerald-100 rounded-lg p-2">
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                      </div>
                    </div>
                  </div>

                  {/* Proposed Projects */}
                  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">Proposed</p>
                        <p className="text-xl font-bold text-gray-900 mt-1">{stats.proposed_projects.toLocaleString()}</p>
                      </div>
                      <div className="ml-2 bg-purple-100 rounded-lg p-2">
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Map Container - Full Width */}
          <div className="flex-1 overflow-hidden w-full">
            <MumbaiMap key={`map-${showFilters}-${showProjects}`} />
          </div>
        </div>

        {/* Left Sidebar - Overlay on top of map */}
        <div 
          className={`absolute left-0 top-0 h-full bg-white border-r border-gray-200 z-20 transition-transform duration-300 shadow-lg ${
            showFilters ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{ width: '320px' }}
        >
          <FilterPanel onClose={() => setShowFilters(false)} />
        </div>

        {/* Left Toggle Button - Hidden when sidebar is open */}
        {!showFilters && (
          <button
            onClick={() => setShowFilters(true)}
            className="absolute top-1/2 -translate-y-1/2 left-0 z-[1001] bg-white border border-gray-300 rounded-r-lg shadow-lg p-2 hover:bg-gray-50 transition-all duration-300"
            title="Show Filters"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        )}

        {/* Right Toggle Button */}
        <button
          onClick={() => setShowProjects(!showProjects)}
          className="absolute top-1/2 -translate-y-1/2 z-[1001] bg-white border border-gray-300 rounded-l-lg shadow-lg p-2 hover:bg-gray-50 transition-all duration-300"
          style={{ right: showProjects ? '384px' : '0px' }}
          title={showProjects ? 'Hide Projects' : 'Show Projects'}
        >
          {showProjects ? <ChevronRight className="w-5 h-5 text-gray-600" /> : <ChevronLeft className="w-5 h-5 text-gray-600" />}
        </button>

        {/* Right Sidebar - Overlay on top of map */}
        <div 
          className={`absolute right-0 top-0 h-full bg-white border-l border-gray-200 z-20 transition-transform duration-300 shadow-lg ${
            showProjects ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ width: '384px' }}
        >
          <ProjectList />
        </div>
      </div>
    </main>
  );
}
