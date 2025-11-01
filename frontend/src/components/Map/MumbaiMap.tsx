'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAppStore } from '@/store';
import type { Project } from '@/types';

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

// Component to handle map bounds restriction
function MapBoundsHandler() {
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds([
      [18.89, 72.77], // Southwest
      [19.27, 72.98], // Northeast
    ]);
    map.setMaxBounds(bounds);
    map.on('drag', function () {
      map.panInsideBounds(bounds, { animate: false });
    });
  }, [map]);

  return null;
}

// Custom marker icons based on project status
const getMarkerIcon = (status: string) => {
  const colors: Record<string, string> = {
    proposed: '#6B7280',
    tendered: '#3B82F6',
    awarded: '#F59E0B',
    in_progress: '#10B981',
    completed: '#059669',
    cancelled: '#EF4444',
  };

  const color = colors[status] || '#6B7280';

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

interface MumbaiMapProps {
  onProjectClick?: (project: Project) => void;
}

export default function MumbaiMap({ onProjectClick }: MumbaiMapProps) {
  const { projects } = useAppStore();
  const mapRef = useRef<L.Map | null>(null);

  // Filter projects that have location data
  const projectsWithLocation = projects.filter(
    (p) => p.centroid?.coordinates && p.centroid.coordinates.length === 2
  );

  const handleMarkerClick = (project: Project) => {
    if (onProjectClick) {
      onProjectClick(project);
    }
  };

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={MUMBAI_CENTER}
        zoom={11}
        className="h-full w-full z-0"
        maxBounds={MUMBAI_BOUNDS}
        maxBoundsViscosity={1.0}
        minZoom={10}
        maxZoom={18}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBoundsHandler />

        {projectsWithLocation.map((project) => {
          const [lng, lat] = project.centroid!.coordinates;
          return (
            <Marker
              key={project.id}
              position={[lat, lng]}
              icon={getMarkerIcon(project.status)}
              eventHandlers={{
                click: () => handleMarkerClick(project),
              }}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <h3 className="font-semibold text-sm mb-1">{project.title}</h3>
                  <p className="text-xs text-gray-600 mb-2">
                    {project.description?.substring(0, 100)}
                    {project.description && project.description.length > 100 ? '...' : ''}
                  </p>
                  <div className="flex items-center gap-2 text-xs">
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
                    <p className="text-xs text-gray-500 mt-2">
                      Budget: ₹{(project.budget_amount / 10000000).toFixed(2)} Cr
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg z-[1000] text-xs">
        <h4 className="font-semibold mb-2">Project Status</h4>
        <div className="space-y-1">
          {[
            { status: 'proposed', label: 'Proposed', color: '#6B7280' },
            { status: 'tendered', label: 'Tendered', color: '#3B82F6' },
            { status: 'awarded', label: 'Awarded', color: '#F59E0B' },
            { status: 'in_progress', label: 'In Progress', color: '#10B981' },
            { status: 'completed', label: 'Completed', color: '#059669' },
          ].map((item) => (
            <div key={item.status} className="flex items-center gap-2">
              <div
                style={{ backgroundColor: item.color }}
                className="w-3 h-3 rounded-full border border-white"
              />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
