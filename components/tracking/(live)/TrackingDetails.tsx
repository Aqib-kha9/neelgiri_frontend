import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import ConfidenceBadge from "./ConfidenceBadge";
import MapPlaceholder from "./MapPlaceholder";
import RouteProgress from "./RouteProgress";
import ProgressTracker from "./ProgressTracker";
import {
  statusConfig,
  priorityConfig,
  confidenceConfig,
} from "./data/statusConfig";
import {
  RefreshCw,
  Share2,
  MoreHorizontal,
  Navigation,
  QrCode,
  MapPin,
  Truck,
  Clock,
  User,
  Package,
  PhoneCall,
  MessageCircle,
  Eye,
  Download,
} from "lucide-react";

interface TrackingDetailsProps {
  selectedShipment: any;
  lastUpdated: Date;
  setLastUpdated: (date: Date) => void;
}

const TrackingDetails = ({
  selectedShipment,
  setLastUpdated,
}: TrackingDetailsProps) => {
  const handleRefresh = () => {
    setLastUpdated(new Date());
    // In real app, this would fetch updated data
  };

  const handleShareTracking = (shipment: any) => {
    // In real app, this would share tracking link
    console.log("Share tracking:", shipment.awbNumber);
  };

  const handleContactCarrier = (carrier: any) => {
    // In real app, this would initiate contact
    console.log("Contact carrier:", carrier.name);
  };

  return (
    <>
      {/* Map and Basic Info */}
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardContent className="p-0">
          <div className="p-6 border-b border-border/70">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-100 p-2">
                    <Navigation className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-bold text-lg text-foreground">
                        {selectedShipment.awbNumber}
                      </p>
                      <QrCode className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Live tracking active • {selectedShipment.currentStatus}
                    </p>
                  </div>
                </div>
                <StatusBadge
                  status={selectedShipment.status as keyof typeof statusConfig}
                />
                <PriorityBadge
                  priority={
                    selectedShipment.priority as keyof typeof priorityConfig
                  }
                />
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-lg border-border/70"
                  onClick={handleRefresh}
                >
                  <RefreshCw className="h-3 w-3" />
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-lg border-border/70"
                  onClick={() => handleShareTracking(selectedShipment)}
                >
                  <Share2 className="h-3 w-3" />
                  Share
                </Button>
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
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                      <Download className="h-4 w-4" />
                      Download Report
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                      <MessageCircle className="h-4 w-4" />
                      Send Updates
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Map View */}
              <div className="space-y-4">
                <MapPlaceholder
                  location={selectedShipment.tracking.currentLocation}
                />

                {/* Current Location Details */}
                <div className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-semibold text-foreground">
                      Current Location
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {selectedShipment.tracking.currentLocation.address}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Updated{" "}
                        {selectedShipment.tracking.currentLocation.timestamp}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Speed</p>
                        <p className="font-medium">
                          {selectedShipment.tracking.currentLocation.speed}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Coordinates</p>
                        <p className="font-mono font-medium text-xs">
                          {selectedShipment.tracking.currentLocation.latitude.toFixed(
                            4
                          )}
                          ,
                          {selectedShipment.tracking.currentLocation.longitude.toFixed(
                            4
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ETA and Route Info */}
              <div className="space-y-4">
                {/* ETA Card */}
                <Card className="rounded-xl border-green-200 bg-green-50/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Estimated Arrival
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                          {new Date(
                            selectedShipment.tracking.eta.predicted
                          ).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Today •{" "}
                          {selectedShipment.tracking.eta.confidence === "high"
                            ? "High confidence"
                            : "Medium confidence"}
                        </p>
                      </div>
                      <div className="rounded-lg bg-green-100 p-3">
                        <Clock className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Route Progress */}
                <div className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Truck className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-semibold text-foreground">
                      Route Information
                    </span>
                  </div>
                  <div className="space-y-3">
                    <RouteProgress route={selectedShipment.tracking.route} />

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">From:</span>
                        <span className="font-medium">
                          {selectedShipment.tracking.route.origin}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">To:</span>
                        <span className="font-medium">
                          {selectedShipment.tracking.route.destination}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          ETA Confidence:
                        </span>
                        <ConfidenceBadge
                          confidence={
                            selectedShipment.tracking.eta
                              .confidence as keyof typeof confidenceConfig
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Carrier Information */}
                <div className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-semibold text-foreground">
                      Carrier Information
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {selectedShipment.tracking.carrier.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedShipment.tracking.carrier.partner}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Vehicle:</span>
                        <span className="font-medium">
                          {selectedShipment.tracking.carrier.vehicle}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Contact:</span>
                        <span className="font-medium">
                          {selectedShipment.tracking.carrier.phone}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-2 rounded-lg border-border/70"
                        onClick={() =>
                          handleContactCarrier(
                            selectedShipment.tracking.carrier
                          )
                        }
                      >
                        <PhoneCall className="h-3 w-3" />
                        Call
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-2 rounded-lg border-border/70"
                      >
                        <MessageCircle className="h-3 w-3" />
                        Message
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tracking Timeline and Package Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tracking Timeline */}
        <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-5 w-5 text-primary" />
              Tracking Timeline
            </CardTitle>
            <CardDescription>
              Real-time updates and milestone tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ProgressTracker
                milestones={selectedShipment.tracking.milestones}
              />

              <div className="space-y-3">
                {selectedShipment.tracking.milestones.map(
                  (milestone: any, index: number) => (
                    <div key={milestone.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-3 h-3 rounded-full border-2 ${
                            milestone.status === "completed"
                              ? "bg-green-500 border-green-500"
                              : milestone.status === "current"
                              ? "bg-blue-500 border-blue-500 animate-pulse"
                              : "bg-gray-300 border-gray-300"
                          }`}
                        />
                        {index <
                          selectedShipment.tracking.milestones.length - 1 && (
                          <div
                            className={`w-0.5 h-8 ${
                              milestone.status === "completed"
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {milestone.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {milestone.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {milestone.location}
                            </p>
                          </div>
                          {milestone.timestamp && (
                            <div className="text-right">
                              <p className="text-xs font-medium text-foreground">
                                {new Date(
                                  milestone.timestamp
                                ).toLocaleDateString("en-IN")}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(
                                  milestone.timestamp
                                ).toLocaleTimeString("en-IN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Package and Receiver Details */}
        <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Package className="h-5 w-5 text-primary" />
              Shipment Details
            </CardTitle>
            <CardDescription>
              Package information and receiver details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Package Information */}
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-foreground">
                    Package Information
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Type</p>
                      <p className="font-medium">
                        {selectedShipment.package.type}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Weight</p>
                      <p className="font-medium">
                        {selectedShipment.package.weight}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Dimensions</p>
                      <p className="font-medium">
                        {selectedShipment.package.dimensions}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">COD Amount</p>
                      <p className="font-medium text-green-600">
                        {selectedShipment.package.codAmount}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p className="text-muted-foreground">Description</p>
                    <p className="font-medium">
                      {selectedShipment.package.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Receiver Information */}
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-green-600" />
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

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 gap-2 rounded-lg border-border/70"
                    >
                      <PhoneCall className="h-3 w-3" />
                      Call Receiver
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 gap-2 rounded-lg border-border/70"
                    >
                      <MessageCircle className="h-3 w-3" />
                      Message
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default TrackingDetails;
