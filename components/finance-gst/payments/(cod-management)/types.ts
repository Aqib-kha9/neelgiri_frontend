export interface CODRecord {
    id: string;
    riderName: string;
    riderId: string;
    totalCODCollected: number;
    depositedAmount: number;
    pendingAmount: number;
    lastDepositDate: string;
    status: 'fully_deposited' | 'partially_deposited' | 'pending';
    branch: string;
}

export interface CODStats {
    totalCODCollected: number;
    totalDeposited: number;
    totalPending: number;
    activeRidersWithCash: number;
}
