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

export interface EmergencyService {
  id: string;
  type: 'hospital' | 'police' | 'fire' | 'pharmacy';
  name: string;
  location: [number, number];
  contact?: string;
  available24x7: boolean;
}

// Mock center coordinates (Visakhapatnam, India)
export const CENTER_COORDS: [number, number] = [17.6869, 83.2185];

// Mock lighting zones (Visakhapatnam areas)
export const mockLightingZones: LightingZone[] = [
  {
    id: 'light-1',
    coordinates: [
      [17.7000, 83.2900],
      [17.7000, 83.3000],
      [17.7100, 83.3000],
      [17.7100, 83.2900],
    ],
    intensity: 'dark',
    type: 'zone'
  },
  {
    id: 'light-2',
    coordinates: [
      [17.7200, 83.3100],
      [17.7200, 83.3200],
      [17.7300, 83.3200],
      [17.7300, 83.3100],
    ],
    intensity: 'dim',
    type: 'zone'
  },
  {
    id: 'light-3',
    coordinates: [
      [17.6900, 83.2100],
      [17.6900, 83.2300],
      [17.7000, 83.2300],
      [17.7000, 83.2100],
    ],
    intensity: 'bright',
    type: 'zone'
  },
];

// Mock crowd zones (Visakhapatnam areas)
export const mockCrowdZones: CrowdZone[] = [
  {
    id: 'crowd-1',
    location: [17.7100, 83.2950],
    density: 'high',
    radius: 300
  },
  {
    id: 'crowd-2',
    location: [17.6869, 83.2185],
    density: 'medium',
    radius: 250
  },
  {
    id: 'crowd-3',
    location: [17.7250, 83.3150],
    density: 'low',
    radius: 200
  },
];

export const mockHazards: Hazard[] = [
  {
    id: 'h1',
    type: 'accident',
    location: [17.7050, 83.2950],
    severity: 'high',
    description: 'Vehicle accident reported',
    timestamp: '10 min ago'
  },
  {
    id: 'h2',
    type: 'dark',
    location: [17.7050, 83.2950],
    severity: 'medium',
    description: 'Poor street lighting',
  },
  {
    id: 'h3',
    type: 'construction',
    location: [17.7100, 83.3000],
    severity: 'low',
    description: 'Road work in progress',
    timestamp: '1 hour ago'
  },
  {
    id: 'h4',
    type: 'crowded',
    location: [17.6869, 83.2185],
    severity: 'medium',
    description: 'High crowd density area',
  },
  {
    id: 'h5',
    type: 'crime',
    location: [17.7000, 83.2900],
    severity: 'high',
    description: 'Crime alert in this area',
    timestamp: '2 hours ago'
  },
];

// Emergency services in Visakhapatnam
export const mockEmergencyServices: EmergencyService[] = [
  {
    id: 'em1',
    type: 'hospital',
    name: 'King George Hospital',
    location: [17.7070, 83.3020],
    contact: '+91-891-2564290',
    available24x7: true
  },
  {
    id: 'em2',
    type: 'hospital',
    name: 'Seven Hills Hospital',
    location: [17.7300, 83.3100],
    contact: '+91-891-2790222',
    available24x7: true
  },
  {
    id: 'em3',
    type: 'police',
    name: 'Gajuwaka Police Station',
    location: [17.7050, 83.2100],
    contact: '100',
    available24x7: true
  },
  {
    id: 'em4',
    type: 'police',
    name: 'MVP Police Station',
    location: [17.7650, 83.3250],
    contact: '100',
    available24x7: true
  },
  {
    id: 'em5',
    type: 'fire',
    name: 'Fire Station Gajuwaka',
    location: [17.7080, 83.2120],
    contact: '101',
    available24x7: true
  },
  {
    id: 'em6',
    type: 'fire',
    name: 'Fire Station RK Beach',
    location: [17.6920, 83.2200],
    contact: '101',
    available24x7: true
  },
  {
    id: 'em7',
    type: 'pharmacy',
    name: 'Apollo Pharmacy',
    location: [17.7250, 83.3080],
    contact: '+91-891-2566777',
    available24x7: true
  },
  {
    id: 'em8',
    type: 'pharmacy',
    name: 'MedPlus Pharmacy',
    location: [17.7100, 83.2950],
    contact: '+91-891-2544888',
    available24x7: false
  },
  {
    id: 'em9',
    type: 'hospital',
    name: 'KIMS Hospital',
    location: [17.7450, 83.3150],
    contact: '+91-891-6677777',
    available24x7: true
  },
  {
    id: 'em10',
    type: 'police',
    name: 'Beach Road Police Station',
    location: [17.6900, 83.2250],
    contact: '100',
    available24x7: true
  },
];

