import { Progress } from "@/components/ui/progress";

interface UsageProgressProps {
  usage: {
    percentage: number;
    used: number;
    available: number;
  };
}

export const UsageProgress = ({ usage }: UsageProgressProps) => {
  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-red-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">Usage</span>
        <span className="font-medium">
          {usage.used}/{usage.used + usage.available}
        </span>
      </div>
      <Progress
        value={usage.percentage}
        className={`h-2 ${getProgressColor(usage.percentage)}`}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{usage.available} available</span>
        <span>{usage.percentage}% used</span>
      </div>
    </div>
  );
};
