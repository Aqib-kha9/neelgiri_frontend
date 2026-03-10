import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, XCircle, CheckCircle2, BarChart3 } from "lucide-react";
import { Exception } from "./types";

interface ExceptionAnalyticsProps {
  exceptions: Exception[];
}

export const ExceptionAnalytics = ({ exceptions }: ExceptionAnalyticsProps) => {
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
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <BarChart3 className="h-5 w-5 text-primary" />
          Exception Analytics
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Overview of exception types, severity, and resolution performance
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="rounded-xl border-red-200 bg-red-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-red-100 p-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {
                      exceptions.filter((e) => e.type === "delivery_failed")
                        .length
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Delivery Failures
                  </p>
                  <p className="text-xs text-red-600">
                    {Math.round(
                      (exceptions.filter((e) => e.type === "delivery_failed")
                        .length /
                        exceptions.length) *
                        100
                    )}
                    % of total
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-orange-200 bg-orange-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-orange-100 p-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {exceptions.filter((e) => e.severity === "critical").length}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Critical Issues
                  </p>
                  <p className="text-xs text-orange-600">
                    Require immediate attention
                  </p>
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
                    {exceptions.filter((e) => e.status === "resolved").length}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Resolved Today
                  </p>
                  <p className="text-xs text-green-600">
                    {Math.round(
                      (exceptions.filter((e) => e.status === "resolved")
                        .length /
                        exceptions.length) *
                        100
                    )}
                    % resolution rate
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 rounded-xl border border-red-200 bg-red-50/50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Exception Management Alert
              </p>
              <p className="text-xs text-muted-foreground">
                {getCriticalExceptions()} critical exceptions require immediate
                attention. Total financial impact of ₹
                {getTotalFinancialImpact().toLocaleString()} across all active
                exceptions.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
