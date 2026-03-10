import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

export const weightUpdatesData = [
  {
    id: "WT-001",
    awbNumber: "HJD292412510",
    status: "discrepancy",
    priority: "high",
    shipment: {
      type: "Electronics",
      description: "Mobile Phone",
      dimensions: "25x15x10 cm",
      declaredValue: "₹15,000",
      codAmount: "₹500",
    },
    weights: {
      declared: 5.0, // kg
      initial: 5.0, // kg
      actual: 6.2, // kg
      volumetric: 3.75, // kg (calculated from dimensions)
      charged: 0, // kg - to be determined
    },
    discrepancy: {
      type: "overweight",
      amount: 1.2, // kg
      percentage: 24, // %
      severity: "high",
    },
    charges: {
      declared: "₹120",
      actual: "₹148",
      difference: "₹28",
      extraCharges: "₹28",
    },
    processing: {
      hub: "Kolkata Central Hub",
      processedBy: null,
      processedAt: null,
      verified: false,
      scanned: true,
    },
    timeline: {
      received: "2024-12-11 14:30:00",
      weighed: "2024-12-11 14:45:00",
      lastUpdate: "2024-12-11 14:45:00",
    },
    notes: "Significant weight discrepancy detected",
  },
  {
    id: "WT-002",
    awbNumber: "HJD292412511",
    status: "pending",
    priority: "medium",
    shipment: {
      type: "Documents",
      description: "Legal Contracts",
      dimensions: "30x20x2 cm",
      declaredValue: "₹0",
      codAmount: "-",
    },
    weights: {
      declared: 0.5, // kg
      initial: 0.5, // kg
      actual: null, // kg - not weighed yet
      volumetric: 1.2, // kg
      charged: 0, // kg
    },
    discrepancy: {
      type: "not_weighed",
      amount: 0,
      percentage: 0,
      severity: "low",
    },
    charges: {
      declared: "₹85",
      actual: "₹85",
      difference: "₹0",
      extraCharges: "₹0",
    },
    processing: {
      hub: "Mumbai Central Hub",
      processedBy: null,
      processedAt: null,
      verified: false,
      scanned: true,
    },
    timeline: {
      received: "2024-12-11 13:15:00",
      weighed: null,
      lastUpdate: "2024-12-11 13:15:00",
    },
    notes: "Awaiting weight measurement",
  },
  {
    id: "WT-003",
    awbNumber: "HJD292412512",
    status: "verified",
    priority: "low",
    shipment: {
      type: "Clothing",
      description: "Summer Collection",
      dimensions: "40x30x15 cm",
      declaredValue: "₹8,000",
      codAmount: "₹1,500",
    },
    weights: {
      declared: 3.0, // kg
      initial: 3.0, // kg
      actual: 3.2, // kg
      volumetric: 6.0, // kg
      charged: 3.2, // kg
    },
    discrepancy: {
      type: "minor_overweight",
      amount: 0.2, // kg
      percentage: 6.7, // %
      severity: "low",
    },
    charges: {
      declared: "₹180",
      actual: "₹192",
      difference: "₹12",
      extraCharges: "₹12",
    },
    processing: {
      hub: "Bangalore Central Hub",
      processedBy: "Weight Team A",
      processedAt: "2024-12-11 12:30:00",
      verified: true,
      scanned: true,
    },
    timeline: {
      received: "2024-12-11 11:45:00",
      weighed: "2024-12-11 12:15:00",
      lastUpdate: "2024-12-11 12:30:00",
    },
    notes: "Minor weight variation - charges applied",
  },
  {
    id: "WT-004",
    awbNumber: "HJD292412513",
    status: "discrepancy",
    priority: "critical",
    shipment: {
      type: "Fragile",
      description: "Glass Items",
      dimensions: "50x40x30 cm",
      declaredValue: "₹12,000",
      codAmount: "₹800",
    },
    weights: {
      declared: 8.0, // kg
      initial: 8.0, // kg
      actual: 12.5, // kg
      volumetric: 15.0, // kg
      charged: 0, // kg
    },
    discrepancy: {
      type: "significant_overweight",
      amount: 4.5, // kg
      percentage: 56.3, // %
      severity: "critical",
    },
    charges: {
      declared: "₹250",
      actual: "₹362",
      difference: "₹112",
      extraCharges: "₹112",
    },
    processing: {
      hub: "Kolkata Central Hub",
      processedBy: null,
      processedAt: null,
      verified: false,
      scanned: true,
    },
    timeline: {
      received: "2024-12-11 10:20:00",
      weighed: "2024-12-11 10:35:00",
      lastUpdate: "2024-12-11 10:35:00",
    },
    notes: "Major weight discrepancy - requires supervisor approval",
  },
  {
    id: "WT-005",
    awbNumber: "HJD292412514",
    status: "accurate",
    priority: "low",
    shipment: {
      type: "Documents",
      description: "Academic Certificates",
      dimensions: "35x25x3 cm",
      declaredValue: "₹0",
      codAmount: "-",
    },
    weights: {
      declared: 0.5, // kg
      initial: 0.5, // kg
      actual: 0.5, // kg
      volumetric: 2.6, // kg
      charged: 0.5, // kg
    },
    discrepancy: {
      type: "accurate",
      amount: 0, // kg
      percentage: 0, // %
      severity: "none",
    },
    charges: {
      declared: "₹75",
      actual: "₹75",
      difference: "₹0",
      extraCharges: "₹0",
    },
    processing: {
      hub: "Delhi Central Hub",
      processedBy: "Weight Team B",
      processedAt: "2024-12-11 15:20:00",
      verified: true,
      scanned: true,
    },
    timeline: {
      received: "2024-12-11 15:10:00",
      weighed: "2024-12-11 15:15:00",
      lastUpdate: "2024-12-11 15:20:00",
    },
    notes: "Weight matches declared value",
  },
];

// Mock data for weight statistics
export const weightStats = {
  totalProcessed: 156,
  pendingUpdates: 23,
  discrepanciesFound: 45,
  averageDeviation: 8.2,
  revenueRecovery: 4520,
  accuracyRate: 85.7,
};

export const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
  },
  discrepancy: {
    label: "Discrepancy",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: AlertCircle,
  },
  verified: {
    label: "Verified",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle2,
  },
  accurate: {
    label: "Accurate",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: CheckCircle2,
  },
};

export const priorityConfig = {
  critical: {
    label: "Critical",
    color: "bg-red-100 text-red-800 border-red-200",
  },
  high: {
    label: "High",
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  medium: {
    label: "Medium",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  low: { label: "Low", color: "bg-green-100 text-green-800 border-green-200" },
};

export const discrepancyConfig = {
  none: {
    label: "No Discrepancy",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  minor_overweight: {
    label: "Minor Overweight",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  overweight: {
    label: "Overweight",
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  significant_overweight: {
    label: "Significant Overweight",
    color: "bg-red-100 text-red-800 border-red-200",
  },
  underweight: {
    label: "Underweight",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  not_weighed: {
    label: "Not Weighed",
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },
};

export const severityConfig = {
  none: {
    label: "None",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  low: { label: "Low", color: "bg-blue-100 text-blue-800 border-blue-200" },
  medium: {
    label: "Medium",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  high: {
    label: "High",
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  critical: {
    label: "Critical",
    color: "bg-red-100 text-red-800 border-red-200",
  },
};