import { EWayBill, EWayBillStat } from "./types";
import { Truck, CheckCircle, Clock, TrendingUp } from "lucide-react";

export const ewayBillStats: EWayBillStat[] = [
    {
        title: "Total E-Way Bills",
        value: "1,856",
        change: "+248",
        trend: "up",
        icon: Truck,
        description: "This month"
    },
    {
        title: "Active Bills",
        value: "142",
        change: "+28",
        trend: "up",
        icon: CheckCircle,
        description: "In transit"
    },
    {
        title: "Expiring Soon",
        value: "18",
        change: "-5",
        trend: "down",
        icon: Clock,
        description: "Next 24 hrs"
    },
    {
        title: "Total Distance",
        value: "2.8L km",
        change: "+22%",
        trend: "up",
        icon: TrendingUp,
        description: "This month"
    },
];

export const ewayBills: EWayBill[] = [
    {
        id: "EWB-001",
        ewbNumber: "391234567890",
        invoiceNo: "INV-2024-1245",
        consignor: "BlackGrapes Logistics Hub",
        consignee: "TechCorp Solutions Pvt Ltd",
        vehicleNumber: "MH-12-AB-1234",
        fromLocation: "Mumbai, Maharashtra",
        toLocation: "Pune, Maharashtra",
        distance: 148,
        goodsValue: 285000,
        generatedDate: "2024-12-23T08:30:00",
        validUpto: "2024-12-24T08:30:00",
        status: "active",
        transportMode: "road",
        documentType: "invoice"
    },
    {
        id: "EWB-002",
        ewbNumber: "391234567891",
        invoiceNo: "INV-2024-1246",
        consignor: "BlackGrapes Logistics Hub",
        consignee: "RetailHub India",
        vehicleNumber: "MH-14-CD-5678",
        fromLocation: "Mumbai, Maharashtra",
        toLocation: "Nashik, Maharashtra",
        distance: 165,
        goodsValue: 156000,
        generatedDate: "2024-12-23T10:15:00",
        validUpto: "2024-12-24T10:15:00",
        status: "active",
        transportMode: "road",
        documentType: "invoice"
    },
    {
        id: "EWB-003",
        ewbNumber: "391234567892",
        invoiceNo: "INV-2024-1240",
        consignor: "BlackGrapes Logistics Hub",
        consignee: "FoodMart Chain",
        vehicleNumber: "MH-02-EF-9012",
        fromLocation: "Mumbai, Maharashtra",
        toLocation: "Thane, Maharashtra",
        distance: 32,
        goodsValue: 98000,
        generatedDate: "2024-12-22T14:20:00",
        validUpto: "2024-12-23T14:20:00",
        status: "completed",
        transportMode: "road",
        documentType: "invoice"
    },
    {
        id: "EWB-004",
        ewbNumber: "391234567893",
        invoiceNo: "INV-2024-1247",
        consignor: "BlackGrapes Logistics Hub",
        consignee: "Fashion Trends Pvt Ltd",
        vehicleNumber: "MH-04-GH-3456",
        fromLocation: "Mumbai, Maharashtra",
        toLocation: "Surat, Gujarat",
        distance: 284,
        goodsValue: 425000,
        generatedDate: "2024-12-23T06:00:00",
        validUpto: "2024-12-24T18:00:00",
        status: "active",
        transportMode: "road",
        documentType: "invoice"
    },
    {
        id: "EWB-005",
        ewbNumber: "391234567894",
        invoiceNo: "INV-2024-1235",
        consignor: "BlackGrapes Logistics Hub",
        consignee: "MediCare Pharma",
        vehicleNumber: "MH-01-IJ-7890",
        fromLocation: "Mumbai, Maharashtra",
        toLocation: "Aurangabad, Maharashtra",
        distance: 335,
        goodsValue: 685000,
        generatedDate: "2024-12-20T09:00:00",
        validUpto: "2024-12-21T09:00:00",
        status: "expired",
        transportMode: "road",
        documentType: "invoice"
    },
    {
        id: "EWB-006",
        ewbNumber: "391234567895",
        invoiceNo: "INV-2024-1248",
        consignor: "BlackGrapes Logistics Hub",
        consignee: "Electronics Mart",
        vehicleNumber: "MH-03-KL-2345",
        fromLocation: "Mumbai, Maharashtra",
        toLocation: "Nagpur, Maharashtra",
        distance: 820,
        goodsValue: 1250000,
        generatedDate: "2024-12-23T05:30:00",
        validUpto: "2024-12-25T05:30:00",
        status: "active",
        transportMode: "road",
        documentType: "invoice"
    },
];
