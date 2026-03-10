// app/dashboard/manifest/history/components/PerformanceBadge.tsx
import { Badge } from "@/components/ui/badge";

const performanceConfig = {
  excellent: {
    label: "Excellent",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  good: { label: "Good", color: "bg-blue-100 text-blue-800 border-blue-200" },
  average: {
    label: "Average",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  poor: { label: "Poor", color: "bg-red-100 text-red-800 border-red-200" },
};

const PerformanceBadge = ({
  performance,
}: {
  performance: keyof typeof performanceConfig;
}) => {
  const config = performanceConfig[performance];

  return (
    <Badge className={`rounded-full border ${config.color} px-2 py-1 text-xs`}>
      {config.label}
    </Badge>
  );
};

export default PerformanceBadge;
