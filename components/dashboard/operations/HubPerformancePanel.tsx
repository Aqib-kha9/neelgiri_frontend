// FILE: src/components/dashboard/operations/HubPerformancePanel.tsx
// =====================================================
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";

export function HubPerformancePanel({
  data,
}: {
  data: {
    hub: string;
    shipments: number;
    onTime: number;
    efficiency: number;
    status: string;
  }[];
}) {
  return (
    <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold text-foreground">
            Hub Performance Scorecard
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Efficiency metrics across major hubs
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1 rounded-lg border-border/80"
        >
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((hub) => (
          <div
            key={hub.hub}
            className="flex items-center justify-between rounded-2xl border border-border/60 p-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {hub.hub}
                </span>
                <Badge
                  variant={
                    hub.status === "excellent"
                      ? "success"
                      : hub.status === "good"
                      ? "secondary" // Changed from "primary" to "secondary"
                      : "warning"
                  }
                  className="rounded-full text-xs"
                >
                  {hub.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>Shipments: {hub.shipments}</span>
                <span>On-time: {hub.onTime}%</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-foreground">
                {hub.efficiency}%
              </div>
              <div className="text-xs text-muted-foreground">Efficiency</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// =====================================================
