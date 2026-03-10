import { Truck, Package, AlertCircle, CheckCircle2, Clock } from "lucide-react";

export const statusConfig = {
  in_transit: {
    label: "In Transit",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Truck,
  },
  out_for_delivery: {
    label: "Out for Delivery",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: Package,
  },
  delayed: {
    label: "Delayed",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: AlertCircle,
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle2,
  },
  pending: {
    label: "Pending",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: Clock,
  },
};

export const priorityConfig = {
  high: { label: "High", color: "bg-red-100 text-red-800 border-red-200" },
  medium: {
    label: "Medium",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  low: { label: "Low", color: "bg-green-100 text-green-800 border-green-200" },
};

export const confidenceConfig = {
  high: {
    label: "High Confidence",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  medium: {
    label: "Medium Confidence",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  low: {
    label: "Low Confidence",
    color: "bg-red-100 text-red-800 border-red-200",
  },
};
