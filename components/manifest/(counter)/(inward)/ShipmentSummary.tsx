import {
  Package,
  QrCode,
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  Trash2,
  Building,
  Users,
  MapPin,
  RefreshCw,
  Shield,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import VerificationBadge from "./VerificationBadge";

interface ShipmentSummaryProps {
  selectedShipment: any;
}

const ShipmentSummary = ({ selectedShipment }: ShipmentSummaryProps) => {
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
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-0">
        <div className="p-6 border-b border-border/70">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-100 p-2">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-mono font-bold text-lg text-foreground">
                      {selectedShipment.awbNumber}
                    </p>
                    <QrCode className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Inward Shipment • {selectedShipment.receiver.name}
                  </p>
                </div>
              </div>
              <StatusBadge status={selectedShipment.status} />
              <PriorityBadge priority={selectedShipment.priority} />
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  Received:{" "}
                  {new Date(selectedShipment.receivedTime).toLocaleTimeString(
                    "en-IN"
                  )}
                </p>
                <p className="text-xs text-muted-foreground">Processing Time</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg border-border/70"
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                    <Eye className="h-4 w-4" />
                    View Full Details
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                    <Edit className="h-4 w-4" />
                    Edit Shipment
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                    <Copy className="h-4 w-4" />
                    Clone Entry
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-red-600">
                    <Trash2 className="h-4 w-4" />
                    Delete Entry
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Origin & Destination */}
            <div className="space-y-4">
              {/* Origin Information */}
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Building className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-foreground">
                    Origin Information
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {selectedShipment.origin.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedShipment.origin.code}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="rounded-full capitalize"
                    >
                      {selectedShipment.origin.type}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span>{selectedShipment.origin.address}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {selectedShipment.origin.city} -{" "}
                      {selectedShipment.origin.pincode}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Received:</span>
                    <span className="font-medium">
                      {new Date(selectedShipment.receivedTime).toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Receiver Information */}
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-foreground">
                    Receiver Information
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {selectedShipment.receiver.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedShipment.receiver.phone}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span>{selectedShipment.receiver.address}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {selectedShipment.receiver.city} -{" "}
                      {selectedShipment.receiver.pincode}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Processing & Verification */}
            <div className="space-y-4">
              {/* Processing Status */}
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <RefreshCw className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-semibold text-foreground">
                    Processing Status
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Assigned To:</span>
                    <span className="font-medium">
                      {selectedShipment.processing.assignedTo || "Unassigned"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          selectedShipment.processing.scanned
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                      <span>Scanned</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          selectedShipment.processing.weighed
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                      <span>Weighed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          selectedShipment.processing.verified
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                      <span>Verified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          selectedShipment.processing.documented
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                      <span>Documented</span>
                    </div>
                  </div>

                  <Progress
                    value={getProcessingProgress(selectedShipment)}
                    className="h-2"
                  />
                </div>
              </div>

              {/* Verification Checks */}
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-semibold text-foreground">
                    Verification Checks
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Weight Check:</span>
                    <VerificationBadge
                      status={selectedShipment.verification.weightCheck}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Document Check:
                    </span>
                    <VerificationBadge
                      status={selectedShipment.verification.documentCheck}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Value Check:</span>
                    <VerificationBadge
                      status={selectedShipment.verification.valueCheck}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Security Check:
                    </span>
                    <VerificationBadge
                      status={selectedShipment.verification.securityCheck}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipmentSummary;
