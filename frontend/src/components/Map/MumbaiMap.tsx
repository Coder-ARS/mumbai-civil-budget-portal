'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Plus, Minus } from 'lucide-react';
import { useAppStore } from '@/store';
import type { Project } from '@/types';
import { useRouter } from 'next/navigation';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Mumbai bounds
const MUMBAI_BOUNDS: L.LatLngBoundsExpression = [
  [18.89, 72.77], // Southwest
  [19.27, 72.98], // Northeast
];

const MUMBAI_CENTER: L.LatLngExpression = [19.076, 72.8777];

// Component to handle map bounds restriction (removed aggressive panning)
function MapBoundsHandler() {
  const map = useMap();

  useEffect(() => {
    // Bounds are set via MapContainer props, no need for extra drag restrictions
  }, [map]);

  return null;
}

// Custom marker icons based on project status with labels
const getMarkerIcon = (status: string, title: string) => {
  const colors: Record<string, string> = {
    proposed: '#6B7280',
    tendered: '#3B82F6',
    awarded: '#F59E0B',
    in_progress: '#10B981',
    completed: '#059669',
    cancelled: '#EF4444',
  };

  const color = colors[status] || '#6B7280';
  const truncatedTitle = title.length > 30 ? title.substring(0, 30) + '...' : title;

  return L.divIcon({
    className: 'custom-marker-with-label',
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; white-space: nowrap;">
        <div style="
          background-color: ${color};
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1000;
        ">
          <div style="
            width: 10px;
            height: 10px;
            background-color: white;
            border-radius: 50%;
          "></div>
        </div>
        <div style="
          background-color: white;
          padding: 4px 8px;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          font-size: 11px;
          font-weight: 600;
          color: #1f2937;
          margin-top: 4px;
          max-width: 200px;
          text-overflow: ellipsis;
          overflow: hidden;
        ">
          ${truncatedTitle}
        </div>
      </div>
    `,
    iconSize: [200, 60],
    iconAnchor: [100, 28],
    popupAnchor: [0, -28],
  });
};

interface MumbaiMapProps {
  onProjectClick?: (project: Project) => void;
  showLeftSidebar?: boolean;
}

export default function MumbaiMap({ onProjectClick, showLeftSidebar = false }: MumbaiMapProps) {
  const { projects } = useAppStore();
  const mapRef = useRef<L.Map | null>(null);
  const router = useRouter();

  // Filter projects that have location data
  const projectsWithLocation = projects.filter(
    (p) => p.centroid && Array.isArray(p.centroid) && p.centroid.length === 2
  );

  const handleMarkerClick = (project: Project) => {
    if (onProjectClick) {
      onProjectClick(project);
    }
  };

  const handleViewDetails = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={MUMBAI_CENTER}
        zoom={11}
        className="h-full w-full z-0"
        maxBounds={MUMBAI_BOUNDS}
        maxBoundsViscosity={0.5}
        minZoom={10}
        maxZoom={18}
        ref={mapRef}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBoundsHandler />

        {projectsWithLocation.map((project) => {
          const [lng, lat] = project.centroid!;
          return (
            <Marker
              key={project.id}
              position={[lat, lng]}
              icon={getMarkerIcon(project.status, project.title)}
              eventHandlers={{
                click: () => handleMarkerClick(project),
              }}
            >
              <Popup>
                <div className="min-w-[250px]">
                  <h3 className="font-semibold text-base mb-2">{project.title}</h3>
                  <p className="text-xs text-gray-600 mb-3">
                    {project.description?.substring(0, 100)}
                    {project.description && project.description.length > 100 ? '...' : ''}
                  </p>
                  <div className="flex items-center gap-2 text-xs mb-3">
                    <span
                      className={`px-2 py-1 rounded-full ${
                        project.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : project.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800'
                          : project.status === 'proposed'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {project.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  {project.budget_amount && (
                    <p className="text-sm text-gray-700 mb-3 font-medium">
                      Budget: ₹{(project.budget_amount / 10000000).toFixed(2)} Cr
                    </p>
                  )}
                  <button
                    onClick={() => handleViewDetails(project.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors"
                  >
                    View Details →
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Legend - Grid Layout */}
      {/* Map Legend - Single Line Layout */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-lg z-[1000]">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-sm text-gray-900 mr-2">Project Status:</span>
          {[
            { status: 'proposed', label: 'Proposed', color: '#6B7280' },
            { status: 'tendered', label: 'Tendered', color: '#3B82F6' },
            { status: 'awarded', label: 'Awarded', color: '#F59E0B' },
            { status: 'in_progress', label: 'In Progress', color: '#10B981' },
            { status: 'completed', label: 'Completed', color: '#059669' },
          ].map((item) => (
            <div
              key={item.status}
              className="flex items-center gap-2"
            >
              <div
                style={{ backgroundColor: item.color }}
                className="w-3 h-3 rounded-sm shadow-sm"
              />
              <span className="text-xs font-medium text-gray-700 whitespace-nowrap">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Zoom Controls - Bottom Left */}
      <div 
        className="absolute bottom-4 bg-white rounded-lg shadow-lg z-[1000] flex flex-col transition-all duration-300"
        style={{
          left: showLeftSidebar ? '340px' : '20px',
        }}
      >
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-gray-100 border-b border-gray-200 rounded-t-lg transition-colors"
          title="Zoom In"
          aria-label="Zoom In"
        >
          <Plus className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-gray-100 rounded-b-lg transition-colors"
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          <Minus className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
}
