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

export const mapBackendPartner = (p: any): Partner => {
    const statusMap: Record<string, Partner["status"]> = {
        ACTIVE: "active",
        PENDING: "pending",
        SUSPENDED: "inactive",
        TERMINATED: "inactive",
    };
    return {
        id: p._id || p.id || "",
        name: p.companyName || p.name || "Unknown Partner",
        partnerId: p.partnerCode || p.partnerId || "N/A",
        type: p.type || "retail",
        location: p.address?.line1 || p.location || "",
        city: p.address?.city || p.city || "",
        status: statusMap[p.status] || (p.status?.toLowerCase() as Partner["status"]) || "pending",
        performanceScore: p.performanceScore ?? p.metrics?.rating ? Math.round(p.metrics.rating * 20) : 0,
        totalRevenue: p.totalRevenue ?? p.metrics?.totalRevenue ?? 0,
        monthlyRevenue: p.monthlyRevenue ?? 0,
        joinDate: p.joinDate || p.createdAt || new Date().toISOString(),
        contactPerson: p.contactPerson || "—",
        phone: p.phone || "—",
        email: p.email || "—",
        deliveryRadius: p.deliveryRadius ?? 0,
        avgRating: p.avgRating ?? p.metrics?.rating ?? 0,
    };
};
