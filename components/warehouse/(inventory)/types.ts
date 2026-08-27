export interface InventoryItem {
    _id?: string;
    id: string;
    name: string;
    sku: string;
    category: string;
    currentStock: number;
    minStock: number;
    maxStock: number;
    unitPrice: number;
    totalValue: number;
    status: "in-stock" | "low-stock" | "out-of-stock";
    lastUpdated: string;
    supplier: string;
    location: string;
    // Backend fields
    skuCode?: string;
    quantity?: number;
    reorderLevel?: number;
    maxLevel?: number;
    unit?: string;
    unitCost?: number;
    warehouseId?: string;
    warehouseName?: string;
    storageLocation?: string;
    description?: string;
}

export interface InventoryStatsResponse {
    total: number;
    inStock: number;
    lowStock: number;
    outOfStock: number;
    discontinued: number;
    totalValue: number;
}

export interface InventoryStat {
    title: string;
    value: string;
    change: string;
    trend: "up" | "down" | "neutral";
    icon: any;
    description: string;
}
