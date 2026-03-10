import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Ban, AlertCircle, Clock } from "lucide-react";
import { statusConfig } from "./data/mockData";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status as keyof typeof statusConfig];
  if (!config) return null;

  const IconComponent = () => {
    switch (config.icon) {
      case "CheckCircle2":
        return <CheckCircle2 className="h-3 w-3" />;
      case "Ban":
        return <Ban className="h-3 w-3" />;
      case "AlertCircle":
        return <AlertCircle className="h-3 w-3" />;
      case "Clock":
        return <Clock className="h-3 w-3" />;
      default:
        return <AlertCircle className="h-3 w-3" />;
    }
  };

  return (
    <Badge
      className={`rounded-full border ${config.color} px-3 py-1.5 flex items-center gap-1.5`}
    >
      <IconComponent />
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
