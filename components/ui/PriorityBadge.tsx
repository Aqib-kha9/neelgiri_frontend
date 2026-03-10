import { Badge } from "@/components/ui/badge";
import { PriorityConfig } from "../booking/(out-for-delivery)/types/index";

const priorityConfig: Record<string, PriorityConfig> = {
  high: { label: "High", color: "bg-red-100 text-red-800 border-red-200" },
  medium: {
    label: "Medium",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  low: { label: "Low", color: "bg-blue-100 text-blue-800 border-blue-200" },
};

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
