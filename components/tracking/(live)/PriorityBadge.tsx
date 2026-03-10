import { Badge } from "@/components/ui/badge";
import { priorityConfig } from "./data/statusConfig";

interface PriorityBadgeProps {
  priority: keyof typeof priorityConfig;
}

const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  const config = priorityConfig[priority];

  return (
    <Badge className={`rounded-full border ${config.color} px-2 py-1 text-xs`}>
      {config.label}
    </Badge>
  );
};

export default PriorityBadge;
