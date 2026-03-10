import { PendingException } from "./types";

export const mockPendingExceptions: PendingException[] = [
    {
        id: "EX-001",
        orderId: "ORD-9988",
        type: "address_issue",
        severity: "high",
        reportedAt: "2024-12-24 10:30 AM",
        status: "pending",
        assignedTo: null,
        description: "Invalid pin code provided, rider unable to locate.",
    },
    {
        id: "EX-002",
        orderId: "ORD-7766",
        type: "customer_unavailable",
        severity: "medium",
        reportedAt: "2024-12-24 09:15 AM",
        status: "pending",
        assignedTo: "Support Agent A",
        description: "Customer not picking up calls (3 attempts).",
    },
    {
        id: "EX-003",
        orderId: "ORD-5544",
        type: "refused",
        severity: "high",
        reportedAt: "2024-12-24 11:00 AM",
        status: "pending",
        assignedTo: null,
        description: "Customer refused delivery, package looks tampered.",
    },
    {
        id: "EX-004",
        orderId: "ORD-3322",
        type: "other",
        severity: "low",
        reportedAt: "2024-12-24 08:45 AM",
        status: "pending",
        assignedTo: null,
        description: "Rider bike breakdown, need reallocation.",
    },
];
