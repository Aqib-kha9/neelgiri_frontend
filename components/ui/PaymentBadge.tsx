import { Badge } from "@/components/ui/badge";
import { paymentConfig } from "@/components/booking/(delivered)/data/mockData";

interface PaymentBadgeProps {
  status: keyof typeof paymentConfig;
}

const PaymentBadge = ({ status }: PaymentBadgeProps) => {
  const config = paymentConfig[status];

  return (
    <Badge className={`rounded-full border ${config.color} px-2 py-1 text-xs`}>
      {config.label}
    </Badge>
  );
};

export default PaymentBadge;
