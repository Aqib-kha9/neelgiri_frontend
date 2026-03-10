import {
  Map,
  Signal,
  Battery,
  Timer,
  Package,
  Navigation,
  Phone,
  PlayCircle,
  PauseCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ConnectivityBadge from "./ConnectivityBadge";

interface LiveTrackingProps {
  selectedDRS: any;
}

const LiveTracking = ({ selectedDRS }: LiveTrackingProps) => {
  const handlePauseDRS = (drs: any) => {
    console.log("Pause DRS:", drs.id);
  };

  const handleResumeDRS = (drs: any) => {
    console.log("Resume DRS:", drs.id);
  };

  const handleContactRider = (rider: any) => {
    console.log("Contact rider:", rider.name);
  };

  const handleViewRoute = (drs: any) => {
    console.log("View route for:", drs.id);
  };

  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Map className="h-5 w-5 text-primary" />
          Live Tracking & Actions
        </CardTitle>
        <CardDescription>
          Real-time monitoring and control actions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2 text-center">
            <div className="flex items-center justify-center gap-2">
              <Signal className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Connectivity</span>
            </div>
            <ConnectivityBadge status={selectedDRS.location.connectivity} />
          </div>

          <div className="space-y-2 text-center">
            <div className="flex items-center justify-center gap-2">
              <Battery className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Device Battery</span>
            </div>
            <Badge variant="outline" className="rounded-full">
              {selectedDRS.location.battery}%
            </Badge>
          </div>

          <div className="space-y-2 text-center">
            <div className="flex items-center justify-center gap-2">
              <Timer className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Current Location</span>
            </div>
            <p className="text-sm font-medium truncate">
              {selectedDRS.location.current}
            </p>
          </div>

          <div className="space-y-2 text-center">
            <div className="flex items-center justify-center gap-2">
              <Package className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Last Update</span>
            </div>
            <p className="text-sm font-medium">
              {selectedDRS.location.lastUpdate}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t">
          {selectedDRS.status === "in_progress" && (
            <Button
              variant="outline"
              className="gap-2 rounded-lg border-orange-500 text-orange-600 hover:bg-orange-50 flex-1"
              onClick={() => handlePauseDRS(selectedDRS)}
            >
              <PauseCircle className="h-4 w-4" />
              Pause DRS
            </Button>
          )}

          {selectedDRS.status === "paused" && (
            <Button
              variant="outline"
              className="gap-2 rounded-lg border-green-500 text-green-600 hover:bg-green-50 flex-1"
              onClick={() => handleResumeDRS(selectedDRS)}
            >
              <PlayCircle className="h-4 w-4" />
              Resume DRS
            </Button>
          )}

          <Button
            className="gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 flex-1"
            onClick={() => handleViewRoute(selectedDRS)}
          >
            <Navigation className="h-4 w-4" />
            View Live Route
          </Button>

          <Button
            variant="outline"
            className="gap-2 rounded-lg border-border/70 flex-1"
            onClick={() => handleContactRider(selectedDRS.rider)}
          >
            <Phone className="h-4 w-4" />
            Contact Rider
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveTracking;
