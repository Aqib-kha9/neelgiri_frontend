import { Clock, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

export const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
  },
  in_progress: {
    label: "In Progress",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: RefreshCw,
  },
  resolved: {
    label: "Resolved",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle2,
  },
  escalated: {
    label: "Escalated",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: AlertCircle,
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

export const riskConfig = {
  critical: {
    label: "Critical Risk",
    color: "bg-red-100 text-red-800 border-red-200",
  },
  high: {
    label: "High Risk",
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  medium: {
    label: "Medium Risk",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  low: {
    label: "Low Risk",
    color: "bg-green-100 text-green-800 border-green-200",
  },
};

export const investigationConfig = {
  not_started: {
    label: "Not Started",
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },
  contact_attempted: {
    label: "Contact Attempted",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  under_investigation: {
    label: "Under Investigation",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  resolved: {
    label: "Resolved",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  escalated: {
    label: "Escalated",
    color: "bg-red-100 text-red-800 border-red-200",
  },
};
