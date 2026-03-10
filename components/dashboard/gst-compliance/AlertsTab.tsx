import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  AlertCircle,
  Shield,
  FileText,
  IndianRupee,
  FileCheck,
} from "lucide-react";
import AlertSummary from "./AlertSummary";

const complianceAlerts = [
  {
    id: "ALT-001",
    branch: "Chennai Coastal Hub",
    type: "gst_filing" as const,
    severity: "critical" as const,
    title: "GSTR-3B Overdue",
    description: "October 2024 GSTR-3B filing is overdue by 15 days",
    date: "2024-12-05",
    status: "open" as const,
  },
  {
    id: "ALT-002",
    branch: "Pune IT Park",
    type: "gst_filing" as const,
    severity: "critical" as const,
    title: "GSTR-3B Overdue",
    description: "October 2024 GSTR-3B filing is overdue by 25 days",
    date: "2024-12-05",
    status: "open" as const,
  },
  {
    id: "ALT-003",
    branch: "Hyderabad Tech City",
    type: "document" as const,
    severity: "warning" as const,
    title: "Missing GST Certificate",
    description: "Updated GST certificate not uploaded for FY 2024-25",
    date: "2024-12-04",
    status: "open" as const,
  },
  {
    id: "ALT-004",
    branch: "Delhi North Gateway",
    type: "tax_payment" as const,
    severity: "warning" as const,
    title: "Tax Payment Due",
    description: "Q3 advance tax payment due in 7 days",
    date: "2024-12-03",
    status: "open" as const,
  },
  {
    id: "ALT-005",
    branch: "Multiple Branches",
    type: "compliance" as const,
    severity: "info" as const,
    title: "Annual Compliance Review",
    description: "Annual compliance audit scheduled for next month",
    date: "2024-12-02",
    status: "open" as const,
  },
];

const getAlertSeverityBadge = (severity: string) => {
  switch (severity) {
    case "critical":
      return (
        <Badge variant="error" className="rounded-full text-xs">
          Critical
        </Badge>
      );
    case "warning":
      return (
        <Badge variant="warning" className="rounded-full text-xs">
          Warning
        </Badge>
      );
    case "info":
      return (
        <Badge variant="info" className="rounded-full text-xs">
          Info
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className="rounded-full text-xs">
          Unknown
        </Badge>
      );
  }
};

const getAlertIcon = (type: string) => {
  switch (type) {
    case "gst_filing":
      return <FileText className="h-4 w-4" />;
    case "tax_payment":
      return <IndianRupee className="h-4 w-4" />;
    case "document":
      return <FileCheck className="h-4 w-4" />;
    case "compliance":
      return <Shield className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
};

const AlertsTab = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Critical Alerts */}
        <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
              <AlertTriangle className="h-5 w-5 text-error" />
              Critical Alerts
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Urgent issues requiring immediate attention
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {complianceAlerts
              .filter((alert) => alert.severity === "critical")
              .map((alert) => (
                <div
                  key={alert.id}
                  className="rounded-2xl border border-error/20 bg-error/5 p-4"
                >
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.type)}
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">
                          {alert.title}
                        </p>
                        {getAlertSeverityBadge(alert.severity)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {alert.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          {alert.branch}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(alert.date).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      className="rounded-lg bg-error text-error-foreground text-xs"
                    >
                      Resolve Now
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-lg border-error/20 text-error text-xs"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Warning Alerts */}
        <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
              <AlertCircle className="h-5 w-5 text-warning" />
              Warning Alerts
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Issues that need attention soon
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {complianceAlerts
              .filter((alert) => alert.severity === "warning")
              .map((alert) => (
                <div
                  key={alert.id}
                  className="rounded-2xl border border-warning/20 bg-warning/5 p-4"
                >
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.type)}
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">
                          {alert.title}
                        </p>
                        {getAlertSeverityBadge(alert.severity)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {alert.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          {alert.branch}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(alert.date).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      className="rounded-lg bg-warning text-warning-foreground text-xs"
                    >
                      Take Action
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-lg border-warning/20 text-xs"
                    >
                      Remind Later
                    </Button>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Information Alerts */}
        <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
              <Shield className="h-5 w-5 text-info" />
              Information & Updates
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Important compliance updates and notifications
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {complianceAlerts
                .filter((alert) => alert.severity === "info")
                .map((alert) => (
                  <div
                    key={alert.id}
                    className="rounded-2xl border border-info/20 bg-info/5 p-4"
                  >
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.type)}
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground">
                            {alert.title}
                          </p>
                          {getAlertSeverityBadge(alert.severity)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {alert.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            {alert.branch}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(alert.date).toLocaleDateString("en-IN")}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-lg border-info/20 text-xs"
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-lg border-info/20 text-xs"
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertSummary />
    </div>
  );
};

export default AlertsTab;
