import { Badge } from "@/components/ui/badge";
import { statusConfig, serviceTypeConfig, paymentTypeConfig } from "./config";
import { StatusType, ServiceType, PaymentType } from "./types";

interface StatusBadgeProps {
  status: StatusType;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
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

interface ServiceTypeBadgeProps {
  type: ServiceType;
}

export const ServiceTypeBadge = ({ type }: ServiceTypeBadgeProps) => {
  const config = serviceTypeConfig[type];

  return (
    <Badge className={`rounded-full border ${config.color} px-2 py-1 text-xs`}>
      {config.label}
    </Badge>
  );
};

interface PaymentTypeBadgeProps {
  type: PaymentType;
}

export const PaymentTypeBadge = ({ type }: PaymentTypeBadgeProps) => {
  const config = paymentTypeConfig[type];

  return (
    <Badge className={`rounded-full border ${config.color} px-2 py-1 text-xs`}>
      {config.label}
    </Badge>
  );
};
