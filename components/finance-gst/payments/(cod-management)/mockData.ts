import { CODRecord, CODStats } from "./types";

export const mockCODStats: CODStats = {
    totalCODCollected: 1250000,
    totalDeposited: 980000,
    totalPending: 270000,
    activeRidersWithCash: 15
};

export const mockCODRecords: CODRecord[] = [
    {
        id: "COD-001",
        riderName: "Rahul Kumar",
        riderId: "R-101",
        totalCODCollected: 25000,
        depositedAmount: 20000,
        pendingAmount: 5000,
        lastDepositDate: "2024-12-23",
        status: "partially_deposited",
        branch: "Main Branch"
    },
    {
        id: "COD-002",
        riderName: "Amit Singh",
        riderId: "R-102",
        totalCODCollected: 45000,
        depositedAmount: 45000,
        pendingAmount: 0,
        lastDepositDate: "2024-12-24",
        status: "fully_deposited",
        branch: "North Hub"
    },
    {
        id: "COD-003",
        riderName: "Vikram Malhotra",
        riderId: "R-105",
        totalCODCollected: 18000,
        depositedAmount: 0,
        pendingAmount: 18000,
        lastDepositDate: "2024-12-20",
        status: "pending",
        branch: "Main Branch"
    },
    {
        id: "COD-004",
        riderName: "Suresh Raina",
        riderId: "R-108",
        totalCODCollected: 32000,
        depositedAmount: 15000,
        pendingAmount: 17000,
        lastDepositDate: "2024-12-22",
        status: "partially_deposited",
        branch: "West Zone"
    },
    {
        id: "COD-005",
        riderName: "Deepak Chahar",
        riderId: "R-110",
        totalCODCollected: 55000,
        depositedAmount: 55000,
        pendingAmount: 0,
        lastDepositDate: "2024-12-24",
        status: "fully_deposited",
        branch: "North Hub"
    },
];
