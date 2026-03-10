import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "./StatusBadge";
import { TransportBadge } from "./TransportBadge";
import { TransitProgress } from "./TransitProgress";
import { Shipment } from "./types";
import {
  Package,
  Calendar,
  Clock,
  MapPin,
  Users,
  BarChart3,
  Eye,
  RefreshCw,
  MoreHorizontal,
  Download,
  Phone,
  Mail,
  QrCode,
  Sparkles,
  AlertCircle,
} from "lucide-react";

interface TransitCardProps {
  shipment: Shipment;
}

export const TransitCard = ({ shipment }: TransitCardProps) => {
  return (
    <Card
      key={shipment.id}
      className="rounded-2xl border-border/70 bg-card/95 shadow-card hover:shadow-lg transition-all duration-300"
    >
      <CardContent className="p-0">
        {/* Header Section */}
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
                      {shipment.awbNumber}
                    </p>
                    <QrCode className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ID: {shipment.id}
                  </p>
                </div>
              </div>
              <StatusBadge status={shipment.currentStatus} />
              {shipment.delay > 0 && (
                <Badge variant="error" className="rounded-full gap-1">
                  <Clock className="h-3 w-3" />
                  {shipment.delay} min delay
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  ETA:{" "}
                  {new Date(shipment.estimatedArrival).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="w-px h-4 bg-border/70"></div>
              <span>Updated: {shipment.lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Route & Progress */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-foreground">
                    Transit Route
                  </span>
                </div>
                <div className="space-y-3">
                  <TransitProgress
                    route={shipment.transitRoute}
                    currentLocation={shipment.currentLocation}
                  />

                  <div className="space-y-2">
                    {shipment.transitRoute.map((step, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-3 text-sm ${
                          step.location === shipment.currentLocation
                            ? "text-blue-600 font-semibold"
                            : step.status === "processed"
                            ? "text-green-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            step.location === shipment.currentLocation
                              ? "bg-blue-600"
                              : step.status === "processed"
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        />
                        <div className="flex-1">
                          <p className="font-medium">{step.location}</p>
                          <p className="text-xs text-muted-foreground">
                            {step.timestamp &&
                              new Date(step.timestamp).toLocaleString("en-IN")}
                          </p>
                        </div>
                        {step.location === shipment.currentLocation && (
                          <Sparkles className="h-3 w-3 text-blue-600" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Shipment Details */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-foreground">
                    Shipment Details
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">From</p>
                      <p className="text-sm font-medium">
                        {shipment.sender.city}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">To</p>
                      <p className="text-sm font-medium">
                        {shipment.receiver.city}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Transport:</span>
                      <TransportBadge transport={shipment.transportMode} />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Vehicle:</span>
                      <span className="font-medium">{shipment.vehicleId}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Driver:</span>
                      <span className="font-medium text-right">
                        {shipment.driver}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Package & Service */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-semibold text-foreground">
                    Package & Service
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Type</p>
                      <p className="text-sm font-medium">
                        {shipment.package.type}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Weight</p>
                      <p className="text-sm font-medium">
                        {shipment.package.weight}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Description</p>
                    <p className="text-sm font-medium">
                      {shipment.package.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Service:</span>
                      <span className="font-medium">
                        {shipment.service.type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Partner:</span>
                      <span className="font-medium">{shipment.partner}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Monitoring & Actions */}
            <div className="space-y-4">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    Monitoring
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Temperature:
                      </span>
                      <Badge
                        variant={
                          shipment.temperature === "Normal"
                            ? "success"
                            : "warning"
                        }
                        className="rounded-full"
                      >
                        {shipment.temperature}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Handling:</span>
                      <Badge variant="outline" className="rounded-full">
                        {shipment.specialHandling}
                      </Badge>
                    </div>
                  </div>

                  {shipment.delayReason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-red-700">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Delay Reason
                        </span>
                      </div>
                      <p className="text-xs text-red-600 mt-1">
                        {shipment.delayReason}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  className="gap-2 rounded-lg bg-primary text-primary-foreground"
                >
                  <Eye className="h-3 w-3" />
                  Live Track
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 rounded-lg border-border/70"
                >
                  <RefreshCw className="h-3 w-3" />
                  Update Status
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 rounded-lg border-border/70"
                >
                  <MapPin className="h-3 w-3" />
                  View Route
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-lg border-border/70"
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl">
                    <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                      <Download className="h-4 w-4" />
                      Download Documents
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                      <Phone className="h-4 w-4" />
                      Contact Driver
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                      <Mail className="h-4 w-4" />
                      Notify Customer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
