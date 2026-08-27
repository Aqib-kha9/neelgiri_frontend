import { AlertCircle, BarChart3, Hash, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AnalyticsSeries = {
  status: string;
  usage: { percentage: number };
  allocation: { type: string };
};

interface AnalyticsSectionProps {
  series: AnalyticsSeries[];
}

const AnalyticsSection = ({ series }: AnalyticsSectionProps) => {
  const activeCount = series.filter((item) => item.status === "active").length;
  const allocatedCount = series.filter(
    (item) => item.allocation.type !== "unallocated",
  ).length;
  const nearExhaustionCount = series.filter(
    (item) => item.status === "active" && item.usage.percentage >= 80,
  ).length;
  const activePercentage = series.length
    ? Math.round((activeCount / series.length) * 100)
    : 0;

  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <BarChart3 className="h-5 w-5 text-primary" />
          AWB Series Analytics
        </CardTitle>
        <CardDescription>
          Live utilization and allocation metrics for the current scope
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="rounded-xl border-blue-200 bg-blue-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2">
                  <Hash className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{activeCount}</p>
                  <p className="text-sm text-muted-foreground">Active Series</p>
                  <p className="text-xs text-blue-600">{activePercentage}% of total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-green-200 bg-green-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-2">
                  <User className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{allocatedCount}</p>
                  <p className="text-sm text-muted-foreground">Allocated Series</p>
                  <p className="text-xs text-green-600">With a persisted target</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-orange-200 bg-orange-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-orange-100 p-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{nearExhaustionCount}</p>
                  <p className="text-sm text-muted-foreground">Near Exhaustion</p>
                  <p className="text-xs text-orange-600">At or above 80% used</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsSection;
