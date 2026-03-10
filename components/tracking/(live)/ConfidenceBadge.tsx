import { Badge } from "@/components/ui/badge";
import { confidenceConfig } from "./data/statusConfig";

interface ConfidenceBadgeProps {
  confidence: keyof typeof confidenceConfig;
}

const ConfidenceBadge = ({ confidence }: ConfidenceBadgeProps) => {
  const config = confidenceConfig[confidence];

  return (
    <Badge className={`rounded-full border ${config.color} px-2 py-1 text-xs`}>
      {config.label}
    </Badge>
  );
};

export default ConfidenceBadge;
