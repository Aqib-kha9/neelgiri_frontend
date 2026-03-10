import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import AlertBadge from "./AlertBadge";

interface TimelineAlertsProps {
  tracking: any;
}

const TimelineAlerts = ({ tracking }: TimelineAlertsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Timeline */}
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-5 w-5 text-primary" />
            Delivery Timeline
          </CardTitle>
          <CardDescription>
            Important dates and expected delivery
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Shipped Date:</span>
              <span className="font-medium">
                {new Date(tracking.timeline.shipped).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Expected Delivery:</span>
              <span className="font-medium">
                {new Date(tracking.timeline.expectedDelivery).toLocaleString(
                  "en-IN"
                )}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Last Update:</span>
              <span className="font-medium">
                {new Date(tracking.timeline.lastUpdate).toLocaleString("en-IN")}
              </span>
            </div>
            {tracking.timeline.actualDelivery && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Actual Delivery:</span>
                <span className="font-medium text-green-600">
                  {new Date(tracking.timeline.actualDelivery).toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Alerts & Notifications */}
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertCircle className="h-5 w-5 text-primary" />
            Alerts & Notifications
          </CardTitle>
          <CardDescription>
            Active alerts and important notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tracking.alerts.length > 0 ? (
              tracking.alerts.map((alert: any, index: number) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200"
                >
                  <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground capitalize">
                        {alert.type.replace("_", " ")}
                      </p>
                      <AlertBadge priority={alert.priority} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {alert.message}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No active alerts
                </p>
                <p className="text-xs text-muted-foreground">
                  Tracking is proceeding normally
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimelineAlerts;
