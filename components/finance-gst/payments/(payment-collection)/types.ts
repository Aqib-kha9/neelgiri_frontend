export interface PaymentCollection {
    id: string;
    transactionId: string;
    customerName: string;
    amount: number;
    paymentMode: 'UPI' | 'Cash' | 'Bank Transfer' | 'Cheque';
    status: 'received' | 'pending' | 'failed' | 'processing';
    date: string;
    collectedBy: string;
    referenceNo?: string;
}

export interface PaymentStats {
    totalCollection: number;
    pendingAmount: number;
    todayCollection: number;
    failedTransactions: number;
}
