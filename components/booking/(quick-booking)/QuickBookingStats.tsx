import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, CheckCircle2, Clock, FileSpreadsheet } from "lucide-react";
import { BulkShipment } from "./types";

interface QuickBookingStatsProps {
  bulkShipments: BulkShipment[];
  bookingTemplates: any[];
}

export const QuickBookingStats = ({
  bulkShipments,
  bookingTemplates,
}: QuickBookingStatsProps) => {
  const getTotalProcessedToday = () => {
    return bulkShipments
      .filter(
        (shipment) =>
          shipment.status === "completed" || shipment.status === "processing"
      )
      .reduce((sum, shipment) => sum + shipment.processed, 0);
  };

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

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-blue-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Total Bulk Shipments
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {bulkShipments.length}
                </span>
                <Badge
                  variant="default"
                  className="rounded-full text-xs bg-green-100 text-green-800"
                >
                  Active
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Across all templates
              </p>
            </div>
            <div className="rounded-2xl bg-blue-100 p-3">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-green-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Processed Today
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {getTotalProcessedToday()}
                </span>
                <Badge
                  variant="default"
                  className="rounded-full text-xs bg-green-100 text-green-800"
                >
                  {getSuccessRate()}% Success
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Shipments processed
              </p>
            </div>
            <div className="rounded-2xl bg-green-100 p-3">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-orange-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Pending Processing
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {bulkShipments
                    .filter(
                      (s) => s.status === "processing" || s.status === "draft"
                    )
                    .reduce(
                      (sum, s) => sum + (s.totalShipments - s.processed),
                      0
                    )}
                </span>
                <Badge variant="secondary" className="rounded-full text-xs">
                  Pending
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting processing
              </p>
            </div>
            <div className="rounded-2xl bg-orange-100 p-3">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-purple-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Templates Available
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {bookingTemplates.length}
                </span>
                <Badge variant="secondary" className="rounded-full text-xs">
                  Customizable
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Pre-built templates
              </p>
            </div>
            <div className="rounded-2xl bg-purple-100 p-3">
              <FileSpreadsheet className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
