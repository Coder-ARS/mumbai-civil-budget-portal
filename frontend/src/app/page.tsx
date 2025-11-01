'use client';

import { useEffect, useState } from 'react';
import { MapPin, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useAppStore } from '@/store';
import { apiClient } from '@/lib/api-client';
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
  const [mounted, setMounted] = useState(false);
  const { setProjects, setWards, setProjectsLoading, filters } = useAppStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

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
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <MapPin className="w-8 h-8 text-primary-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Mumbai Civil Budget Portal
                </h1>
                <p className="text-xs text-gray-500">Track infrastructure projects across Mumbai</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="btn-ghost">
                About
              </button>
              <button className="btn-primary">
                Report Issue
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Sidebar - Filters */}
        <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto custom-scrollbar hidden lg:block">
          <FilterPanel />
        </aside>

        {/* Center - Map */}
        <div className="flex-1 relative">
          <MumbaiMap />
        </div>

        {/* Right Sidebar - Project List */}
        <aside className="w-96 bg-white border-l border-gray-200 overflow-y-auto custom-scrollbar">
          <ProjectList />
        </aside>
      </div>

      {/* Quick Stats Bar (Optional) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-around text-sm">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-gray-600">150 Projects</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-gray-600">45 Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span className="text-gray-600">20 In Progress</span>
          </div>
        </div>
      </div>
    </main>
  );
}
