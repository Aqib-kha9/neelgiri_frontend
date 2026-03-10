import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function SLACompliancePanel({
  data,
}: {
  data: {
    metric: string;
    target: number | string;
    actual: number | string;
    status: "exceeded" | "met" | "warning";
  }[];
}) {
  return (
    <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold text-foreground">
            SLA Compliance Dashboard
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Performance against service level agreements
          </p>
        </div>
        <Badge className="rounded-full bg-success text-success-foreground">
          94.2% Avg
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((metric) => (
          <div
            key={metric.metric}
            className="flex items-center justify-between rounded-2xl border border-border/60 p-4"
          >
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                {metric.metric}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>Target: {metric.target}</span>
                <span>Actual: {metric.actual}</span>
              </div>
            </div>
            <div className="text-right">
              <Badge
                variant={
                  metric.status === "exceeded"
                    ? "success"
                    : metric.status === "met"
                    ? "secondary" // Changed from "primary" to "secondary"
                    : "warning"
                }
                className="rounded-full text-xs"
              >
                {metric.status}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
