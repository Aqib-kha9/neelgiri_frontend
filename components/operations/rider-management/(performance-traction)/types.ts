export interface RiderPerformance {
    id: string;
    name: string;
    riderId: string;
    totalDeliveries: number;
    onTimeDeliveryPct: number;
    avgRating: number;
    cancellationRate: number;
    avgDeliveryTime: string;
    earnings: number;
    incentives: number;
    complaints: number;
    status: "excellent" | "good" | "average" | "poor";
}
