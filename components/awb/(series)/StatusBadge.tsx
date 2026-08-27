import { Badge } from "@/components/ui/badge";
import { Ban, CheckCircle2, Clock } from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

const statusConfig = {
  active: {
    label: "Active",
    color: "border-green-200 bg-green-50 text-green-700",
    icon: CheckCircle2,
  },
  inactive: {
    label: "Inactive",
    color: "border-gray-200 bg-gray-50 text-gray-700",
    icon: Ban,
  },
  expired: {
    label: "Exhausted",
    color: "border-orange-200 bg-orange-50 text-orange-700",
    icon: Clock,
  },
} as const;

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
  const Icon = config.icon;

  return (
    <Badge className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 ${config.color}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
