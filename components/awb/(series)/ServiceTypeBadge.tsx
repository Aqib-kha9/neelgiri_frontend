import { Badge } from "@/components/ui/badge";
import { serviceTypeConfig } from "./data/mockData";

interface ServiceTypeBadgeProps {
  type: string;
}

const ServiceTypeBadge = ({ type }: ServiceTypeBadgeProps) => {
  const config = serviceTypeConfig[type as keyof typeof serviceTypeConfig];
  if (!config) return null;

  return (
    <Badge className={`rounded-full border ${config.color} px-2 py-1 text-xs`}>
      {config.label}
    </Badge>
  );
};

export default ServiceTypeBadge;
