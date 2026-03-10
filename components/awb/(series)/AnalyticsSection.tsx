import {
  BarChart3,
  Hash,
  User,
  AlertCircle,
  IndianRupee,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { awbSeriesData, getNearExhaustionCount } from "./data/mockData";

const AnalyticsSection = () => {
  const getNearExhaustionCount = () => {
    return awbSeriesData.filter(
      (series) => series.usage.percentage >= 80 && series.status === "active"
    ).length;
  };

  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <BarChart3 className="h-5 w-5 text-primary" />
          AWB Series Analytics
        </CardTitle>
        <CardDescription>
          Comprehensive overview of AWB number utilization and allocation
          patterns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-xl border-blue-200 bg-blue-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2">
                  <Hash className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {awbSeriesData.filter((s) => s.status === "active").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Active Series</p>
                  <p className="text-xs text-blue-600">
                    {Math.round(
                      (awbSeriesData.filter((s) => s.status === "active")
                        .length /
                        awbSeriesData.length) *
                        100
                    )}
                    % of total
                  </p>
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
                  <p className="text-2xl font-bold text-foreground">
                    {awbSeriesData.filter((s) => s.allocatedTo !== null).length}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Allocated Series
                  </p>
                  <p className="text-xs text-green-600">
                    To customers and corporates
                  </p>
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
                  <p className="text-2xl font-bold text-foreground">
                    {getNearExhaustionCount()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Near Exhaustion
                  </p>
                  <p className="text-xs text-orange-600">Require attention</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-purple-200 bg-purple-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-100 p-2">
                  <IndianRupee className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {
                      awbSeriesData.filter(
                        (s) => s.financial.creditLimit !== "₹0"
                      ).length
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">Credit Series</p>
                  <p className="text-xs text-purple-600">With credit limits</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50/50 p-4">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                AWB Management Tips
              </p>
              <p className="text-xs text-muted-foreground">
                Monitor series with usage above 80% closely. Set up auto-renewal
                for active customers and regularly review allocation patterns to
                optimize AWB number utilization across your network.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsSection;
