import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  XCircle,
  IndianRupee,
  CheckCircle2,
} from "lucide-react";
import { Exception } from "./types";

interface ExceptionsStatsProps {
  exceptions: Exception[];
}

export const ExceptionsStats = ({ exceptions }: ExceptionsStatsProps) => {
  const getCriticalExceptions = () => {
    return exceptions.filter(
      (exception) =>
        exception.severity === "critical" && exception.status !== "resolved"
    ).length;
  };

  const getTotalFinancialImpact = () => {
    return exceptions.reduce((sum, exception) => {
      const impact = parseFloat(
        exception.financialImpact.totalImpact.replace("₹", "").replace(",", "")
      );
      return sum + (isNaN(impact) ? 0 : impact);
    }, 0);
  };

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-red-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Active Exceptions
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {exceptions.filter((e) => e.status !== "resolved").length}
                </span>
                <Badge variant="destructive" className="rounded-full text-xs">
                  Attention
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Requiring resolution
              </p>
            </div>
            <div className="rounded-2xl bg-red-100 p-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-orange-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Critical Issues
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {getCriticalExceptions()}
                </span>
                <Badge variant="destructive" className="rounded-full text-xs">
                  Urgent
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Immediate attention needed
              </p>
            </div>
            <div className="rounded-2xl bg-orange-100 p-3">
              <XCircle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-yellow-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Financial Impact
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  ₹{getTotalFinancialImpact().toLocaleString()}
                </span>
                <Badge variant="secondary" className="rounded-full text-xs">
                  Risk
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Total potential loss
              </p>
            </div>
            <div className="rounded-2xl bg-yellow-100 p-3">
              <IndianRupee className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-green-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Resolved Today
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {exceptions.filter((e) => e.status === "resolved").length}
                </span>
                <Badge
                  variant="default"
                  className="rounded-full text-xs bg-green-100 text-green-800"
                >
                  {Math.round(
                    (exceptions.filter((e) => e.status === "resolved").length /
                      exceptions.length) *
                      100
                  )}
                  %
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Successfully resolved
              </p>
            </div>
            <div className="rounded-2xl bg-green-100 p-3">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
