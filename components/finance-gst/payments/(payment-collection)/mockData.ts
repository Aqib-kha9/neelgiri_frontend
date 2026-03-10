import { PaymentCollection, PaymentStats } from "./types";

export const mockPaymentStats: PaymentStats = {
    totalCollection: 4500000,
    pendingAmount: 250000,
    todayCollection: 150000,
    failedTransactions: 12
};

export const mockPaymentCollections: PaymentCollection[] = [
    {
        id: "PAY-001",
        transactionId: "TXN123456789",
        customerName: "TechCorp Solutions",
        amount: 25000,
        paymentMode: "Bank Transfer",
        status: "received",
        date: "2024-12-24T10:30:00",
        collectedBy: "Admin",
        referenceNo: "REF-001"
    },
    {
        id: "PAY-002",
        transactionId: "TXN987654321",
        customerName: "RetailHub India",
        amount: 15000,
        paymentMode: "UPI",
        status: "received",
        date: "2024-12-24T11:00:00",
        collectedBy: "Rider John",
        referenceNo: "REF-002"
    },
    {
        id: "PAY-003",
        transactionId: "TXN456123789",
        customerName: "FoodMart Chain",
        amount: 50000,
        paymentMode: "Cheque",
        status: "processing",
        date: "2024-12-23T15:45:00",
        collectedBy: "Admin",
        referenceNo: "CHQ-8899"
    },
    {
        id: "PAY-004",
        transactionId: "TXN789123456",
        customerName: "Fashion Trends",
        amount: 8500,
        paymentMode: "Cash",
        status: "pending",
        date: "2024-12-23T09:30:00",
        collectedBy: "Rider Mike",
    },
    {
        id: "PAY-005",
        transactionId: "TXN321654987",
        customerName: "MediCare Pharma",
        amount: 12000,
        paymentMode: "UPI",
        status: "failed",
        date: "2024-12-22T14:20:00",
        collectedBy: "System",
        referenceNo: "REF-005"
    }
];
