export interface PricingZone {
    name: "Intra-City" | "Intra-State" | "Metro-Metro" | "National" | "North East/J&K";
    baseRate: number; // For first 0.5 kg
    additionalRate: number; // Per additional 0.5 kg
}

export const PRICING_CONFIG = {
    volumetricDivisor: 5000,
    fuelSurchargePercent: 0.30, // 30%
    docketCharge: 50,
    gstPercent: 0.18,
    insurancePercent: 0.002, // 0.2%
    minInsurance: 50,
    codChargePercent: 0.02, // 2%
    minCodCharge: 50,
};

export const ZONES: Record<string, PricingZone> = {
    intra_city: {
        name: "Intra-City",
        baseRate: 40,
        additionalRate: 30,
    },
    intra_state: {
        name: "Intra-State",
        baseRate: 60,
        additionalRate: 45,
    },
    default: {
        name: "National",
        baseRate: 80,
        additionalRate: 65,
    },
};

export const calculateZone = (pincode1: string, pincode2: string): PricingZone => {
    // Mock Logic for Zones
    const p1 = pincode1.trim().substring(0, 3);
    const p2 = pincode2.trim().substring(0, 3);
    const s1 = pincode1.trim().substring(0, 2);
    const s2 = pincode2.trim().substring(0, 2);

    if (p1 === p2) return ZONES.intra_city; // Same District/City approximation
    if (s1 === s2) return ZONES.intra_state; // Same State approximation
    return ZONES.default; // National
};
