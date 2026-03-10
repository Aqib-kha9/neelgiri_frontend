import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, AlertCircle, QrCode } from "lucide-react";
import StatusBadge from "./StatusBadge";

interface TrackingListProps {
  trackingData: any[];
  selectedTracking: any;
  setSelectedTracking: (tracking: any) => void;
}

const TrackingList = ({
  trackingData,
  selectedTracking,
  setSelectedTracking,
}: TrackingListProps) => {
  return (
    <div className="xl:col-span-1 space-y-4">
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardContent className="p-6">
          <div className="space-y-3">
            {trackingData.map((tracking) => (
              <Card
                key={tracking.id}
                className={`cursor-pointer transition-all border-2 ${
                  selectedTracking.id === tracking.id
                    ? "border-primary shadow-lg"
                    : "border-border/70 hover:border-primary/50"
                } rounded-xl`}
                onClick={() => setSelectedTracking(tracking)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="font-mono font-semibold text-foreground">
                          {tracking.awbNumber}
                        </p>
                        <QrCode className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <StatusBadge status={tracking.status} />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Customer:</span>
                        <span className="font-medium">
                          {tracking.customer.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">City:</span>
                        <span className="font-medium">
                          {tracking.customer.city}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Last Update:
                        </span>
                        <span className="font-medium">
                          {tracking.location.lastScan}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm">
                        <p className="text-muted-foreground">Current Status</p>
                        <p className="font-medium truncate">
                          {tracking.currentStatus}
                        </p>
                      </div>
                    </div>

                    {tracking.alerts.length > 0 && (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-3 w-3 text-red-500" />
                        <span className="text-xs text-red-600">
                          {tracking.alerts.length} alert
                          {tracking.alerts.length > 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {trackingData.length === 0 && (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">
                  No tracking records found
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackingList;
