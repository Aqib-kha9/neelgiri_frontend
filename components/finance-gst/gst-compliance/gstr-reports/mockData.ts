import { GSTRReport, GSTRStat } from "./types";
import { FileText, CheckCircle, Clock, TrendingUp } from "lucide-react";

export const gstrStats: GSTRStat[] = [
    {
        title: "Total Returns Filed",
        value: "36",
        change: "+3",
        trend: "up",
        icon: FileText,
        description: "This year"
    },
    {
        title: "On-Time Filings",
        value: "34",
        change: "+2",
        trend: "up",
        icon: CheckCircle,
        description: "94.4% rate"
    },
    {
        title: "Pending Returns",
        value: "2",
        change: "-1",
        trend: "down",
        icon: Clock,
        description: "To be filed"
    },
    {
        title: "Total Tax Paid",
        value: "₹42.8L",
        change: "+18%",
        trend: "up",
        icon: TrendingUp,
        description: "FY 2024-25"
    },
];

export const gstrReports: GSTRReport[] = [
    {
        id: "GSTR-001",
        reportType: "GSTR-1",
        period: "November 2024",
        financialYear: "2024-25",
        filingDate: "2024-12-10",
        dueDate: "2024-12-11",
        status: "filed",
        taxableAmount: 2850000,
        cgst: 256500,
        sgst: 256500,
        igst: 0,
        totalTax: 513000,
        arn: "AA2411241234567"
    },
    {
        id: "GSTR-002",
        reportType: "GSTR-3B",
        period: "November 2024",
        financialYear: "2024-25",
        filingDate: "2024-12-18",
        dueDate: "2024-12-20",
        status: "filed",
        taxableAmount: 2850000,
        cgst: 256500,
        sgst: 256500,
        igst: 0,
        totalTax: 513000,
        arn: "AB2411241234568"
    },
    {
        id: "GSTR-003",
        reportType: "GSTR-1",
        period: "December 2024",
        financialYear: "2024-25",
        filingDate: null,
        dueDate: "2025-01-11",
        status: "pending",
        taxableAmount: 3125000,
        cgst: 281250,
        sgst: 281250,
        igst: 0,
        totalTax: 562500,
        arn: null
    },
    {
        id: "GSTR-004",
        reportType: "GSTR-3B",
        period: "December 2024",
        financialYear: "2024-25",
        filingDate: null,
        dueDate: "2025-01-20",
        status: "pending",
        taxableAmount: 3125000,
        cgst: 281250,
        sgst: 281250,
        igst: 0,
        totalTax: 562500,
        arn: null
    },
    {
        id: "GSTR-005",
        reportType: "GSTR-1",
        period: "October 2024",
        financialYear: "2024-25",
        filingDate: "2024-11-09",
        dueDate: "2024-11-11",
        status: "filed",
        taxableAmount: 2650000,
        cgst: 238500,
        sgst: 238500,
        igst: 0,
        totalTax: 477000,
        arn: "AA2410241234565"
    },
    {
        id: "GSTR-006",
        reportType: "GSTR-9",
        period: "Annual Return",
        financialYear: "2023-24",
        filingDate: "2024-12-15",
        dueDate: "2024-12-31",
        status: "filed",
        taxableAmount: 32500000,
        cgst: 2925000,
        sgst: 2925000,
        igst: 0,
        totalTax: 5850000,
        arn: "AA2312241234560"
    },
];
