import { Badge } from "@/components/ui/badge";

interface PerformanceBadgeProps {
  efficiency: number;
}

const PerformanceBadge = ({ efficiency }: PerformanceBadgeProps) => {
  const performanceConfig = {
    excellent: {
      label: "Excellent",
      color: "bg-green-100 text-green-800 border-green-200",
      min: 90,
    },
    good: {
      label: "Good",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      min: 80,
    },
    average: {
      label: "Average",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      min: 70,
    },
    poor: {
      label: "Poor",
      color: "bg-red-100 text-red-800 border-red-200",
      min: 0,
    },
  };

  const getPerformanceLevel = (efficiency: number) => {
    if (efficiency >= 90) return "excellent";
    if (efficiency >= 80) return "good";
    if (efficiency >= 70) return "average";
    return "poor";
  };

  const level = getPerformanceLevel(efficiency);
  const config = performanceConfig[level as keyof typeof performanceConfig];

  return (
    <Badge className={`rounded-full border ${config.color} px-2 py-1 text-xs`}>
      {config.label}
    </Badge>
  );
};

export default PerformanceBadge;
