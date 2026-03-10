import { Badge } from "@/components/ui/badge";
import {
  Clock,
  PlayCircle,
  PauseCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { statusConfig } from "./data/mockData";

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
    case "Clock":
      return Clock;
    case "PlayCircle":
      return PlayCircle;
    case "PauseCircle":
      return PauseCircle;
    case "CheckCircle2":
      return CheckCircle2;
    case "XCircle":
      return XCircle;
    default:
      return Clock;
  }
};

export default StatusBadge;
