import { Badge } from "@/components/ui/badge";
import { priorityConfig } from "./PendingPickups";

interface PriorityBadgeProps {
  priority: keyof typeof priorityConfig;
}

export const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  const config = priorityConfig[priority];

  return (
    <Badge className={`rounded-full border ${config.color} px-2 py-1 text-xs`}>
      {config.label}
    </Badge>
  );
};
