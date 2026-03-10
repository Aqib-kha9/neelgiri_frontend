import { ExceptionTicket } from "./types";

export const mockTickets: ExceptionTicket[] = [
    {
        id: "TKT-2024-001",
        orderId: "ORD-9876",
        type: "Package Damaged",
        status: "new",
        severity: "critical",
        assignee: null,
        slaDeadline: "2024-12-24T14:00:00",
        createdAt: "2024-12-24T10:00:00",
        description: "Customer reported liquid leakage from package upon delivery.",
        logs: [],
        customerTier: "Platinum"
    },
    {
        id: "TKT-2024-002",
        orderId: "ORD-9877",
        type: "Wrong Address",
        status: "investigating",
        severity: "medium",
        assignee: { name: "Sarah J." },
        slaDeadline: "2024-12-25T10:00:00",
        createdAt: "2024-12-23T16:00:00",
        description: "Rider unable to locate address. Coordinates mismatch.",
        logs: [
            { id: "L1", action: "Assigned", user: "System", timestamp: "2024-12-23T16:05:00" },
            { id: "L2", action: "Call Attempt", user: "Sarah J.", timestamp: "2024-12-23T16:30:00", note: "Customer didn't pick up." }
        ],
        customerTier: "Gold"
    },
    {
        id: "TKT-2024-003",
        orderId: "ORD-9878",
        type: "Late Delivery",
        status: "action_required",
        severity: "high",
        assignee: { name: "Mike R." },
        slaDeadline: "2024-12-24T11:00:00",
        createdAt: "2024-12-24T09:00:00",
        description: "Order breached SLA by 45 mins. Customer asking for refund.",
        logs: [],
        customerTier: "Silver"
    },
    {
        id: "TKT-2024-004",
        orderId: "ORD-9879",
        type: "Customer Refused",
        status: "resolved",
        severity: "low",
        assignee: { name: "Sarah J." },
        slaDeadline: "2024-12-23T18:00:00",
        createdAt: "2024-12-23T12:00:00",
        description: "Customer cancelled at doorstep.",
        logs: [],
        customerTier: "Standard"
    },
    {
        id: "TKT-2024-005",
        orderId: "ORD-9880",
        type: "Missing Item",
        status: "new",
        severity: "high",
        assignee: null,
        slaDeadline: "2024-12-24T16:00:00",
        createdAt: "2024-12-24T11:00:00",
        description: "Items missing from grocery order.",
        logs: [],
        customerTier: "Gold"
    }
];
