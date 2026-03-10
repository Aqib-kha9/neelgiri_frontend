// ===================== SystemAlertsPanel.tsx =====================
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ShieldCheck, Clock } from "lucide-react";

interface AlertItem {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
}

export function SystemAlertsPanel({ alerts }: { alerts: AlertItem[] }) {
  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-destructive/15 text-destructive";
      case "high":
        return "bg-warning/15 text-warning";
      case "medium":
        return "bg-primary/15 text-primary";
      default:
        return "bg-muted/20 text-muted-foreground";
    }
  };

  const getIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "high":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "medium":
        return <ShieldCheck className="h-4 w-4 text-primary" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">
          System Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-background/80 p-3 transition-colors hover:border-primary/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getIcon(alert.severity)}
                <p className="text-sm font-medium text-foreground">
                  {alert.title}
                </p>
              </div>
              <span
                className={`rounded-full px-2 py-1 text-xs font-semibold ${getSeverityStyle(
                  alert.severity
                )}`}
              >
                {alert.severity}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-snug">
              {alert.description}
            </p>
            <p className="text-[0.7rem] text-muted-foreground">
              {alert.timestamp}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
