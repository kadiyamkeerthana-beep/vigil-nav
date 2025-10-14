import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RouteOption, Hazard } from '@/data/mockData';

interface MapViewProps {
  routes: RouteOption[];
  hazards: Hazard[];
  selectedRoute: RouteOption | null;
  center: [number, number];
}

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapView = ({ routes, hazards, selectedRoute, center }: MapViewProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const routeLayers = useRef<L.Polyline[]>([]);
  const hazardLayers = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: false,
      }).setView(center, 13);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update routes
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing route layers
    routeLayers.current.forEach(layer => layer.remove());
    routeLayers.current = [];

    // Add routes to map
    routes.forEach((route) => {
      if (!mapRef.current) return;

      const color = 
        route.type === 'safe' ? '#10b981' : 
        route.type === 'balanced' ? '#f59e0b' : 
        '#ef4444';

      const weight = selectedRoute?.id === route.id ? 6 : 3;
      const opacity = selectedRoute ? (selectedRoute.id === route.id ? 1 : 0.3) : 0.7;

      const polyline = L.polyline(route.coordinates, {
        color,
        weight,
        opacity,
        smoothFactor: 1,
      }).addTo(mapRef.current);

      routeLayers.current.push(polyline);

      // Add start marker
      if (route.coordinates.length > 0) {
        const startIcon = L.divIcon({
          html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          className: '',
          iconSize: [16, 16],
        });
        
        L.marker(route.coordinates[0], { icon: startIcon }).addTo(mapRef.current);
      }

      // Add end marker
      if (route.coordinates.length > 1) {
        const endIcon = L.divIcon({
          html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 4px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4);"></div>`,
          className: '',
          iconSize: [20, 20],
        });
        
        L.marker(route.coordinates[route.coordinates.length - 1], { icon: endIcon }).addTo(mapRef.current);
      }
    });

    // Fit bounds to show all routes
    if (routes.length > 0 && mapRef.current) {
      const allCoordinates = routes.flatMap(r => r.coordinates);
      if (allCoordinates.length > 0) {
        const bounds = L.latLngBounds(allCoordinates);
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [routes, selectedRoute]);

  // Update hazards
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing hazard layers
    hazardLayers.current.forEach(layer => layer.remove());
    hazardLayers.current = [];

    // Add hazards to map
    hazards.forEach((hazard) => {
      if (!mapRef.current) return;

      const hazardColors = {
        accident: '#ef4444',
        construction: '#f59e0b',
        crime: '#dc2626',
        dark: '#6b7280',
        crowded: '#8b5cf6',
      };

      const hazardIcons = {
        accident: '🚨',
        construction: '🚧',
        crime: '⚠️',
        dark: '🌙',
        crowded: '👥',
      };

      const color = hazardColors[hazard.type];
      const icon = hazardIcons[hazard.type];

      const hazardIcon = L.divIcon({
        html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); font-size: 16px;">${icon}</div>`,
        className: '',
        iconSize: [32, 32],
      });

      const marker = L.marker(hazard.location, { icon: hazardIcon })
        .bindPopup(`
          <div style="min-width: 150px;">
            <div style="font-weight: bold; margin-bottom: 4px;">${hazard.type.charAt(0).toUpperCase() + hazard.type.slice(1)}</div>
            <div style="font-size: 13px; color: #666;">${hazard.description}</div>
            ${hazard.timestamp ? `<div style="font-size: 11px; color: #999; margin-top: 4px;">${hazard.timestamp}</div>` : ''}
          </div>
        `)
        .addTo(mapRef.current);

      hazardLayers.current.push(marker);
    });
  }, [hazards]);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full rounded-lg shadow-lg"
      style={{ minHeight: '500px' }}
    />
  );
};

export default MapView;
