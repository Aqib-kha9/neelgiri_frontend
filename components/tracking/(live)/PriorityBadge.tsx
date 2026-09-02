import { Badge } from "@/components/ui/badge";
import { priorityConfig } from "./data/statusConfig";

interface PriorityBadgeProps {
  priority: keyof typeof priorityConfig;
}

const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  const config = priorityConfig[priority as keyof typeof priorityConfig] || {
    label: priority || "Unknown",
    color: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <Badge className={`rounded-full border ${config.color} px-2 py-1 text-xs`}>
      {config.label}
    </Badge>
  );
};

export default PriorityBadge;
