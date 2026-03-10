import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hash, TrendingUp, Users, IndianRupee } from "lucide-react";

interface StatsOverviewProps {
  realTimeStats: {
    totalAWBNumbers: number;
    monthlyUsage: number;
    utilizationRate: number;
    branchesActive: number;
    partnersActive: number;
    revenue: string;
  };
}

export const StatsOverview = ({ realTimeStats }: StatsOverviewProps) => {
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
                  {realTimeStats.totalAWBNumbers.toLocaleString()}
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
                Monthly Usage
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {realTimeStats.monthlyUsage.toLocaleString()}
                </span>
                <Badge variant="success" className="rounded-full text-xs">
                  {realTimeStats.utilizationRate}%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Utilization rate</p>
            </div>
            <div className="rounded-2xl bg-green-100 p-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-orange-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Active Allocations
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {realTimeStats.branchesActive + realTimeStats.partnersActive}
                </span>
                <Badge variant="warning" className="rounded-full text-xs">
                  Active
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Branches & partners
              </p>
            </div>
            <div className="rounded-2xl bg-orange-100 p-3">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-purple-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Monthly Revenue
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {realTimeStats.revenue}
                </span>
                <Badge variant="success" className="rounded-full text-xs">
                  +15%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">From AWB usage</p>
            </div>
            <div className="rounded-2xl bg-purple-100 p-3">
              <IndianRupee className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
