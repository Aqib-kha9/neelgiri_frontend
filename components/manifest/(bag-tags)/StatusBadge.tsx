// app/dashboard/manifest/bag-tags/components/StatusBadge.tsx
import { Badge } from "@/components/ui/badge";
import { Package, Lock, Truck, CheckCircle2, XCircle } from "lucide-react";

const statusConfig = {
  open: {
    label: "Open",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Package,
  },
  sealed: {
    label: "Sealed",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: Lock,
  },
  in_transit: {
    label: "In Transit",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
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
