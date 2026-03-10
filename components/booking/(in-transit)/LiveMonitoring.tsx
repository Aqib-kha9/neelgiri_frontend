import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, CheckCircle2, AlertCircle, Navigation, BarChart3 } from "lucide-react";
import { Shipment } from "./types";

interface LiveMonitoringProps {
  shipments: Shipment[];
}

export const LiveMonitoring = ({ shipments }: LiveMonitoringProps) => {
  const getTotalDelayed = () => {
    return shipments.filter((shipment) => shipment.delay > 0).length;
  };

  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <BarChart3 className="h-5 w-5 text-primary" />
          Live Monitoring
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Real-time tracking and alerts for in-transit shipments
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="rounded-xl border-blue-200 bg-blue-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {
                      shipments.filter((s) => s.currentStatus === "in_transit")
                        .length
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Currently Moving
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-green-200 bg-green-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {shipments.filter((s) => s.delay === 0).length}
                  </p>
                  <p className="text-sm text-muted-foreground">On Schedule</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-red-200 bg-red-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-red-100 p-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {shipments.filter((s) => s.delay > 0).length}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Requiring Attention
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <Navigation className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Real-time Tracking Active
              </p>
              <p className="text-xs text-muted-foreground">
                All in-transit shipments are being monitored in real-time.
                {getTotalDelayed() > 0 &&
                  ` ${getTotalDelayed()} shipments require immediate attention due to delays.`}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
