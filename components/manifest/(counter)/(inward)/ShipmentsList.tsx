import { Package, QrCode, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";

interface ShipmentsListProps {
  shipments: any[];
  selectedShipment: any;
  setSelectedShipment: (shipment: any) => void;
}

const ShipmentsList = ({
  shipments,
  selectedShipment,
  setSelectedShipment,
}: ShipmentsListProps) => {
  const getProcessingProgress = (shipment: any) => {
    const steps = [
      shipment.processing.scanned,
      shipment.processing.weighed,
      shipment.processing.verified,
      shipment.processing.documented,
    ];
    const completed = steps.filter((step) => step).length;
    return (completed / steps.length) * 100;
  };

  return (
    <div className="xl:col-span-1 space-y-4">
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardContent className="p-6">
          <div className="space-y-3">
            {shipments.map((shipment) => (
              <Card
                key={shipment.id}
                className={`cursor-pointer transition-all border-2 ${
                  selectedShipment.id === shipment.id
                    ? "border-primary shadow-lg"
                    : "border-border/70 hover:border-primary/50"
                } rounded-xl`}
                onClick={() => setSelectedShipment(shipment)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="font-mono font-semibold text-foreground">
                          {shipment.awbNumber}
                        </p>
                        <QrCode className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <PriorityBadge priority={shipment.priority} />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Receiver:</span>
                        <span className="font-medium">
                          {shipment.receiver.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Origin:</span>
                        <span className="font-medium">
                          {shipment.origin.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress:</span>
                        <span className="font-medium">
                          {Math.round(getProcessingProgress(shipment))}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Progress
                        value={getProcessingProgress(shipment)}
                        className="h-2"
                      />
                      <div className="flex items-center justify-between">
                        <StatusBadge status={shipment.status} />
                        <div className="text-xs text-muted-foreground">
                          {new Date(shipment.receivedTime).toLocaleTimeString(
                            "en-IN"
                          )}
                        </div>
                      </div>
                    </div>

                    {shipment.verification.weightCheck === "failed" && (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-3 w-3 text-red-500" />
                        <span className="text-xs text-red-600">
                          Weight discrepancy
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {shipments.length === 0 && (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">
                  No inward shipments found
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShipmentsList;
