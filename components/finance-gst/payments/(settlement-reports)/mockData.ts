import { SettlementRecord, SettlementStats } from "./types";

export const mockSettlementStats: SettlementStats = {
    totalSettled: 4500000,
    pendingSettlement: 350000,
    nextPayoutDate: "2024-12-28",
    processedThisMonth: 124,
};

export const mockSettlementRecords: SettlementRecord[] = [
    {
        id: "SET-001",
        partnerName: "Fast Logistics Pvt Ltd",
        partnerTechId: "V-201",
        type: "vendor",
        amount: 150000,
        period: "Dec 1 - Dec 15",
        status: "settled",
        processedDate: "2024-12-18",
        transactionRef: "UTR123456"
    },
    {
        id: "SET-002",
        partnerName: "Rahul Kumar",
        partnerTechId: "R-101",
        type: "rider",
        amount: 12000,
        period: "Dec 1 - Dec 15",
        status: "processing",
        processedDate: "2024-12-24",
        transactionRef: "PENDING"
    },
    {
        id: "SET-003",
        partnerName: "Green Way Courier",
        partnerTechId: "P-304",
        type: "partner",
        amount: 85000,
        period: "Dec 1 - Dec 15",
        status: "hold",
        processedDate: "-",
        transactionRef: "-"
    },
    {
        id: "SET-004",
        partnerName: "Amit Singh",
        partnerTechId: "R-102",
        type: "rider",
        amount: 9500,
        period: "Dec 1 - Dec 15",
        status: "settled",
        processedDate: "2024-12-18",
        transactionRef: "UTR789012"
    },
    {
        id: "SET-005",
        partnerName: "City Services",
        partnerTechId: "V-205",
        type: "vendor",
        amount: 42000,
        period: "Dec 15 - Dec 21",
        status: "pending",
        processedDate: "-",
        transactionRef: "-"
    }
];
