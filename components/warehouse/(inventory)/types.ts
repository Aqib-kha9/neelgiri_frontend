export interface InventoryItem {
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
}

export interface InventoryStat {
    title: string;
    value: string;
    change: string;
    trend: "up" | "down" | "neutral";
    icon: any;
    description: string;
}
