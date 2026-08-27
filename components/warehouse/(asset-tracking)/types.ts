export interface Asset {
    _id?: string;
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
    // Backend fields
    assetCode?: string;
    type?: string;
    description?: string;
    purchasePrice?: number;
    vendor?: string;
    warrantyExpiry?: string;
    depreciationRate?: number;
    warehouseId?: string;
    warehouseName?: string;
    assignedToName?: string;
    assignedAt?: string;
}

export interface AssetStatsResponse {
    total: number;
    active: number;
    assigned: number;
    maintenance: number;
    retired: number;
    lost: number;
    totalPurchaseValue: number;
    totalCurrentValue: number;
}

export interface AssetStat {
    title: string;
    value: string;
    change: string;
    trend: "up" | "down" | "neutral";
    icon: any;
    description: string;
}
