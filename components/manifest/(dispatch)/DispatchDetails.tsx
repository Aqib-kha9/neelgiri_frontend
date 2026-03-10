// app/dashboard/manifest/dispatch/components/DispatchDetails.tsx
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
  Truck,
  MapPin,
  Users,
  Package,
  Clock,
  FileText,
  Zap,
  Eye,
  Edit,
  Copy,
  Trash2,
  Phone,
  Navigation,
  AlertCircle,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";

interface DispatchDetailsProps {
  dispatch: any;
}

const DispatchDetails = ({ dispatch }: DispatchDetailsProps) => {
  return (
    <>
      {/* Dispatch Summary */}
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardContent className="p-0">
          <div className="p-6 border-b border-border/70">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-red-100 p-2">
                    <Truck className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-bold text-lg text-foreground">
                        {dispatch.manifestNumber}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {dispatch.vehicleNumber}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Dispatch • {dispatch.origin.name} to{" "}
                      {dispatch.destination.name}
                    </p>
                  </div>
                </div>
                <StatusBadge status={dispatch.status} />
                <PriorityBadge priority={dispatch.priority} />
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    ETA:{" "}
                    {new Date(dispatch.estimatedTime).toLocaleTimeString(
                      "en-IN"
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Estimated arrival
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
                      Edit Dispatch
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                      <Copy className="h-4 w-4" />
                      Clone Dispatch
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-red-600">
                      <Trash2 className="h-4 w-4" />
                      Cancel Dispatch
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Vehicle & Driver Information */}
              <div className="space-y-4">
                {/* Vehicle Information */}
                <div className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-semibold text-foreground">
                      Vehicle Information
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {dispatch.vehicleNumber}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {dispatch.vehicle.type} • {dispatch.vehicle.capacity}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="rounded-full capitalize"
                      >
                        {dispatch.vehicle.type}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Model</p>
                        <p className="font-medium">{dispatch.vehicle.model}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Year</p>
                        <p className="font-medium">{dispatch.vehicle.year}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Insurance:</span>
                      <span className="font-medium">
                        {dispatch.vehicle.insuranceStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Driver Information */}
                <div className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-semibold text-foreground">
                      Driver Information
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {dispatch.driver.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {dispatch.driver.licenseNumber}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Phone</p>
                        <p className="font-medium">{dispatch.driver.phone}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Experience</p>
                        <p className="font-medium">
                          {dispatch.driver.experience}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge
                        variant={
                          dispatch.driver.status === "active"
                            ? "success"
                            : "secondary"
                        }
                        className="rounded-full text-xs"
                      >
                        {dispatch.driver.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Route & Load Information */}
              <div className="space-y-4">
                {/* Route Information */}
                <div className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-semibold text-foreground">
                      Route Information
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Origin</p>
                        <p className="text-lg font-bold text-blue-600">
                          {dispatch.origin.code}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {dispatch.origin.name}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Destination
                        </p>
                        <p className="text-lg font-bold text-green-600">
                          {dispatch.destination.code}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {dispatch.destination.name}
                        </p>
                      </div>
                    </div>

                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Distance & ETA
                      </p>
                      <p className="text-lg font-bold text-purple-600">
                        {dispatch.route.distance}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ETA:{" "}
                        {new Date(dispatch.estimatedTime).toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Load Information */}
                <div className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-semibold text-foreground">
                      Load Information
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total Bags:</span>
                      <span className="font-medium">{dispatch.bagsCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Total Shipments:
                      </span>
                      <span className="font-medium">
                        {dispatch.shipmentsCount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Total Weight:
                      </span>
                      <span className="font-medium">
                        {dispatch.totalWeight}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Capacity Used:
                      </span>
                      <span className="font-medium">
                        {dispatch.capacityUsed}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dispatch Actions */}
      {dispatch.status !== "delivered" && dispatch.status !== "cancelled" && (
        <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="h-5 w-5 text-primary" />
              Dispatch Actions
            </CardTitle>
            <CardDescription>Manage and track this dispatch</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button className="gap-2 rounded-lg bg-blue-600 hover:bg-blue-700">
                <Truck className="h-4 w-4" />
                Start Dispatch
              </Button>

              <Button
                variant="outline"
                className="gap-2 rounded-lg border-green-500 text-green-600 hover:bg-green-50"
              >
                <Phone className="h-4 w-4" />
                Contact Driver
              </Button>

              <Button
                variant="outline"
                className="gap-2 rounded-lg border-orange-500 text-orange-600 hover:bg-orange-50"
              >
                <Navigation className="h-4 w-4" />
                Track Vehicle
              </Button>

              <Button
                variant="outline"
                className="gap-2 rounded-lg border-purple-500 text-purple-600 hover:bg-purple-50"
              >
                <Clock className="h-4 w-4" />
                Update ETA
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dispatch Timeline & Notes */}
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-5 w-5 text-primary" />
            Dispatch Timeline & Notes
          </CardTitle>
          <CardDescription>
            Tracking information and special instructions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Timeline */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground">
                Dispatch Timeline
              </h4>
              <div className="space-y-3">
                {dispatch.timeline.map((event: any, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          event.status === "completed"
                            ? "bg-green-500"
                            : event.status === "in_progress"
                            ? "bg-blue-500"
                            : "bg-gray-300"
                        }`}
                      />
                      {index < dispatch.timeline.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-200" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {event.event}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.timestamp).toLocaleString("en-IN")}
                      </p>
                      {event.notes && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {event.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes & Alerts */}
            <div className="space-y-4">
              {dispatch.notes && (
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-sm text-foreground">{dispatch.notes}</p>
                </div>
              )}

              {dispatch.alerts.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">
                      Alerts
                    </span>
                  </div>
                  <ul className="text-sm text-red-700 space-y-1">
                    {dispatch.alerts.map((alert: string, index: number) => (
                      <li key={index}>• {alert}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default DispatchDetails;
