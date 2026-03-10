export type WorkflowStatus = "new" | "investigating" | "action_required" | "resolved" | "monitoring";
export type Severity = "critical" | "high" | "medium" | "low";

export interface WorkflowLog {
    id: string;
    action: string;
    user: string;
    timestamp: string;
    note?: string;
}

export interface ExceptionTicket {
    id: string;
    orderId: string;
    type: string; // e.g., "Damaged Goods", "Late Delivery", "Wrong Address"
    status: WorkflowStatus;
    severity: Severity;
    assignee: {
        name: string;
        avatar?: string;
    } | null;
    slaDeadline: string; // ISO date
    createdAt: string;
    description: string;
    logs: WorkflowLog[];
    customerTier: "Platinum" | "Gold" | "Silver" | "Standard";
}
