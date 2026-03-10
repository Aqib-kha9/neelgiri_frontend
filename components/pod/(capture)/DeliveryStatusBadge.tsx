import { Badge } from "@/components/ui/badge";

const deliveryStatusConfig = {
  delivered: {
    label: "Delivered",
    color: "bg-green-50 text-green-700 border-green-200",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    color: "bg-orange-50 text-orange-700 border-orange-200",
  },
  delivery_failed: {
    label: "Delivery Failed",
    color: "bg-red-50 text-red-700 border-red-200",
  },
  in_transit: {
    label: "In Transit",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
};

interface DeliveryStatusBadgeProps {
  status: string;
}

const DeliveryStatusBadge = ({ status }: DeliveryStatusBadgeProps) => {
  const config =
    deliveryStatusConfig[status as keyof typeof deliveryStatusConfig];
  if (!config) return null;

  return (
    <Badge className={`rounded-full border ${config.color} px-2 py-1 text-xs`}>
      {config.label}
    </Badge>
  );
};

export default DeliveryStatusBadge;
