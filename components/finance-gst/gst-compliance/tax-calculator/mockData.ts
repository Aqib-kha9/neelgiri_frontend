import { TaxCalculation, TaxCalculatorStat, GSTRate } from "./types";
import { Calculator, TrendingUp, Percent, IndianRupee } from "lucide-react";

export const taxCalculatorStats: TaxCalculatorStat[] = [
    {
        title: "Calculations Today",
        value: "48",
        change: "+12",
        trend: "up",
        icon: Calculator,
        description: "Last 24 hours"
    },
    {
        title: "Avg GST Rate",
        value: "18%",
        change: "0%",
        trend: "up",
        icon: Percent,
        description: "Most used"
    },
    {
        title: "Total Calculated",
        value: "₹28.5L",
        change: "+24%",
        trend: "up",
        icon: IndianRupee,
        description: "This month"
    },
    {
        title: "Tax Amount",
        value: "₹5.13L",
        change: "+24%",
        trend: "up",
        icon: TrendingUp,
        description: "This month"
    },
];

export const gstRates: GSTRate[] = [
    { rate: 0, label: "0% GST", description: "Exempt goods/services" },
    { rate: 0.25, label: "0.25% GST", description: "Precious stones" },
    { rate: 3, label: "3% GST", description: "Gold, silver" },
    { rate: 5, label: "5% GST", description: "Essential goods" },
    { rate: 12, label: "12% GST", description: "Standard goods" },
    { rate: 18, label: "18% GST", description: "Most services" },
    { rate: 28, label: "28% GST", description: "Luxury items" },
];

export const recentCalculations: TaxCalculation[] = [
    {
        id: "CALC-001",
        calculationType: "exclusive",
        baseAmount: 125000,
        gstRate: 18,
        cgst: 11250,
        sgst: 11250,
        igst: 0,
        totalAmount: 147500,
        calculatedDate: "2024-12-23T14:30:00",
        description: "Delivery service charges"
    },
    {
        id: "CALC-002",
        calculationType: "inclusive",
        baseAmount: 147500,
        gstRate: 18,
        cgst: 11250,
        sgst: 11250,
        igst: 0,
        totalAmount: 147500,
        calculatedDate: "2024-12-23T13:15:00",
        description: "Logistics fees"
    },
    {
        id: "CALC-003",
        calculationType: "exclusive",
        baseAmount: 85000,
        gstRate: 12,
        cgst: 5100,
        sgst: 5100,
        igst: 0,
        totalAmount: 95200,
        calculatedDate: "2024-12-23T11:45:00",
        description: "Warehouse charges"
    },
    {
        id: "CALC-004",
        calculationType: "exclusive",
        baseAmount: 250000,
        gstRate: 18,
        cgst: 22500,
        sgst: 22500,
        igst: 0,
        totalAmount: 295000,
        calculatedDate: "2024-12-23T10:20:00",
        description: "Transportation services"
    },
    {
        id: "CALC-005",
        calculationType: "inclusive",
        baseAmount: 118000,
        gstRate: 18,
        cgst: 9000,
        sgst: 9000,
        igst: 0,
        totalAmount: 118000,
        calculatedDate: "2024-12-23T09:00:00",
        description: "Packaging materials"
    },
];
