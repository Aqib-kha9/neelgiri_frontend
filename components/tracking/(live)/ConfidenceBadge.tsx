import { Badge } from "@/components/ui/badge";
import { confidenceConfig } from "./data/statusConfig";

interface ConfidenceBadgeProps {
  confidence: keyof typeof confidenceConfig;
}

const ConfidenceBadge = ({ confidence }: ConfidenceBadgeProps) => {
  const config = confidenceConfig[confidence as keyof typeof confidenceConfig] || {
    label: confidence || "Unknown",
    color: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <Badge className={`rounded-full border ${config.color} px-2 py-1 text-xs`}>
      {config.label}
    </Badge>
  );
};

export default ConfidenceBadge;
