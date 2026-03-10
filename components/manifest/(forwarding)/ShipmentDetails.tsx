// app/dashboard/manifest/forwarding/create/components/ShipmentDetails.tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Package,
  Truck,
  MapPin,
  Users,
  Building,
  FileText,
  IndianRupee,
  Zap,
  Eye,
  Edit,
  Copy,
  Trash2,
  QrCode,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";

interface ShipmentDetailsProps {
  shipment: any;
}

const ShipmentDetails = ({ shipment }: ShipmentDetailsProps) => {
  return (
    <>
      {/* Shipment Summary */}
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardContent className="p-0">
          <div className="p-6 border-b border-border/70">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-green-100 p-2">
                    <Truck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-bold text-lg text-foreground">
                        {shipment.awbNumber}
                      </p>
                      <QrCode className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Forwarding Shipment • {shipment.consignor.name} to{" "}
                      {shipment.consignee.name}
                    </p>
                  </div>
                </div>
                <StatusBadge status={shipment.status} />
                <PriorityBadge priority={shipment.priority} />
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    Received:{" "}
                    {new Date(shipment.receivedTime).toLocaleTimeString(
                      "en-IN"
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Processing Time
                  </p>
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
                {/* Consignor Information */}
                <div className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Building className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-semibold text-foreground">
                      Consignor Information
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {shipment.consignor.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {shipment.consignor.phone}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span>{shipment.consignor.address}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {shipment.consignor.city} - {shipment.consignor.pincode}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Origin Information */}
                <div className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Building className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-semibold text-foreground">
                      Origin Hub
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {shipment.origin.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {shipment.origin.code}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span>{shipment.origin.address}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Destination & Forwarding */}
              <div className="space-y-4">
                {/* Consignee Information */}
                <div className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-semibold text-foreground">
                      Consignee Information
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {shipment.consignee.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {shipment.consignee.phone}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span>{shipment.consignee.address}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {shipment.consignee.city} - {shipment.consignee.pincode}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Destination Information */}
                <div className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Building className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-semibold text-foreground">
                      Destination Hub
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {shipment.destination.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {shipment.destination.code}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span>{shipment.destination.address}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Package & Forwarding Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Package Details */}
        <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Package className="h-5 w-5 text-primary" />
              Package Details
            </CardTitle>
            <CardDescription>
              Package information and specifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Package Type</p>
                  <p className="font-medium">{shipment.package.type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Description</p>
                  <p className="font-medium">{shipment.package.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Weight</p>
                  <p className="font-medium">{shipment.package.weight}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Dimensions</p>
                  <p className="font-medium">{shipment.package.dimensions}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Declared Value</p>
                  <p className="font-medium">
                    {shipment.package.declaredValue}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">COD Amount</p>
                  <p className="font-medium text-green-600">
                    {shipment.package.codAmount}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Forwarding Details */}
        <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Truck className="h-5 w-5 text-primary" />
              Forwarding Details
            </CardTitle>
            <CardDescription>Manifest and routing information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Service Type</p>
                  <p className="font-medium">{shipment.service.type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Payment Type</p>
                  <p className="font-medium">{shipment.service.payment}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Freight Charges:
                  </span>
                  <span className="font-medium">
                    {shipment.charges.freight}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Handling Charges:
                  </span>
                  <span className="font-medium">
                    {shipment.charges.handling}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">COD Fee:</span>
                  <span className="font-medium">{shipment.charges.codFee}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold border-t pt-2">
                  <span>Total Charges:</span>
                  <span className="text-green-600">
                    {shipment.charges.total}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forwarding Actions */}
      {shipment.status !== "delivered" && (
        <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="h-5 w-5 text-primary" />
              Forwarding Actions
            </CardTitle>
            <CardDescription>
              Take action to forward this shipment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button className="gap-2 rounded-lg bg-blue-600 hover:bg-blue-700">
                <Truck className="h-4 w-4" />
                Add to Manifest
              </Button>

              <Button
                variant="outline"
                className="gap-2 rounded-lg border-green-500 text-green-600 hover:bg-green-50"
              >
                <FileText className="h-4 w-4" />
                Generate Label
              </Button>

              <Button
                variant="outline"
                className="gap-2 rounded-lg border-orange-500 text-orange-600 hover:bg-orange-50"
              >
                <Package className="h-4 w-4" />
                Scan Package
              </Button>

              <Button
                variant="outline"
                className="gap-2 rounded-lg border-purple-500 text-purple-600 hover:bg-purple-50"
              >
                <Edit className="h-4 w-4" />
                Update Status
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ShipmentDetails;
