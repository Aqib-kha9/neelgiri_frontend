import { Hash, Package, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { awbSeriesData } from "./data/mockData";

const StatsOverview = () => {
  const getTotalAWBNumbers = () => {
    return awbSeriesData.reduce(
      (sum, series) => sum + (series.endRange - series.startRange + 1),
      0
    );
  };

  const getUsedAWBNumbers = () => {
    return awbSeriesData.reduce((sum, series) => sum + series.usage.used, 0);
  };

  const getAvailableAWBNumbers = () => {
    return awbSeriesData.reduce(
      (sum, series) => sum + series.usage.available,
      0
    );
  };

  const getNearExhaustionCount = () => {
    return awbSeriesData.filter(
      (series) => series.usage.percentage >= 80 && series.status === "active"
    ).length;
  };

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-blue-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Total AWB Numbers
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {getTotalAWBNumbers().toLocaleString()}
                </span>
                <Badge variant="success" className="rounded-full text-xs">
                  Active
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Across all series</p>
            </div>
            <div className="rounded-2xl bg-blue-100 p-3">
              <Hash className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-green-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Available Numbers
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {getAvailableAWBNumbers().toLocaleString()}
                </span>
                <Badge variant="success" className="rounded-full text-xs">
                  {Math.round(
                    (getAvailableAWBNumbers() / getTotalAWBNumbers()) * 100
                  )}
                  %
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Ready for allocation
              </p>
            </div>
            <div className="rounded-2xl bg-green-100 p-3">
              <Package className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-orange-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Used Numbers
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {getUsedAWBNumbers().toLocaleString()}
                </span>
                <Badge variant="warning" className="rounded-full text-xs">
                  {Math.round(
                    (getUsedAWBNumbers() / getTotalAWBNumbers()) * 100
                  )}
                  %
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Already utilized</p>
            </div>
            <div className="rounded-2xl bg-orange-100 p-3">
              <CheckCircle2 className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-red-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Near Exhaustion
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {getNearExhaustionCount()}
                </span>
                <Badge variant="error" className="rounded-full text-xs">
                  Attention
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Series above 80% usage
              </p>
            </div>
            <div className="rounded-2xl bg-red-100 p-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverview;
