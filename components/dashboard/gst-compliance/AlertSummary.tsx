import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

const complianceData = {
  complianceAlerts: {
    critical: 3,
    warning: 8,
    info: 12,
  },
};

const complianceAlerts = [
  {
    id: "ALT-001",
    status: "open" as const,
  },
  {
    id: "ALT-002",
    status: "open" as const,
  },
  {
    id: "ALT-003",
    status: "resolved" as const,
  },
  {
    id: "ALT-004",
    status: "open" as const,
  },
  {
    id: "ALT-005",
    status: "resolved" as const,
  },
];

const AlertSummary = () => {
  const resolvedAlerts = complianceAlerts.filter(
    (a) => a.status === "resolved"
  ).length;

  return (
    <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">
          Alert Summary
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Overview of compliance alerts and their status
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-error/20 bg-error/5 p-4 text-center">
            <p className="text-xl lg:text-2xl font-bold text-foreground">
              {complianceData.complianceAlerts.critical}
            </p>
            <p className="text-sm text-muted-foreground">Critical Alerts</p>
          </div>

          <div className="rounded-2xl border border-warning/20 bg-warning/5 p-4 text-center">
            <p className="text-xl lg:text-2xl font-bold text-foreground">
              {complianceData.complianceAlerts.warning}
            </p>
            <p className="text-sm text-muted-foreground">Warning Alerts</p>
          </div>

          <div className="rounded-2xl border border-info/20 bg-info/5 p-4 text-center">
            <p className="text-xl lg:text-2xl font-bold text-foreground">
              {complianceData.complianceAlerts.info}
            </p>
            <p className="text-sm text-muted-foreground">Info Alerts</p>
          </div>

          <div className="rounded-2xl border border-success/20 bg-success/5 p-4 text-center">
            <p className="text-xl lg:text-2xl font-bold text-foreground">
              {resolvedAlerts}
            </p>
            <p className="text-sm text-muted-foreground">Resolved</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Compliance Health
              </p>
              <p className="text-xs text-muted-foreground">
                {complianceData.complianceAlerts.critical} critical alerts
                require immediate action. Focus on overdue GST filings and
                missing documents to maintain compliance.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertSummary;
