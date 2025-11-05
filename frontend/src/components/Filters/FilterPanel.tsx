'use client';

import { useState } from 'react';
import { Filter, X, ChevronLeft } from 'lucide-react';
import { useAppStore } from '@/store';
import type { ProjectStatus } from '@/types';

export default function FilterPanel({ onClose }: { onClose?: () => void }) {
  const { filters, setFilters, wards } = useAppStore();
  const [showFilters, setShowFilters] = useState(true);

  const handleStatusChange = (status: ProjectStatus | '') => {
    setFilters({ ...filters, status: status || undefined });
  };

  const handleWardChange = (wardId: string) => {
    setFilters({ ...filters, ward_id: wardId || undefined });
  };

  const clearFilters = () => {
    setFilters({});
  };

  const activeFilterCount = Object.keys(filters).filter(
    (key) => key !== 'skip' && key !== 'limit' && key !== 'q' && filters[key as keyof typeof filters]
  ).length;

  return (
    <div className="bg-white h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
              {activeFilterCount}
            </span>
          )}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            {showFilters ? 'Hide' : 'Show'}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded"
              title="Close sidebar"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Status
            </label>
            <select
              value={filters.status || ''}
              onChange={(e) => handleStatusChange(e.target.value as ProjectStatus)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="proposed">Proposed</option>
              <option value="tendered">Tendered</option>
              <option value="awarded">Awarded</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="stalled">Stalled</option>
            </select>
          </div>

          {/* Ward Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ward
            </label>
            <select
              value={filters.ward_id || ''}
              onChange={(e) => handleWardChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Wards</option>
              {wards.map((ward) => (
                <option key={ward.id} value={ward.id}>
                  {ward.name} {ward.code ? `(${ward.code})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Budget Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget Range (Crores)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.min_budget ? filters.min_budget / 10000000 : ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    min_budget: e.target.value ? Number(e.target.value) * 10000000 : undefined,
                  })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.max_budget ? filters.max_budget / 10000000 : ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    max_budget: e.target.value ? Number(e.target.value) * 10000000 : undefined,
                  })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Clear Filters Button */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <X className="h-4 w-4" />
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
