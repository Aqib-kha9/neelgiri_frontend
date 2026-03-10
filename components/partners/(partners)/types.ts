export interface Partner {
    id: string;
    name: string;
    partnerId: string;
    type: "restaurant" | "grocery" | "pharmacy" | "retail";
    location: string;
    city: string;
    status: "active" | "inactive" | "pending";
    performanceScore: number;
    totalRevenue: number;
    monthlyRevenue: number;
    joinDate: string;
    contactPerson: string;
    phone: string;
    email: string;
    deliveryRadius: number;
    avgRating: number;
}

export interface PartnerStat {
    title: string;
    value: string;
    change: string;
    trend: "up" | "down" | "neutral";
    icon: any;
    description: string;
}
