import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, UserCheck, Calendar } from "lucide-react";

// Standalone statusConfig define karo
export const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
  },
  assigned: {
    label: "Assigned",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: UserCheck,
  },
  scheduled: {
    label: "Scheduled",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: Calendar,
  },
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
  },
  failed: {
    label: "Failed",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
  },
};

interface StatusBadgeProps {
  status: keyof typeof statusConfig;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status];

  if (!config || !config.icon) {
    console.error(`Invalid status config for: ${status}`);
    return null;
  }

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
