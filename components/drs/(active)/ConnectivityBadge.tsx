import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";
import { connectivityConfig } from "./data/mockData";

interface ConnectivityBadgeProps {
  status: string;
}

const ConnectivityBadge = ({ status }: ConnectivityBadgeProps) => {
  const config = connectivityConfig[status as keyof typeof connectivityConfig];
  if (!config) return null;

  const IconComponent = config.icon === "Wifi" ? Wifi : WifiOff;

  return (
    <Badge
      className={`rounded-full border ${config.color} px-2 py-1 text-xs flex items-center gap-1`}
    >
      <IconComponent className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

export default ConnectivityBadge;
