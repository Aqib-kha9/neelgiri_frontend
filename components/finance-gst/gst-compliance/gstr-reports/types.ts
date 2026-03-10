export interface GSTRReport {
    id: string;
    reportType: "GSTR-1" | "GSTR-3B" | "GSTR-9" | "GSTR-9C";
    period: string;
    financialYear: string;
    filingDate: string | null;
    dueDate: string;
    status: "filed" | "pending" | "overdue" | "revised";
    taxableAmount: number;
    cgst: number;
    sgst: number;
    igst: number;
    totalTax: number;
    arn: string | null; // Acknowledgement Reference Number
}

export interface GSTRStat {
    title: string;
    value: string;
    change: string;
    trend: "up" | "down";
    icon: any;
    description: string;
}
