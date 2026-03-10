import { Badge } from "@/components/ui/badge";
import {
  statusConfig,
  priorityConfig,
  discrepancyConfig,
  severityConfig,
} from "./data";

export const StatusBadge = ({ status }: { status: string }) => {
  const config = statusConfig[status as keyof typeof statusConfig];
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

export const PriorityBadge = ({ priority }: { priority: string }) => {
  const config = priorityConfig[priority as keyof typeof priorityConfig];

  return (
    <Badge className={`rounded-full border ${config.color} px-2 py-1 text-xs`}>
      {config.label}
    </Badge>
  );
};

export const DiscrepancyBadge = ({ type }: { type: string }) => {
  const config = discrepancyConfig[type as keyof typeof discrepancyConfig];

  if (!config) {
    return (
      <Badge className="rounded-full border bg-gray-100 text-gray-800 border-gray-200 px-2 py-1 text-xs">
        Unknown
      </Badge>
    );
  }

  return (
    <Badge className={`rounded-full border ${config.color} px-2 py-1 text-xs`}>
      {config.label}
    </Badge>
  );
};

export const SeverityBadge = ({ severity }: { severity: string }) => {
  const config = severityConfig[severity as keyof typeof severityConfig];

  return (
    <Badge className={`rounded-full border ${config.color} px-2 py-1 text-xs`}>
      {config.label}
    </Badge>
  );
};
