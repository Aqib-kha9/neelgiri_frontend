import { Badge } from "@/components/ui/badge";
import { statusConfig } from "@/components/booking/(out-for-delivery)/data/mockData";
import { StatusConfig } from "@/components/booking/(out-for-delivery)/types/index";

interface StatusBadgeProps {
  status: keyof typeof statusConfig;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config: StatusConfig = statusConfig[status];

  if (!config || !config.icon) {
    console.error(`Invalid status config for: ${status}`);
    return null;
  }

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

export default StatusBadge;
