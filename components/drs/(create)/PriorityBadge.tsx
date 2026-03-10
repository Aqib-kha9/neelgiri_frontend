import { Badge } from "@/components/ui/badge";
import { priorityConfig } from "./data/mockData";

interface PriorityBadgeProps {
  priority: string;
}

const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  const config = priorityConfig[priority as keyof typeof priorityConfig];

  if (!config) return null;

  return (
    <Badge className={`rounded-full border ${config.color} px-2 py-1 text-xs`}>
      {config.label}
    </Badge>
  );
};

export default PriorityBadge;
