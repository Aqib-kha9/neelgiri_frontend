import { Badge } from "@/components/ui/badge";
import {
  exceptionTypeConfig,
  severityConfig,
  statusConfig,
  priorityConfig,
} from "./config";
import { ExceptionType, SeverityType, StatusType, PriorityType } from "./types";

interface ExceptionTypeBadgeProps {
  type: ExceptionType;
}

export const ExceptionTypeBadge = ({ type }: ExceptionTypeBadgeProps) => {
  const config = exceptionTypeConfig[type];
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

interface SeverityBadgeProps {
  severity: SeverityType;
}

export const SeverityBadge = ({ severity }: SeverityBadgeProps) => {
  const config = severityConfig[severity];

  return (
    <Badge className={`rounded-full border ${config.color} px-2 py-1 text-xs`}>
      {config.label}
    </Badge>
  );
};

interface StatusBadgeProps {
  status: StatusType;
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

interface PriorityBadgeProps {
  priority: PriorityType;
}

export const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  const config = priorityConfig[priority];

  return (
    <Badge className={`rounded-full border ${config.color} px-2 py-1 text-xs`}>
      {config.label}
    </Badge>
  );
};
