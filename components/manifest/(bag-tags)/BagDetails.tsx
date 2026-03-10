// app/dashboard/manifest/bag-tags/components/BagDetails.tsx
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
  MapPin,
  Truck,
  Users,
  Building,
  FileText,
  Zap,
  Eye,
  Edit,
  Copy,
  Trash2,
  QrCode,
  Printer,
  Scan,
  Lock,
  Unlock,
  AlertCircle,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import TypeBadge from "./TypeBadge";

interface BagDetailsProps {
  bag: any;
}

const BagDetails = ({ bag }: BagDetailsProps) => {
  return (
    <>
      {/* Bag Summary */}
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardContent className="p-0">
          <div className="p-6 border-b border-border/70">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-purple-100 p-2">
                    <Package className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-bold text-lg text-foreground">
                        {bag.bagNumber}
                      </p>
                      <QrCode className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Bag Tag • {bag.origin.name} to {bag.destination.name}
                    </p>
                  </div>
                </div>
                <StatusBadge status={bag.status} />
                <TypeBadge type={bag.type} />
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    Created:{" "}
                    {new Date(bag.createdTime).toLocaleTimeString("en-IN")}
                  </p>
                  <p className="text-xs text-muted-foreground">Last updated</p>
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
                      Edit Bag Tag
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                      <Copy className="h-4 w-4" />
                      Clone Tag
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-red-600">
                      <Trash2 className="h-4 w-4" />
                      Delete Tag
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bag Information */}
              <div className="space-y-4">
                {/* Route Information */}
                <div className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-semibold text-foreground">
                      Route Information
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Origin</p>
                        <p className="text-lg font-bold text-blue-600">
                          {bag.origin.code}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {bag.origin.name}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Destination
                        </p>
                        <p className="text-lg font-bold text-green-600">
                          {bag.destination.code}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {bag.destination.name}
                        </p>
                      </div>
                    </div>

                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Manifest</p>
                      <p className="text-lg font-bold text-purple-600">
                        {bag.manifestNumber}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Linked manifest
                      </p>
                    </div>
                  </div>
                </div>

                {/* Capacity Information */}
                <div className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-semibold text-foreground">
                      Capacity Information
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Shipments:</span>
                      <span className="font-medium">
                        {bag.shipments.current}/{bag.shipments.capacity}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-600 h-2 rounded-full"
                        style={{
                          width: `${
                            (bag.shipments.current / bag.shipments.capacity) *
                            100
                          }%`,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Weight:</span>
                      <span className="font-medium">
                        {bag.weight.current}/{bag.weight.capacity} kg
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: `${
                            (bag.weight.current / bag.weight.capacity) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Processing & Details */}
              <div className="space-y-4">
                {/* Processing Information */}
                <div className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Truck className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-semibold text-foreground">
                      Processing Information
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Created By:</span>
                      <span className="font-medium">{bag.createdBy}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Created:</span>
                      <span className="font-medium">
                        {new Date(bag.createdTime).toLocaleString("en-IN")}
                      </span>
                    </div>
                    {bag.sealedTime && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Sealed:</span>
                        <span className="font-medium">
                          {new Date(bag.sealedTime).toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}
                    {bag.dispatchTime && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Dispatched:
                        </span>
                        <span className="font-medium">
                          {new Date(bag.dispatchTime).toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bag Details */}
                <div className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-semibold text-foreground">
                      Bag Details
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Bag Type:</span>
                      <TypeBadge type={bag.type} />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Service Type:
                      </span>
                      <span className="font-medium">{bag.serviceType}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Seal Number:
                      </span>
                      <span className="font-medium">
                        {bag.sealNumber || "Not sealed"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Vehicle:</span>
                      <span className="font-medium">
                        {bag.vehicleNumber || "Not assigned"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bag Actions */}
      {bag.status !== "sealed" &&
        bag.status !== "in_transit" &&
        bag.status !== "delivered" && (
          <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Zap className="h-5 w-5 text-primary" />
                Bag Actions
              </CardTitle>
              <CardDescription>Manage and process this bag tag</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <Button className="gap-2 rounded-lg bg-blue-600 hover:bg-blue-700">
                  <Package className="h-4 w-4" />
                  Add Shipments
                </Button>

                <Button
                  variant="outline"
                  className="gap-2 rounded-lg border-green-500 text-green-600 hover:bg-green-50"
                >
                  <Lock className="h-4 w-4" />
                  Seal Bag
                </Button>

                <Button
                  variant="outline"
                  className="gap-2 rounded-lg border-orange-500 text-orange-600 hover:bg-orange-50"
                >
                  <Printer className="h-4 w-4" />
                  Print Tag
                </Button>

                <Button
                  variant="outline"
                  className="gap-2 rounded-lg border-purple-500 text-purple-600 hover:bg-purple-50"
                >
                  <Scan className="h-4 w-4" />
                  Scan QR
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

      {/* Bag Notes */}
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-5 w-5 text-primary" />
            Bag Notes
          </CardTitle>
          <CardDescription>
            Additional information and special instructions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bag.notes ? (
              <div className="bg-muted/30 rounded-xl p-4">
                <p className="text-sm text-foreground">{bag.notes}</p>
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-xl p-8 bg-muted/30 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-sm text-muted-foreground">
                  No bag notes yet
                </p>
              </div>
            )}

            {bag.issues.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800">
                    Issues
                  </span>
                </div>
                <ul className="text-sm text-red-700 space-y-1">
                  {bag.issues.map((issue: string, index: number) => (
                    <li key={index}>• {issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default BagDetails;
