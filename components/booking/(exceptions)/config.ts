import {
  XCircle,
  AlertTriangle,
  MapPin,
  Shield,
  IndianRupee,
  Package,
  AlertCircle,
  Clock,
  CheckCircle2,
  Ban,
} from "lucide-react";

export const exceptionTypeConfig = {
  delivery_failed: {
    label: "Delivery Failed",
    color: "bg-red-50 text-red-700 border-red-200",
    icon: XCircle,
  },
  damage_reported: {
    label: "Damage Reported",
    color: "bg-orange-50 text-orange-700 border-orange-200",
    icon: AlertTriangle,
  },
  address_issue: {
    label: "Address Issue",
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    icon: MapPin,
  },
  customs_hold: {
    label: "Customs Hold",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    icon: Shield,
  },
  payment_issue: {
    label: "Payment Issue",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: IndianRupee,
  },
  lost_package: {
    label: "Lost Package",
    color: "bg-gray-50 text-gray-700 border-gray-200",
    icon: Package,
  },
};

export const severityConfig = {
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
  low: { label: "Low", color: "bg-blue-100 text-blue-800 border-blue-200" },
};

export const statusConfig = {
  open: {
    label: "Open",
    color: "bg-red-50 text-red-700 border-red-200",
    icon: AlertCircle,
  },
  in_progress: {
    label: "In Progress",
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    icon: Clock,
  },
  resolved: {
    label: "Resolved",
    color: "bg-green-50 text-green-700 border-green-200",
    icon: CheckCircle2,
  },
  closed: {
    label: "Closed",
    color: "bg-gray-50 text-gray-700 border-gray-200",
    icon: Ban,
  },
};

export const priorityConfig = {
  urgent: { label: "Urgent", color: "bg-red-100 text-red-800 border-red-200" },
  critical: {
    label: "Critical",
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  high: {
    label: "High",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  medium: {
    label: "Medium",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  low: { label: "Low", color: "bg-green-100 text-green-800 border-green-200" },
};
