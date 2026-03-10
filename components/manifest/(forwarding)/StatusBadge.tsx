// app/dashboard/manifest/forwarding/create/components/StatusBadge.tsx
import { Badge } from "@/components/ui/badge";
import { Clock, Truck, CheckCircle2, Package } from "lucide-react";

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
  },
  ready: {
    label: "Ready",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Package,
  },
  in_transit: {
    label: "In Transit",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle2,
  },
};

const StatusBadge = ({ status }: { status: keyof typeof statusConfig }) => {
  const config = statusConfig[status];
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
