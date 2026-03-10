// FILE: src/components/dashboard/operations/ShipmentLifecycleChart.tsx
// (Exact same UI with progress bars; keeping component name for compatibility)
// =====================================================
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ShipmentLifecycleChart({
  data,
  total,
}: {
  data: { stage: string; count: number; percentage: number; color: string }[];
  total: number;
}) {
  return (
    <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold text-foreground">
            Shipment Lifecycle Flow
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Journey from booking to delivery completion
          </p>
        </div>
        <Badge className="rounded-full bg-success text-success-foreground">
          55% Delivered
        </Badge>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-4">
          {data.map((stage) => (
            <div key={stage.stage}>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{stage.stage}</span>
                <span className="font-semibold text-foreground">
                  {stage.count} shipments
                </span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-muted/40">
                <div
                  className={`h-full rounded-full ${stage.color}`}
                  style={{ width: `${stage.percentage}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                <span>{stage.percentage}% completion</span>
                <span>{Math.round((stage.count / total) * 100)}% of total</span>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-2xl bg-muted/40 p-4 text-xs text-muted-foreground">
          Focus on reducing transit time between 'In Transit' and 'Out for
          Delivery' stages. Current bottleneck identified at sorting facilities.
        </div>
      </CardContent>
    </Card>
  );
}

// =====================================================
