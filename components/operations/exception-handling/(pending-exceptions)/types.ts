export interface PendingException {
    id: string;
    orderId: string;
    type: "address_issue" | "customer_unavailable" | "refused" | "damaged" | "other";
    severity: "high" | "medium" | "low";
    reportedAt: string;
    status: "pending";
    assignedTo: string | null;
    description: string;
}
