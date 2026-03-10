// app/dashboard/manifest/forwarding/create/components/ShipmentList.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, QrCode, AlertCircle } from "lucide-react";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";

interface ShipmentListProps {
  shipments: any[];
  selectedShipment: any;
  setSelectedShipment: (shipment: any) => void;
}

const ShipmentList = ({
  shipments,
  selectedShipment,
  setSelectedShipment,
}: ShipmentListProps) => {
  const getProgressPercentage = (shipment: any) => {
    const steps = [
      shipment.forwarding.scanned,
      shipment.forwarding.documented,
      shipment.forwarding.manifested,
    ];
    const completed = steps.filter((step) => step).length;
    return (completed / steps.length) * 100;
  };

  return (
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
                      <span className="text-muted-foreground">Consignor:</span>
                      <span className="font-medium">
                        {shipment.consignor.name}
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
                        {Math.round(getProgressPercentage(shipment))}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${getProgressPercentage(shipment)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <StatusBadge status={shipment.status} />
                      <div className="text-xs text-muted-foreground">
                        {new Date(shipment.receivedTime).toLocaleTimeString(
                          "en-IN"
                        )}
                      </div>
                    </div>
                  </div>

                  {shipment.forwarding.issues.length > 0 && (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-3 w-3 text-red-500" />
                      <span className="text-xs text-red-600">
                        {shipment.forwarding.issues.length} issues
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
              <p className="text-muted-foreground">No shipments found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipmentList;
