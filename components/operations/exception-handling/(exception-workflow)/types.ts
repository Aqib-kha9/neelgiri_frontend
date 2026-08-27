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

// Backend status → Frontend workflow status
const STATUS_MAP: Record<string, WorkflowStatus> = {
    OPEN: "new",
    INVESTIGATING: "investigating",
    ESCALATED: "action_required",
    RESOLVED: "resolved",
    CLOSED: "resolved",
};

// Frontend workflow status → Backend status
export const STATUS_REVERSE_MAP: Record<WorkflowStatus, string> = {
    new: "OPEN",
    investigating: "INVESTIGATING",
    action_required: "ESCALATED",
    resolved: "RESOLVED",
    monitoring: "RESOLVED",
};

const SEVERITY_MAP: Record<string, Severity> = {
    CRITICAL: "critical",
    HIGH: "high",
    MEDIUM: "medium",
    LOW: "low",
};

const TYPE_LABEL_MAP: Record<string, string> = {
    DAMAGED: "Damaged Goods",
    LOST: "Lost Shipment",
    PILFERAGE: "Pilferage",
    SHORT_DELIVERY: "Short Delivery",
    WRONG_DELIVERY: "Wrong Delivery",
    ADDRESS_ISSUE: "Address Issue",
    WEIGHT_DISCREPANCY: "Weight Discrepancy",
    PAYMENT_ISSUE: "Payment Issue",
    DELAY: "Late Delivery",
    REFUSED: "Refused Delivery",
    OTHER: "Other Issue",
};

export const mapBackendException = (e: any): ExceptionTicket => {
    const logs: WorkflowLog[] = (e.actions || []).map((a: any, i: number) => ({
        id: a._id || `log-${i}`,
        action: a.action || "",
        user: a.performedBy?.name || a.performedBy?.email || "System",
        timestamp: a.performedAt || "",
        note: a.remarks,
    }));

    return {
        id: e.exceptionId || e._id || "",
        orderId: e.awb || e.shipmentId?.awb || e.shipmentId?._id || "—",
        type: TYPE_LABEL_MAP[e.type] || e.type || "Other Issue",
        status: STATUS_MAP[e.status] || "new",
        severity: SEVERITY_MAP[e.severity] || "medium",
        assignee: e.escalatedTo
            ? { name: e.escalatedTo.name || e.escalatedTo.email || "Agent" }
            : e.resolvedBy
            ? { name: e.resolvedBy.name || e.resolvedBy.email || "Agent" }
            : null,
        slaDeadline: e.createdAt || new Date().toISOString(),
        createdAt: e.createdAt || "",
        description: e.description || e.title || "",
        logs,
        customerTier: "Standard",
    };
};
