import { Badge } from "@/components/ui/badge";
import { riskConfig } from "./data";

interface RiskBadgeProps {
  risk: string;
}

const RiskBadge = ({ risk }: RiskBadgeProps) => {
  const config = riskConfig[risk as keyof typeof riskConfig];
  if (!config) return null;

  return (
    <Badge className={`rounded-full border ${config.color} px-2 py-1 text-xs`}>
      {config.label}
    </Badge>
  );
};

export default RiskBadge;
