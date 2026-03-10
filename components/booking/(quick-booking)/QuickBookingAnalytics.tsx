import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Package, CheckCircle2, Clock, Zap, BarChart3 } from "lucide-react";
import { BulkShipment } from "./types";
import { bookingTemplates } from "./config";

interface QuickBookingAnalyticsProps {
  bulkShipments: BulkShipment[];
}

export const QuickBookingAnalytics = ({
  bulkShipments,
}: QuickBookingAnalyticsProps) => {
  const getSuccessRate = () => {
    const totalProcessed = bulkShipments.reduce(
      (sum, shipment) => sum + shipment.processed,
      0
    );
    const totalFailed = bulkShipments.reduce(
      (sum, shipment) => sum + shipment.failed,
      0
    );
    const total = totalProcessed + totalFailed;
    return total > 0 ? Math.round((totalProcessed / total) * 100) : 100;
  };

  const getTotalProcessedToday = () => {
    return bulkShipments
      .filter(
        (shipment) =>
          shipment.status === "completed" || shipment.status === "processing"
      )
      .reduce((sum, shipment) => sum + shipment.processed, 0);
  };

  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <BarChart3 className="h-5 w-5 text-primary" />
          Bulk Booking Analytics
        </CardTitle>
        <CardDescription>
          Performance metrics and processing statistics for your bulk shipments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-xl border-blue-200 bg-blue-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {bulkShipments.reduce(
                      (sum, batch) => sum + batch.totalShipments,
                      0
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total Shipments
                  </p>
                  <p className="text-xs text-blue-600">
                    Across {bulkShipments.length} batches
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
                    {getSuccessRate()}%
                  </p>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-xs text-green-600">
                    {getTotalProcessedToday()} processed today
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-orange-200 bg-orange-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-orange-100 p-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {
                      bulkShipments.filter((b) => b.status === "processing")
                        .length
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Active Batches
                  </p>
                  <p className="text-xs text-orange-600">
                    Currently processing
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-purple-200 bg-purple-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-100 p-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {bookingTemplates.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Templates</p>
                  <p className="text-xs text-purple-600">Available for use</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50/50 p-4">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Quick Booking Tips
              </p>
              <p className="text-xs text-muted-foreground">
                Use templates to speed up your bulk processing. Download our CSV
                template to ensure proper formatting, and leverage batch
                operations for faster shipment management.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
