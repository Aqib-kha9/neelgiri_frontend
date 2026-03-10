export interface TaxCalculation {
    id: string;
    calculationType: "inclusive" | "exclusive";
    baseAmount: number;
    gstRate: number;
    cgst: number;
    sgst: number;
    igst: number;
    totalAmount: number;
    calculatedDate: string;
    description?: string;
}

export interface TaxCalculatorStat {
    title: string;
    value: string;
    change: string;
    trend: "up" | "down";
    icon: any;
    description: string;
}

export interface GSTRate {
    rate: number;
    label: string;
    description: string;
}
