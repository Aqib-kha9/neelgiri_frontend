import { Badge } from "@/components/ui/badge";
import { RiderStatusConfig } from "../booking/(out-for-delivery)/types/index";

const riderStatusConfig: Record<string, RiderStatusConfig> = {
  active: {
    label: "Active",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  available: {
    label: "Available",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  on_break: {
    label: "On Break",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  offline: {
    label: "Offline",
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },
};

interface RiderStatusBadgeProps {
  status: "active" | "available" | "on_break" | "offline"; // Explicit type define karo
}

const RiderStatusBadge = ({ status }: RiderStatusBadgeProps) => {
  const config = riderStatusConfig[status];

  if (!config) {
    return (
      <Badge className="rounded-full border bg-gray-100 text-gray-800 border-gray-200 px-2 py-1 text-xs">
        Unknown
      </Badge>
    );
  }

  return (
    <Badge className={`rounded-full border ${config.color} px-2 py-1 text-xs`}>
      {config.label}
    </Badge>
  );
};

export default RiderStatusBadge;
