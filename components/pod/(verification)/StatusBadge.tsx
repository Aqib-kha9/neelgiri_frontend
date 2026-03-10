import {
  CheckCircle2,
  Clock,
  RefreshCw,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { statusConfig } from "./data";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status as keyof typeof statusConfig];
  if (!config) return null;

  const IconComponent = getIconComponent(config.icon);

  return (
    <Badge
      className={`rounded-full border ${config.color} px-3 py-1.5 flex items-center gap-1.5`}
    >
      <IconComponent className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "CheckCircle2":
      return CheckCircle2;
    case "Clock":
      return Clock;
    case "RefreshCw":
      return RefreshCw;
    case "AlertCircle":
      return AlertCircle;
    case "XCircle":
      return XCircle;
    default:
      return CheckCircle2;
  }
};

export default StatusBadge;
