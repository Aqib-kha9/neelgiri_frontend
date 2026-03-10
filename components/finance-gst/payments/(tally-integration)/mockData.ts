import { TallyConfig, TallySyncLog } from "./types";

export const mockTallyConfig: TallyConfig = {
    connectionStatus: "connected",
    lastSyncTime: "2024-12-24T09:30:00",
    companyName: "BlackGrapes Logistics Pvt Ltd",
    tallyVersion: "Tally Prime 3.0",
    autoSync: true
};

export const mockSyncLogs: TallySyncLog[] = [
    {
        id: "SYNC-001",
        type: "invoice",
        status: "success",
        recordsSynced: 125,
        timestamp: "2024-12-24T09:30:00",
        details: "Daily invoice sync completed successfully",
        user: "System (Auto)"
    },
    {
        id: "SYNC-002",
        type: "payment",
        status: "success",
        recordsSynced: 45,
        timestamp: "2024-12-24T09:35:00",
        details: "Payment receipts synced",
        user: "System (Auto)"
    },
    {
        id: "SYNC-003",
        type: "stock",
        status: "failed",
        recordsSynced: 0,
        timestamp: "2024-12-24T08:00:00",
        details: "Connection timeout while syncing stock",
        user: "Admin"
    },
    {
        id: "SYNC-004",
        type: "ledger",
        status: "success",
        recordsSynced: 12,
        timestamp: "2024-12-23T20:00:00",
        details: "New customer ledgers created",
        user: "Accountant"
    },
    {
        id: "SYNC-005",
        type: "credit_note",
        status: "processing",
        recordsSynced: 0,
        timestamp: "2024-12-24T10:00:00",
        details: "Sync in progress...",
        user: "Admin"
    }
];
