export interface TallySyncLog {
    id: string;
    type: 'invoice' | 'payment' | 'credit_note' | 'ledger' | 'stock';
    status: 'success' | 'failed' | 'processing';
    recordsSynced: number;
    timestamp: string;
    details: string;
    user: string;
}

export interface TallyConfig {
    connectionStatus: 'connected' | 'disconnected' | 'error';
    lastSyncTime: string;
    companyName: string;
    tallyVersion: string;
    autoSync: boolean;
}
