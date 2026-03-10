import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  BarChart3,
  Building,
  Users,
  AlertCircle,
  CheckCircle2,
  Zap,
} from "lucide-react";

interface AllocationAnalyticsProps {
  allocationData: any[];
  nearExhaustionCount: number;
}

export const AllocationAnalytics = ({
  allocationData,
  nearExhaustionCount,
}: AllocationAnalyticsProps) => {
  const branchAllocations = allocationData.filter(
    (a) => a.allocatedTo.type === "branch"
  ).length;
  const partnerAllocations = allocationData.filter(
    (a) => a.allocatedTo.type === "partner"
  ).length;
  const highPerformanceCount = allocationData.filter(
    (a) => a.performance.successRate >= 98
  ).length;

  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <BarChart3 className="h-5 w-5 text-primary" />
          Allocation Analytics
        </CardTitle>
        <CardDescription>
          Comprehensive overview of AWB allocation patterns and utilization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-xl border-blue-200 bg-blue-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2">
                  <Building className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {branchAllocations}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Branch Allocations
                  </p>
                  <p className="text-xs text-blue-600">
                    {Math.round(
                      (branchAllocations / allocationData.length) * 100
                    )}
                    % of total
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-purple-200 bg-purple-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-100 p-2">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {partnerAllocations}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Partner Allocations
                  </p>
                  <p className="text-xs text-purple-600">
                    External logistics partners
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
                    {nearExhaustionCount}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Near Exhaustion
                  </p>
                  <p className="text-xs text-orange-600">Require attention</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-green-200 bg-green-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {highPerformanceCount}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    High Performance
                  </p>
                  <p className="text-xs text-green-600">98%+ success rate</p>
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
                Allocation Management Tips
              </p>
              <p className="text-xs text-muted-foreground">
                Monitor allocations with usage above 80% closely. Set up
                auto-renewal for high-performing branches and regularly review
                allocation patterns to optimize AWB number distribution across
                your network.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
