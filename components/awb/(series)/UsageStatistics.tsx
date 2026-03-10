import { BarChart3 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface UsageStatisticsProps {
  series: any;
}

const UsageStatistics = ({ series }: UsageStatisticsProps) => {
  const UsageProgress = ({ usage }: { usage: any }) => {
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

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border/60 p-4">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="h-4 w-4 text-orange-600" />
          <span className="text-sm font-semibold text-foreground">
            Usage Statistics
          </span>
        </div>
        <div className="space-y-3">
          <UsageProgress usage={series.usage} />

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Last Used:</span>
              <span className="font-medium">
                {series.usage.lastUsed
                  ? new Date(series.usage.lastUsed).toLocaleString("en-IN")
                  : "Never"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Created:</span>
              <span className="font-medium">
                {new Date(series.createdAt).toLocaleDateString("en-IN")}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">By:</span>
              <span className="font-medium">{series.createdBy}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageStatistics;
