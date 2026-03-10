import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function PerformanceTrendsPanel({
  data,
}: {
  data: { month: string; performance: number; sla: number; revenue: number }[];
}) {
  return (
    <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold text-foreground">
            Network Performance Trends
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Monthly performance and SLA progression
          </p>
        </div>
        <Badge className="rounded-full bg-success text-success-foreground">
          +7.3% Growth
        </Badge>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="relative h-60 rounded-2xl bg-gradient-to-br from-primary/10 via-background to-success/10 p-4">
          <div className="flex h-full w-full items-end gap-2">
            {data.map((month) => (
              <div key={month.month} className="flex-1 space-y-1">
                <div className="flex h-32 items-end gap-1">
                  <div
                    className="flex-1 rounded-t-2xl bg-primary"
                    style={{ height: `${(month.performance / 10) * 100}%` }}
                  />
                  <div
                    className="flex-1 rounded-t-2xl bg-success"
                    style={{ height: `${month.sla}%` }}
                  />
                </div>
                <div className="text-center text-[0.65rem] text-muted-foreground">
                  {month.month}
                </div>
              </div>
            ))}
          </div>
          <div className="absolute left-4 top-4 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <span className="text-muted-foreground">Performance (/10)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-success" />
              <span className="text-muted-foreground">SLA (%)</span>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-muted/40 p-4 text-xs text-muted-foreground">
          Consistent performance improvement observed across the network. Focus
          on bringing bottom quartile partners above 7.0 score.
        </div>
      </CardContent>
    </Card>
  );
}
