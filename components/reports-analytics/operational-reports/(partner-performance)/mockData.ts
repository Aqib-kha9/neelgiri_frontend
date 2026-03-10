import { PartnerMetric } from "./types";

export const mockPartnerMetrics: PartnerMetric[] = [
    { id: "PM-1", partnerName: "Fast Logistics", totalOrders: 500, deliverySuccessRate: 98, avgPickupTime: "15m", rating: 4.8, status: "active", location: "North Zone" },
    { id: "PM-2", partnerName: "QuickReach", totalOrders: 350, deliverySuccessRate: 92, avgPickupTime: "20m", rating: 4.2, status: "active", location: "South Zone" },
    { id: "PM-3", partnerName: "Reliable Couriers", totalOrders: 120, deliverySuccessRate: 85, avgPickupTime: "25m", rating: 3.9, status: "suspended", location: "East Zone" },
    { id: "PM-4", partnerName: "City Zoom", totalOrders: 600, deliverySuccessRate: 99, avgPickupTime: "12m", rating: 4.9, status: "active", location: "West Zone" },
];
