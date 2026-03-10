export interface PartnerMetric {
    id: string;
    partnerName: string;
    totalOrders: number;
    deliverySuccessRate: number;
    avgPickupTime: string;
    rating: number;
    status: "active" | "inactive" | "suspended";
    location: string;
}
