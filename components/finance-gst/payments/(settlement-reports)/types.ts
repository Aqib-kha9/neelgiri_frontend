export interface SettlementRecord {
    id: string;
    partnerName: string;
    partnerTechId: string;
    type: 'vendor' | 'rider' | 'partner';
    amount: number;
    period: string;
    status: 'settled' | 'processing' | 'hold' | 'pending';
    processedDate: string;
    transactionRef: string;
}

export interface SettlementStats {
    totalSettled: number;
    pendingSettlement: number;
    nextPayoutDate: string;
    processedThisMonth: number;
}
