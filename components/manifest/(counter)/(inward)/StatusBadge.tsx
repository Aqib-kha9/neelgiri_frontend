import { Clock, RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const statusConfig = {
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
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-800 border-red-200",
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
