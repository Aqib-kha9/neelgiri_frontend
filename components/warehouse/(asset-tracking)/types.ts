export interface Asset {
    id: string;
    name: string;
    assetId: string;
    category: string;
    location: string;
    condition: "excellent" | "good" | "fair" | "poor";
    purchaseDate: string;
    purchaseValue: number;
    currentValue: number;
    status: "active" | "maintenance" | "retired";
    assignedTo: string;
    lastMaintenance: string;
    nextMaintenance: string;
}

export interface AssetStat {
    title: string;
    value: string;
    change: string;
    trend: "up" | "down" | "neutral";
    icon: any;
    description: string;
}
