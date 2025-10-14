export interface LightingZone {
  id: string;
  coordinates: [number, number][];
  intensity: 'dark' | 'dim' | 'bright';
  type: 'zone';
}

export interface CrowdZone {
  id: string;
  location: [number, number];
  density: 'low' | 'medium' | 'high';
  radius: number;
}

export interface RouteOption {
  id: string;
  name: string;
  type: 'safe' | 'balanced' | 'fast';
  safetyScore: number;
  duration: string;
  distance: string;
  coordinates: [number, number][];
  hazards: Hazard[];
  features: string[];
  lightingScore: number;
  crowdDensity: 'low' | 'medium' | 'high';
}

export interface Hazard {
  id: string;
  type: 'accident' | 'construction' | 'crime' | 'dark' | 'crowded';
  location: [number, number];
  severity: 'low' | 'medium' | 'high';
  description: string;
  timestamp?: string;
}

export interface SafetyFilter {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
  description: string;
}

// Mock center coordinates (New York City as example)
export const CENTER_COORDS: [number, number] = [40.7128, -74.0060];

// Mock lighting zones
export const mockLightingZones: LightingZone[] = [
  {
    id: 'light-1',
    coordinates: [
      [40.7090, -74.0090],
      [40.7090, -74.0070],
      [40.7100, -74.0070],
      [40.7100, -74.0090],
    ],
    intensity: 'dark',
    type: 'zone'
  },
  {
    id: 'light-2',
    coordinates: [
      [40.7140, -74.0060],
      [40.7140, -74.0040],
      [40.7155, -74.0040],
      [40.7155, -74.0060],
    ],
    intensity: 'dim',
    type: 'zone'
  },
  {
    id: 'light-3',
    coordinates: [
      [40.7160, -74.0035],
      [40.7160, -74.0015],
      [40.7180, -74.0015],
      [40.7180, -74.0035],
    ],
    intensity: 'bright',
    type: 'zone'
  },
];

// Mock crowd zones
export const mockCrowdZones: CrowdZone[] = [
  {
    id: 'crowd-1',
    location: [40.7145, -74.0045],
    density: 'high',
    radius: 100
  },
  {
    id: 'crowd-2',
    location: [40.7165, -74.0025],
    density: 'medium',
    radius: 80
  },
  {
    id: 'crowd-3',
    location: [40.7105, -74.0085],
    density: 'low',
    radius: 60
  },
];

export const mockHazards: Hazard[] = [
  {
    id: 'h1',
    type: 'accident',
    location: [40.7180, -74.0020],
    severity: 'high',
    description: 'Vehicle accident reported',
    timestamp: '10 min ago'
  },
  {
    id: 'h2',
    type: 'dark',
    location: [40.7100, -74.0100],
    severity: 'medium',
    description: 'Poor street lighting',
  },
  {
    id: 'h3',
    type: 'construction',
    location: [40.7150, -74.0050],
    severity: 'low',
    description: 'Road work in progress',
    timestamp: '1 hour ago'
  },
  {
    id: 'h4',
    type: 'crowded',
    location: [40.7140, -73.9980],
    severity: 'medium',
    description: 'High crowd density area',
  },
  {
    id: 'h5',
    type: 'crime',
    location: [40.7090, -74.0080],
    severity: 'high',
    description: 'Crime alert in this area',
    timestamp: '2 hours ago'
  },
];

export const mockRoutes: RouteOption[] = [
  {
    id: 'route-safe',
    name: 'Safest Route',
    type: 'safe',
    safetyScore: 95,
    duration: '18 min',
    distance: '3.2 km',
    coordinates: [
      [40.7128, -74.0060],
      [40.7145, -74.0045],
      [40.7160, -74.0030],
      [40.7175, -74.0015],
      [40.7190, -74.0000],
    ],
    hazards: [],
    features: ['Well-lit streets', 'Police patrol area', 'CCTV coverage'],
    lightingScore: 95,
    crowdDensity: 'medium'
  },
  {
    id: 'route-balanced',
    name: 'Balanced Route',
    type: 'balanced',
    safetyScore: 78,
    duration: '14 min',
    distance: '2.8 km',
    coordinates: [
      [40.7128, -74.0060],
      [40.7140, -74.0050],
      [40.7155, -74.0035],
      [40.7170, -74.0020],
      [40.7190, -74.0000],
    ],
    hazards: [mockHazards[1]],
    features: ['Moderate lighting', 'Some traffic'],
    lightingScore: 72,
    crowdDensity: 'high'
  },
  {
    id: 'route-fast',
    name: 'Fastest Route',
    type: 'fast',
    safetyScore: 62,
    duration: '11 min',
    distance: '2.4 km',
    coordinates: [
      [40.7128, -74.0060],
      [40.7135, -74.0045],
      [40.7150, -74.0030],
      [40.7165, -74.0015],
      [40.7190, -74.0000],
    ],
    hazards: [mockHazards[0], mockHazards[1], mockHazards[3]],
    features: ['Main roads', 'Heavy traffic'],
    lightingScore: 58,
    crowdDensity: 'high'
  },
];

export const safetyFilters: SafetyFilter[] = [
  {
    id: 'lighting',
    name: 'Well-lit Streets',
    icon: 'Sun',
    enabled: true,
    description: 'Prioritize well-illuminated routes'
  },
  {
    id: 'police',
    name: 'Police Patrol',
    icon: 'Shield',
    enabled: true,
    description: 'Routes with police presence'
  },
  {
    id: 'cctv',
    name: 'CCTV Coverage',
    icon: 'Camera',
    enabled: true,
    description: 'Areas with camera surveillance'
  },
  {
    id: 'crowd',
    name: 'Avoid Crowds',
    icon: 'Users',
    enabled: false,
    description: 'Minimize crowd density'
  },
  {
    id: 'accidents',
    name: 'No Accidents',
    icon: 'AlertTriangle',
    enabled: true,
    description: 'Avoid accident zones'
  },
  {
    id: 'weather',
    name: 'Weather Safe',
    icon: 'Cloud',
    enabled: false,
    description: 'Consider weather conditions'
  },
];
