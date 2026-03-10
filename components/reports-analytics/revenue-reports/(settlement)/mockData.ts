import { SettlementData } from "./types";

export const mockSettlements: SettlementData[] = [
    { id: "SET-1", partnerName: "Fast Logistics", date: "2024-12-23", amount: 45000, status: "Settled", transactionId: "TXN123456", method: "Bank Transfer" },
    { id: "SET-2", partnerName: "QuickReach", date: "2024-12-24", amount: 32000, status: "Processing", transactionId: "TXN123457", method: "UPI" },
    { id: "SET-3", partnerName: "City Zoom", date: "2024-12-22", amount: 58000, status: "Settled", transactionId: "TXN123458", method: "Bank Transfer" },
    { id: "SET-4", partnerName: "Reliable Couriers", date: "2024-12-20", amount: 15000, status: "Failed", transactionId: "TXN123459", method: "UPI" },
];
