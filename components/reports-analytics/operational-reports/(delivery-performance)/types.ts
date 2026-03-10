export interface DeliveryMetric {
    id: string;
    zone: string;
    totalOrders: number;
    delivered: number;
    failed: number;
    slaBreached: number;
    avgTime: string;
    performanceScore: number;
}
