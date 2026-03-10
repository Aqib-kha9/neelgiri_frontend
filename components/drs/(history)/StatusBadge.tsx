import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface StatusBadgeProps {
  status: "completed" | "cancelled" | "partial";
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusConfig = {
    completed: {
      label: "Completed",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle2,
    },
    cancelled: {
      label: "Cancelled",
      color: "bg-red-100 text-red-800 border-red-200",
      icon: XCircle,
    },
    partial: {
      label: "Partial",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: AlertCircle,
    },
  };

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
