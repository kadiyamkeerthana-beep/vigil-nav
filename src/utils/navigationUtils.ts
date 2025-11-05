import { Direction } from "@/components/TurnByTurnDirections";

// Calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (
  coord1: [number, number],
  coord2: [number, number]
): number => {
  const R = 6371; // Earth's radius in km
  const lat1 = (coord1[0] * Math.PI) / 180;
  const lat2 = (coord2[0] * Math.PI) / 180;
  const dLat = ((coord2[0] - coord1[0]) * Math.PI) / 180;
  const dLon = ((coord2[1] - coord1[1]) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// Generate turn-by-turn directions from coordinates
export const generateDirections = (
  coordinates: [number, number][],
  routeName: string
): Direction[] => {
  const directions: Direction[] = [];
  
  for (let i = 0; i < coordinates.length - 1; i++) {
    const distance = calculateDistance(coordinates[i], coordinates[i + 1]);
    const distanceStr = distance < 1 
      ? `${Math.round(distance * 1000)}m` 
      : `${distance.toFixed(1)}km`;

    // Determine turn direction based on angle between segments
    let type: 'left' | 'right' | 'straight' | 'destination' = 'straight';
    
    if (i > 0) {
      const angle = calculateAngle(
        coordinates[i - 1],
        coordinates[i],
        coordinates[i + 1]
      );
      
      if (angle < -15) {
        type = 'left';
      } else if (angle > 15) {
        type = 'right';
      }
    }

    // Generate instruction based on type
    let instruction = '';
    switch (type) {
      case 'left':
        instruction = 'Turn left';
        break;
      case 'right':
        instruction = 'Turn right';
        break;
      case 'straight':
        instruction = i === 0 ? 'Head straight' : 'Continue straight';
        break;
    }

    directions.push({
      instruction,
      distance: distanceStr,
      type,
      completed: false,
    });
  }

  // Add destination instruction
  directions.push({
    instruction: 'You have arrived at your destination',
    distance: '0m',
    type: 'destination',
    completed: false,
  });

  return directions;
};

// Calculate angle between three points
const calculateAngle = (
  p1: [number, number],
  p2: [number, number],
  p3: [number, number]
): number => {
  const angle1 = Math.atan2(p2[0] - p1[0], p2[1] - p1[1]);
  const angle2 = Math.atan2(p3[0] - p2[0], p3[1] - p2[1]);
  let angle = ((angle2 - angle1) * 180) / Math.PI;
  
  if (angle > 180) angle -= 360;
  if (angle < -180) angle += 360;
  
  return angle;
};

// Calculate ETA based on distance and average speed
export const calculateETA = (distanceKm: number): string => {
  const averageSpeedKmh = 40; // Average speed in km/h
  const hoursRemaining = distanceKm / averageSpeedKmh;
  const minutesRemaining = Math.round(hoursRemaining * 60);
  
  if (minutesRemaining < 60) {
    return `${minutesRemaining} min`;
  } else {
    const hours = Math.floor(minutesRemaining / 60);
    const minutes = minutesRemaining % 60;
    return `${hours}h ${minutes}m`;
  }
};

// Interpolate between two coordinates
export const interpolateCoordinates = (
  start: [number, number],
  end: [number, number],
  progress: number
): [number, number] => {
  const lat = start[0] + (end[0] - start[0]) * progress;
  const lng = start[1] + (end[1] - start[1]) * progress;
  return [lat, lng];
};
