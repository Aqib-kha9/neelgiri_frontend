import { Hash, Package, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface AwbStats {
  totalSeries?: number;
  activeSeries?: number;
  exhaustedSeries?: number;
  inactiveSeries?: number;
  totalCapacity?: number;
  totalAllocated?: number;
  totalConsumed?: number;
  totalAvailable?: number;
  utilizationRate?: number;
}

interface StatsOverviewProps {
  stats?: AwbStats | null;
  nearExhaustionCount?: number;
}

const StatsOverview = ({ stats, nearExhaustionCount = 0 }: StatsOverviewProps) => {
  const totalCapacity = stats?.totalCapacity || 0;
  const totalConsumed = stats?.totalConsumed || 0;
  const totalAvailable = stats?.totalAvailable || 0;
  const utilizationPct = totalCapacity > 0 ? Math.round((totalConsumed / totalCapacity) * 100) : 0;
  const availablePct = totalCapacity > 0 ? Math.round((totalAvailable / totalCapacity) * 100) : 0;

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
                  {totalCapacity.toLocaleString()}
                </span>
                <Badge variant="success" className="rounded-full text-xs">
                  {stats?.activeSeries || 0} Active
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
                  {totalAvailable.toLocaleString()}
                </span>
                <Badge variant="success" className="rounded-full text-xs">
                  {availablePct}%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Allocated and ready for use
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
                  {totalConsumed.toLocaleString()}
                </span>
                <Badge variant="warning" className="rounded-full text-xs">
                  {utilizationPct}%
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
                  {nearExhaustionCount}
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
