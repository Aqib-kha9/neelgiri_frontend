// FILE: src/components/dashboard/operations/OperationsAlertsPanel.tsx
// (Exact UI for "Recent Operational Activities")
// =====================================================
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export function OperationsAlertsPanel({
  activities,
}: {
  activities: {
    id: string;
    title: string;
    description: string;
    status: "success" | "warning" | "error";
    timestamp: string;
    hub: string;
  }[];
}) {
  return (
    <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold text-foreground">
            Recent Operational Activities
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Live updates from across the network
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 rounded-2xl border border-border/60 p-4"
          >
            <div
              className={`rounded-2xl p-2 ${
                activity.status === "success"
                  ? "bg-success/10 text-success"
                  : activity.status === "warning"
                  ? "bg-warning/10 text-warning"
                  : "bg-error/10 text-error"
              }`}
            >
              {activity.status === "success" ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <AlertTriangle className="h-5 w-5" />
              )}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-foreground">
                  {activity.title}
                </p>
                <Badge variant="outline" className="rounded-full text-xs">
                  {activity.hub}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {activity.description}
              </p>
              <p className="text-xs text-muted-foreground">
                {activity.timestamp}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
