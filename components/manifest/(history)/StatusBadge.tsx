// app/dashboard/manifest/history/components/StatusBadge.tsx
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, XCircle, Clock } from "lucide-react";

const statusConfig = {
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle2,
  },
  delayed: {
    label: "Delayed",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: AlertCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: XCircle,
  },
  partial: {
    label: "Partial",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
  },
};

const StatusBadge = ({ status }: { status: keyof typeof statusConfig }) => {
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
