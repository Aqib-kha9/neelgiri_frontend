import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, CheckCircle2, AlertCircle, Clock } from "lucide-react";

interface StatsOverviewProps {
  totalAllocations: number;
  activeAllocations: number;
  nearExhaustionCount: number;
  expiringSoonCount: number;
}

export const StatsOverview = ({
  totalAllocations,
  activeAllocations,
  nearExhaustionCount,
  expiringSoonCount,
}: StatsOverviewProps) => {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-blue-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Total Allocations
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {totalAllocations}
                </span>
                <Badge variant="success" className="rounded-full text-xs">
                  Active
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Across branches & partners
              </p>
            </div>
            <div className="rounded-2xl bg-blue-100 p-3">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-green-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Active Allocations
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {activeAllocations}
                </span>
                <Badge variant="success" className="rounded-full text-xs">
                  {Math.round((activeAllocations / totalAllocations) * 100)}%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </div>
            <div className="rounded-2xl bg-green-100 p-3">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-orange-50/50 shadow-card">
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
                <Badge variant="warning" className="rounded-full text-xs">
                  Attention
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Require replenishment
              </p>
            </div>
            <div className="rounded-2xl bg-orange-100 p-3">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-red-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Expiring Soon
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {expiringSoonCount}
                </span>
                <Badge variant="error" className="rounded-full text-xs">
                  Renewal
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Need extension</p>
            </div>
            <div className="rounded-2xl bg-red-100 p-3">
              <Clock className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
