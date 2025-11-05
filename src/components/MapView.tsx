import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RouteOption, Hazard, LightingZone, CrowdZone, EmergencyService } from '@/data/mockData';

interface MapViewProps {
  routes: RouteOption[];
  hazards: Hazard[];
  selectedRoute: RouteOption | null;
  center: [number, number];
  lightingZones?: LightingZone[];
  crowdZones?: CrowdZone[];
  emergencyServices?: EmergencyService[];
  showEmergencyServices?: boolean;
  isNavigating?: boolean;
  currentPosition?: [number, number];
  traveledPath?: [number, number][];
}

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapView = ({ 
  routes, 
  hazards, 
  selectedRoute, 
  center, 
  lightingZones = [], 
  crowdZones = [], 
  emergencyServices = [], 
  showEmergencyServices = false,
  isNavigating = false,
  currentPosition,
  traveledPath = [],
}: MapViewProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const routeLayers = useRef<L.Polyline[]>([]);
  const hazardLayers = useRef<L.Marker[]>([]);
  const lightingLayers = useRef<L.Polygon[]>([]);
  const crowdLayers = useRef<L.Circle[]>([]);
  const emergencyLayers = useRef<L.Marker[]>([]);
  const navigationMarkerRef = useRef<L.Marker | null>(null);
  const traveledPathRef = useRef<L.Polyline | null>(null);

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

  // Update lighting zones
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing lighting layers
    lightingLayers.current.forEach(layer => layer.remove());
    lightingLayers.current = [];

    // Add lighting zones to map
    lightingZones.forEach((zone) => {
      if (!mapRef.current) return;

      const colorMap = {
        dark: '#1a1a1a',
        dim: '#4a4a4a',
        bright: '#ffd700',
      };

      const opacityMap = {
        dark: 0.4,
        dim: 0.25,
        bright: 0.15,
      };

      const polygon = L.polygon(zone.coordinates, {
        color: colorMap[zone.intensity],
        fillColor: colorMap[zone.intensity],
        fillOpacity: opacityMap[zone.intensity],
        weight: 2,
      }).addTo(mapRef.current);

      // Add lighting icon
      const center = polygon.getBounds().getCenter();
      const lightIcon = L.divIcon({
        html: zone.intensity === 'dark' 
          ? '<div style="font-size: 24px;">🌙</div>' 
          : zone.intensity === 'dim'
          ? '<div style="font-size: 24px;">💡</div>'
          : '<div style="font-size: 24px;">☀️</div>',
        className: '',
        iconSize: [24, 24],
      });

      L.marker(center, { icon: lightIcon })
        .bindPopup(`
          <div style="min-width: 120px;">
            <div style="font-weight: bold; margin-bottom: 4px;">Lighting: ${zone.intensity.charAt(0).toUpperCase() + zone.intensity.slice(1)}</div>
          </div>
        `)
        .addTo(mapRef.current);

      lightingLayers.current.push(polygon);
    });
  }, [lightingZones]);

  // Update crowd zones
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing crowd layers
    crowdLayers.current.forEach(layer => layer.remove());
    crowdLayers.current = [];

    // Add crowd zones to map
    crowdZones.forEach((zone) => {
      if (!mapRef.current) return;

      const colorMap = {
        low: '#10b981',
        medium: '#f59e0b',
        high: '#ef4444',
      };

      const circle = L.circle(zone.location, {
        color: colorMap[zone.density],
        fillColor: colorMap[zone.density],
        fillOpacity: 0.15,
        radius: zone.radius,
        weight: 2,
      }).addTo(mapRef.current);

      // Add crowd icon
      const crowdIcon = L.divIcon({
        html: '<div style="font-size: 24px;">👥</div>',
        className: '',
        iconSize: [24, 24],
      });

      L.marker(zone.location, { icon: crowdIcon })
        .bindPopup(`
          <div style="min-width: 120px;">
            <div style="font-weight: bold; margin-bottom: 4px;">Crowd Density: ${zone.density.charAt(0).toUpperCase() + zone.density.slice(1)}</div>
          </div>
        `)
        .addTo(mapRef.current);

      crowdLayers.current.push(circle);
    });
  }, [crowdZones]);

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

  // Update emergency services
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing emergency layers
    emergencyLayers.current.forEach(layer => layer.remove());
    emergencyLayers.current = [];

    // Only add emergency services if toggle is on
    if (!showEmergencyServices) return;

    // Add emergency services to map
    emergencyServices.forEach((service) => {
      if (!mapRef.current) return;

      const serviceIcons = {
        hospital: '🏥',
        police: '👮',
        fire: '🚒',
        pharmacy: '💊',
      };

      const serviceColors = {
        hospital: '#ef4444',
        police: '#3b82f6',
        fire: '#f97316',
        pharmacy: '#10b981',
      };

      const icon = serviceIcons[service.type];
      const color = serviceColors[service.type];

      const emergencyIcon = L.divIcon({
        html: `<div style="background-color: ${color}; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 3px 10px rgba(0,0,0,0.4); font-size: 18px;">${icon}</div>`,
        className: '',
        iconSize: [36, 36],
      });

      const marker = L.marker(service.location, { icon: emergencyIcon })
        .bindPopup(`
          <div style="min-width: 180px;">
            <div style="font-weight: bold; margin-bottom: 6px; font-size: 14px;">${service.name}</div>
            <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
              ${service.type.charAt(0).toUpperCase() + service.type.slice(1)}
            </div>
            ${service.contact ? `<div style="font-size: 12px; color: #333; margin-bottom: 4px;">📞 ${service.contact}</div>` : ''}
            ${service.available24x7 ? '<div style="font-size: 11px; color: #10b981; font-weight: 600;">● Emergency 24/7</div>' : '<div style="font-size: 11px; color: #f59e0b;">⏰ Limited Hours</div>'}
            <button onclick="window.location.href='tel:${service.contact}'" style="margin-top: 8px; width: 100%; padding: 6px 12px; background: ${color}; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;">Call Now</button>
          </div>
        `)
        .addTo(mapRef.current);

      emergencyLayers.current.push(marker);
    });
  }, [emergencyServices, showEmergencyServices]);

  // Update navigation marker and traveled path
  useEffect(() => {
    if (!mapRef.current || !isNavigating) {
      // Remove navigation marker when not navigating
      if (navigationMarkerRef.current) {
        navigationMarkerRef.current.remove();
        navigationMarkerRef.current = null;
      }
      if (traveledPathRef.current) {
        traveledPathRef.current.remove();
        traveledPathRef.current = null;
      }
      return;
    }

    if (currentPosition) {
      // Remove old navigation marker
      if (navigationMarkerRef.current) {
        navigationMarkerRef.current.remove();
      }

      // Create animated car/navigation marker
      const carIcon = L.divIcon({
        html: `
          <div style="
            width: 40px; 
            height: 40px; 
            border-radius: 50%; 
            background: linear-gradient(135deg, #10b981, #059669);
            display: flex; 
            align-items: center; 
            justify-content: center;
            border: 4px solid white;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.5);
            animation: pulse 2s infinite;
          ">
            <div style="font-size: 20px; transform: rotate(0deg);">🚗</div>
          </div>
          <style>
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.1); }
            }
          </style>
        `,
        className: '',
        iconSize: [40, 40],
      });

      navigationMarkerRef.current = L.marker(currentPosition, { 
        icon: carIcon,
        zIndexOffset: 1000 
      }).addTo(mapRef.current);

      // Center map on current position
      mapRef.current.setView(currentPosition, mapRef.current.getZoom());
    }

    // Update traveled path
    if (traveledPath.length > 1) {
      if (traveledPathRef.current) {
        traveledPathRef.current.remove();
      }

      traveledPathRef.current = L.polyline(traveledPath, {
        color: '#10b981',
        weight: 6,
        opacity: 1,
        smoothFactor: 1,
      }).addTo(mapRef.current);
    }
  }, [isNavigating, currentPosition, traveledPath]);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full rounded-lg shadow-lg"
      style={{ minHeight: '500px' }}
    />
  );
};

export default MapView;
