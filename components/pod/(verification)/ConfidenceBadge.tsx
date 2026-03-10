import { Badge } from "@/components/ui/badge";
import { confidenceConfig } from "./data";

interface ConfidenceBadgeProps {
  confidence: number;
}

const ConfidenceBadge = ({ confidence }: ConfidenceBadgeProps) => {
  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 80) return "high";
    if (confidence >= 60) return "medium";
    return "low";
  };

  const level = getConfidenceLevel(confidence);
  const config = confidenceConfig[level as keyof typeof confidenceConfig];

  return (
    <Badge className={`rounded-full border ${config.color} px-2 py-1 text-xs`}>
      {config.label} ({confidence}%)
    </Badge>
  );
};

export default ConfidenceBadge;
