import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Truck,
  Package,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: Clock,
  },
  in_transit: {
    label: "In Transit",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Truck,
  },
  out_for_delivery: {
    label: "Out for Delivery",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Package,
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle2,
  },
  exception: {
    label: "Exception",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: AlertCircle,
  },
  returned: {
    label: "Returned",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: XCircle,
  },
};

interface StatusBadgeProps {
  status: keyof typeof statusConfig;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status];
  const IconComponent = config.icon;

  return (
    <Badge
      className={`rounded-full border ${config.color} px-3 py-1.5 flex items-center gap-1.5`}
    >
      <IconComponent className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
