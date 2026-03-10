export interface SettlementData {
    id: string;
    partnerName: string;
    date: string;
    amount: number;
    status: "Settled" | "Processing" | "Failed";
    transactionId: string;
    method: "Bank Transfer" | "UPI";
}
