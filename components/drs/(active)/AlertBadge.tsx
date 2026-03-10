import { Badge } from "@/components/ui/badge";
import { alertConfig } from "./data/mockData";

interface AlertBadgeProps {
  priority: string;
}

const AlertBadge = ({ priority }: AlertBadgeProps) => {
  const config = alertConfig[priority as keyof typeof alertConfig];
  if (!config) return null;

  return (
    <Badge className={`rounded-full border ${config.color} px-2 py-1 text-xs`}>
      {config.label}
    </Badge>
  );
};

export default AlertBadge;
