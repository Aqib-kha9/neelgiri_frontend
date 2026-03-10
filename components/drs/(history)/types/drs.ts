export interface DRSData {
  id: string;
  drsNumber: string;
  status: string;
  rider: {
    id: string;
    name: string;
    phone: string;
    vehicle: string;
    rating: number;
  };
  date: string;
  timeline: {
    startTime: string;
    endTime: string;
    duration: string;
  };
  progress: {
    totalShipments: number;
    delivered: number;
    pending: number;
    returned: number;
    completion: number;
  };
  financial: {
    totalCOD: number;
    collectedCOD: number;
    pendingCOD: number;
    cashDeposited: number;
    depositTime: string;
  };
  performance: {
    averageTimePerStop: string;
    efficiency: number;
    onTimeRate: number;
    customerRating: number;
  };
  route: {
    totalDistance: string;
    optimized: boolean;
    fuelCost: string;
  };
  issues: Array<{
    type: string;
    description: string;
  }>;
}
