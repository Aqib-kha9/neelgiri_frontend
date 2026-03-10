import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertCircle, Ban } from "lucide-react";

const statusConfig = {
  active: {
    label: "Active",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle2,
  },
  expired: {
    label: "Expired",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: Clock,
  },
  suspended: {
    label: "Suspended",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: AlertCircle,
  },
  near_exhaustion: {
    label: "Near Exhaustion",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: AlertCircle,
  },
  expiring_soon: {
    label: "Expiring Soon",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Clock,
  },
};

interface StatusBadgeProps {
  status: keyof typeof statusConfig;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
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
