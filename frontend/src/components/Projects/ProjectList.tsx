'use client';

import { useState } from 'react';
import { MapPin, Calendar, TrendingUp, ChevronRight, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store';
import type { ProjectSummary } from '@/types';

interface ProjectListProps {
  onProjectClick?: (project: ProjectSummary) => void;
}

export default function ProjectList({ onProjectClick }: ProjectListProps) {
  const router = useRouter();
  const { projects, projectsLoading, filters, setFilters } = useAppStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(filters.q || '');

  const handleProjectClick = (project: ProjectSummary) => {
    setSelectedId(project.id);
    if (onProjectClick) {
      onProjectClick(project);
    }
    // Navigate to detail page
    router.push(`/projects/${project.id}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, q: searchQuery });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      proposed: 'bg-gray-100 text-gray-800',
      tendered: 'bg-blue-100 text-blue-800',
      awarded: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-green-100 text-green-800',
      completed: 'bg-emerald-100 text-emerald-800',
      stalled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatBudget = (amount: number | null, currency: string | null) => {
    if (!amount) return 'N/A';
    const crores = amount / 10000000;
    return `₹${crores.toFixed(2)} Cr`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search Bar at Top */}
      <div className="flex-shrink-0 p-4 bg-white border-b border-gray-200">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </form>
        <div className="mt-2 text-xs text-gray-500">
          {projects.length} project{projects.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Projects List */}
      {projectsLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading projects...</p>
          </div>
        </div>
      ) : projects.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No projects found</p>
            <p className="text-sm text-gray-500 mt-2">Try adjusting your filters</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-3">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleProjectClick(project)}
                className={`
                  bg-white rounded-lg p-4 shadow-sm border-2 transition-all cursor-pointer
                  hover:shadow-md hover:border-blue-300
                  ${selectedId === project.id ? 'border-blue-500 shadow-md' : 'border-transparent'}
                `}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 flex-1 pr-2 line-clamp-2">
                    {project.title}
                  </h3>
                  <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                </div>

                {/* Description */}
                {project.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {project.description}
                  </p>
                )}

                {/* Status Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status.replace('_', ' ').toUpperCase()}
                  </span>
                  {project.confidence_score && (
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <TrendingUp className="h-3 w-3" />
                      {(project.confidence_score * 100).toFixed(0)}% confidence
                    </span>
                  )}
                </div>

                {/* Budget */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="font-medium">Budget:</span>
                    <span>{formatBudget(project.budget_amount, project.budget_currency)}</span>
                  </div>
                </div>

                {/* Updated Date */}
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                  <Calendar className="h-3 w-3" />
                  <span>Updated {formatDate(project.updated_at)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
