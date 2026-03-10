import { DeliveryMetric } from "./types";

export const mockDeliveryMetrics: DeliveryMetric[] = [
    { id: "DM-1", zone: "North Delhi", totalOrders: 1250, delivered: 1200, failed: 20, slaBreached: 30, avgTime: "24m", performanceScore: 96 },
    { id: "DM-2", zone: "South Delhi", totalOrders: 1500, delivered: 1450, failed: 10, slaBreached: 40, avgTime: "28m", performanceScore: 97 },
    { id: "DM-3", zone: "West Delhi", totalOrders: 900, delivered: 850, failed: 30, slaBreached: 20, avgTime: "30m", performanceScore: 94 },
    { id: "DM-4", zone: "East Delhi", totalOrders: 1100, delivered: 1000, failed: 50, slaBreached: 50, avgTime: "35m", performanceScore: 90 },
];
