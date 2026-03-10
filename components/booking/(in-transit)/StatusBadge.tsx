import { Badge } from "@/components/ui/badge";
import { statusConfig } from "./InTransit";
import { AlertCircle } from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  // Type assertion to treat status as a valid key
  const config = statusConfig[status as keyof typeof statusConfig];

  if (!config) {
    return (
      <Badge className="rounded-full border bg-gray-100 text-gray-700 border-gray-200 px-3 py-1.5 flex items-center gap-1.5">
        <AlertCircle className="h-3 w-3" />
        Unknown Status
      </Badge>
    );
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
