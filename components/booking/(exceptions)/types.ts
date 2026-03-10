export interface ShipmentPerson {
  name: string;
  phone: string;
  city: string;
  pincode: string;
  address?: string;
}

export interface ShipmentPackage {
  type: string;
  weight: string;
  description: string;
  codAmount: string;
}

export interface ShipmentService {
  type: string;
  payment: string;
}

export interface Shipment {
  sender: ShipmentPerson;
  receiver: ShipmentPerson;
  package: ShipmentPackage;
  service: ShipmentService;
}

export interface ExceptionDetails {
  attempts?: number;
  lastAttempt?: string;
  rider?: string;
  notes?: string;
  location?: {
    latitude: string;
    longitude: string;
    address: string;
  };
  damageType?: string;
  damageLocation?: string;
  reportedBy?: string;
  reportedAt?: string;
  evidence?: string[];
  addressIssue?: string;
  currentStatus?: string;
  contactAttempts?: number;
  lastContact?: string;
  holdLocation?: string;
  requiredDocs?: string[];
  missingDocs?: string[];
  clearanceAgent?: string;
  expectedDelay?: string;
  issue?: string;
  claimedAmount?: string;
  actualAmount?: string;
  resolution?: string;
  resolvedBy?: string;
  resolvedAt?: string;
}

export interface Resolution {
  required: boolean;
  assignedTo: string;
  deadline: string;
  actions: string[];
}

export interface FinancialImpact {
  codAmount?: string;
  additionalCharges?: string;
  totalImpact: string;
  declaredValue?: string;
  estimatedClaim?: string;
  storageCharges?: string;
  estimatedDelay?: string;
  customsDuty?: string;
  agentFees?: string;
  originalAmount?: string;
  settledAmount?: string;
  difference?: string;
}

export interface Exception {
  id: string;
  awbNumber: string;
  type: string;
  severity: string;
  status: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  priority: string;
  shipment: Shipment;
  details: ExceptionDetails;
  resolution: Resolution;
  financialImpact: FinancialImpact;
}

export type ExceptionType =
  | "delivery_failed"
  | "damage_reported"
  | "address_issue"
  | "customs_hold"
  | "payment_issue"
  | "lost_package";
export type SeverityType = "critical" | "high" | "medium" | "low";
export type StatusType = "open" | "in_progress" | "resolved" | "closed";
export type PriorityType = "urgent" | "critical" | "high" | "medium" | "low";
