export interface ReconciliationRecord {
    id: string;
    itemName: string;
    sku: string;
    category: string;
    expectedQty: number;
    actualQty: number;
    variance: number;
    variancePercent: number;
    status: "pending" | "in-progress" | "resolved" | "discrepancy";
    reconciledBy: string;
    reconciledDate: string;
    location: string;
    notes: string;
}

export interface ReconciliationStat {
    title: string;
    value: string;
    change: string;
    trend: "up" | "down" | "neutral";
    icon: any;
    description: string;
}