// Realistic routes for Visakhapatnam
export const mockRoutes: RouteOption[] = [
  // Route 1: Vignan College → Gajuwaka
  {
    id: 'vignan-gajuwaka-safe',
    name: 'Safest Route',
    type: 'safe',
    safetyScore: 92,
    duration: '32 min',
    distance: '14.2 km',
    coordinates: [
      [17.7650, 83.3250], // Vignan College, Vadlapudi
      [17.7600, 83.3200],
      [17.7550, 83.3100],
      [17.7450, 83.3000],
      [17.7350, 83.2900],
      [17.7250, 83.2800],
      [17.7150, 83.2600],
      [17.7100, 83.2400],
      [17.7050, 83.2200], // Gajuwaka
    ],
    hazards: [],
    features: ['Well-lit streets', 'Police patrol area', 'CCTV coverage', 'Low traffic'],
    lightingScore: 90,
    crowdDensity: 'medium'
  },
  {
    id: 'vignan-gajuwaka-balanced',
    name: 'Balanced Route',
    type: 'balanced',
    safetyScore: 78,
    duration: '28 min',
    distance: '13.5 km',
    coordinates: [
      [17.7650, 83.3250], // Vignan College, Vadlapudi
      [17.7580, 83.3150],
      [17.7480, 83.2950],
      [17.7350, 83.2750],
      [17.7200, 83.2550],
      [17.7100, 83.2300],
      [17.7050, 83.2200], // Gajuwaka
    ],
    hazards: [mockHazards[1]],
    features: ['Moderate lighting', 'Main roads', 'Some CCTV'],
    lightingScore: 75,
    crowdDensity: 'high'
  },
  {
    id: 'vignan-gajuwaka-fast',
    name: 'Fastest Route',
    type: 'fast',
    safetyScore: 65,
    duration: '24 min',
    distance: '12.8 km',
    coordinates: [
      [17.7650, 83.3250], // Vignan College, Vadlapudi
      [17.7550, 83.3100],
      [17.7400, 83.2850],
      [17.7250, 83.2600],
      [17.7150, 83.2400],
      [17.7050, 83.2200], // Gajuwaka
    ],
    hazards: [mockHazards[0], mockHazards[1], mockHazards[3]],
    features: ['Highway route', 'Heavy traffic', 'Limited lighting'],
    lightingScore: 62,
    crowdDensity: 'high'
  },
  
  // Route 2: Simhachalam Temple → Vignan College
  {
    id: 'simhachalam-vignan-safe',
    name: 'Safest Route',
    type: 'safe',
    safetyScore: 88,
    duration: '38 min',
    distance: '16.5 km',
    coordinates: [
      [17.7617, 83.2536], // Simhachalam Temple
      [17.7600, 83.2650],
      [17.7550, 83.2800],
      [17.7500, 83.2950],
      [17.7550, 83.3100],
      [17.7600, 83.3200],
      [17.7650, 83.3250], // Vignan College
    ],
    hazards: [],
    features: ['Temple route', 'Well-lit', 'Police presence', 'Low traffic'],
    lightingScore: 85,
    crowdDensity: 'low'
  },
  {
    id: 'simhachalam-vignan-balanced',
    name: 'Balanced Route',
    type: 'balanced',
    safetyScore: 76,
    duration: '34 min',
    distance: '15.8 km',
    coordinates: [
      [17.7617, 83.2536], // Simhachalam Temple
      [17.7580, 83.2700],
      [17.7520, 83.2900],
      [17.7550, 83.3050],
      [17.7620, 83.3200],
      [17.7650, 83.3250], // Vignan College
    ],
    hazards: [mockHazards[2]],
    features: ['Mixed roads', 'Moderate traffic'],
    lightingScore: 72,
    crowdDensity: 'medium'
  },
  {
    id: 'simhachalam-vignan-fast',
    name: 'Fastest Route',
    type: 'fast',
    safetyScore: 68,
    duration: '30 min',
    distance: '15.2 km',
    coordinates: [
      [17.7617, 83.2536], // Simhachalam Temple
      [17.7600, 83.2750],
      [17.7580, 83.3000],
      [17.7620, 83.3180],
      [17.7650, 83.3250], // Vignan College
    ],
    hazards: [mockHazards[1], mockHazards[2]],
    features: ['Highway', 'Heavy traffic', 'Construction zones'],
    lightingScore: 65,
    crowdDensity: 'high'
  },

  // Route 3: Gajuwaka → RK Beach
  {
    id: 'gajuwaka-beach-safe',
    name: 'Safest Route',
    type: 'safe',
    safetyScore: 90,
    duration: '26 min',
    distance: '11.8 km',
    coordinates: [
      [17.7050, 83.2200], // Gajuwaka
      [17.7000, 83.2250],
      [17.6950, 83.2200],
      [17.6920, 83.2180],
      [17.6900, 83.2185],
      [17.6880, 83.2200],
      [17.6869, 83.2185], // RK Beach
    ],
    hazards: [],
    features: ['Beach road', 'CCTV coverage', 'Well-lit', 'Tourist area'],
    lightingScore: 92,
    crowdDensity: 'medium'
  },
  {
    id: 'gajuwaka-beach-balanced',
    name: 'Balanced Route',
    type: 'balanced',
    safetyScore: 80,
    duration: '22 min',
    distance: '10.9 km',
    coordinates: [
      [17.7050, 83.2200], // Gajuwaka
      [17.7000, 83.2220],
      [17.6950, 83.2190],
      [17.6900, 83.2180],
      [17.6869, 83.2185], // RK Beach
    ],
    hazards: [mockHazards[3]],
    features: ['Main road', 'Moderate traffic', 'Some lighting'],
    lightingScore: 78,
    crowdDensity: 'high'
  },
  {
    id: 'gajuwaka-beach-fast',
    name: 'Fastest Route',
    type: 'fast',
    safetyScore: 70,
    duration: '18 min',
    distance: '10.2 km',
    coordinates: [
      [17.7050, 83.2200], // Gajuwaka
      [17.6980, 83.2210],
      [17.6920, 83.2195],
      [17.6869, 83.2185], // RK Beach
    ],
    hazards: [mockHazards[0], mockHazards[4]],
    features: ['Highway', 'Heavy traffic', 'Limited CCTV'],
    lightingScore: 68,
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
