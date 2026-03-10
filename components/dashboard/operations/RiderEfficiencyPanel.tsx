// FILE: src/components/dashboard/operations/RiderEfficiencyPanel.tsx
// =====================================================
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function RiderEfficiencyPanel({
  data,
}: {
  data: {
    name: string;
    deliveries: number;
    successRate: number;
    avgTime: string;
    status: string;
  }[];
}) {
  return (
    <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold text-foreground">
            Rider Efficiency Ranking
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Top performers and improvement areas
          </p>
        </div>
        <Badge className="rounded-full bg-primary/15 px-3 py-1 text-primary">
          184 Active
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((rider, index) => (
          <div
            key={rider.name}
            className="flex items-center justify-between rounded-2xl border border-border/60 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {index + 1}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  {rider.name}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{rider.deliveries} deliveries</span>
                  <span>Avg: {rider.avgTime}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-foreground">
                {rider.successRate}%
              </div>
              <Badge
                variant={
                  rider.status === "excellent"
                    ? "success"
                    : rider.status === "good"
                    ? "secondary" // Changed from "primary" to "secondary"
                    : "warning"
                }
                className="rounded-full text-xs"
              >
                {rider.status}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// =====================================================
