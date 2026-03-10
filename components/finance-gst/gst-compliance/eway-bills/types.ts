export interface EWayBill {
    id: string;
    ewbNumber: string;
    invoiceNo: string;
    consignor: string;
    consignee: string;
    vehicleNumber: string;
    fromLocation: string;
    toLocation: string;
    distance: number; // in km
    goodsValue: number;
    generatedDate: string;
    validUpto: string;
    status: "active" | "expired" | "cancelled" | "completed";
    transportMode: "road" | "rail" | "air" | "ship";
    documentType: "invoice" | "challan" | "bill";
}

export interface EWayBillStat {
    title: string;
    value: string;
    change: string;
    trend: "up" | "down";
    icon: any;
    description: string;
}
