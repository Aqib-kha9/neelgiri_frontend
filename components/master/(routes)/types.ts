export interface RouteStop {
  id: string;
  hubId: string; // Link to Location Master
  hubName: string; // Display name cache
  sequence: number; // 1, 2, 3...
  distanceFromPrevKm: number;
  transitTimeFromPrevMins: number; // Driving time
  haltTimeMins: number; // Loading/Unloading time
}

export interface Route {
  id: string;
  code: string;
  sourceCity: string;
  destinationCity: string;
  sourceHub: string;
  destinationHub: string;
  
  // Calculated Fields
  totalDistanceKm: number;
  totalTransitTimeHours: number;
  
  stops: RouteStop[]; // Intermediate hubs including Source (Seq 0) and Dest (Seq N)? No, usually intermediates. 
  // Let's keep Source and Dest separate in top fields, but stops array is usually intermediates. 
  // BETTER: stops array includes ALL points (Source -> Stop 1 -> Dest) for unified timeline logic.
  // Wait, `sourceHub` and `destinationHub` are good for high level. `stops` can be just intermediates.
  // Actually, for a timeline view, it is easier if `stops` includes EVERYTHING. 
  // But let's stick to the industry standard: Source/Dest are headers, Stops are intermediates.
  
  schedule: string[]; // ['MON', 'TUE', 'WED']
  departureTime: string; // "22:00"

  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  type: 'LINEHAUL' | 'FEEDER' | 'LAST_MILE';
  isReturnRoute: boolean;
  returnRouteId?: string;
  baseCost: number;
  vehicleTypeRequired?: string; // e.g. "32FT MXL"
}

export interface RouteFormData extends Omit<Route, 'id' | 'totalDistanceKm' | 'totalTransitTimeHours'> {
    // calculated fields not needed in form
}
