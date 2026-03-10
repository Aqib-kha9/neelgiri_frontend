import {
  Truck,
  QrCode,
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  Trash2,
  BarChart3,
  Timer,
  User,
  Route,
  Phone,
  Navigation,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import StatusBadge from "./StatusBadge";
import ConnectivityBadge from "./ConnectivityBadge";

interface DRSSummaryProps {
  selectedDRS: any;
}

const DRSSummary = ({ selectedDRS }: DRSSummaryProps) => {
  const handleContactRider = (rider: any) => {
    console.log("Contact rider:", rider.name);
  };

  const handleViewRoute = (drs: any) => {
    console.log("View route for:", drs.id);
  };

  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-0">
        <div className="p-6 border-b border-border/70">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-100 p-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-mono font-bold text-lg text-foreground">
                      {selectedDRS.drsNumber}
                    </p>
                    <QrCode className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Active Delivery Run • {selectedDRS.rider.name}
                  </p>
                </div>
              </div>
              <StatusBadge status={selectedDRS.status} />
              <ConnectivityBadge status={selectedDRS.location.connectivity} />
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  Efficiency: {selectedDRS.performance.efficiency}%
                </p>
                <p className="text-xs text-muted-foreground">
                  Performance Score
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
                    Edit DRS
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                    <Copy className="h-4 w-4" />
                    Clone DRS
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-red-600">
                    <Trash2 className="h-4 w-4" />
                    Cancel DRS
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Progress & Performance */}
            <div className="space-y-4">
              {/* Progress Overview */}
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-foreground">
                    Progress Overview
                  </span>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Completion</span>
                      <span className="font-medium">
                        {selectedDRS.progress.completion}%
                      </span>
                    </div>
                    <Progress
                      value={selectedDRS.progress.completion}
                      className="h-3"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-green-600">
                        {selectedDRS.progress.delivered}
                      </p>
                      <p className="text-xs text-muted-foreground">Delivered</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedDRS.progress.pending}
                      </p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-orange-600">
                        {selectedDRS.progress.returned}
                      </p>
                      <p className="text-xs text-muted-foreground">Returned</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Timer className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-foreground">
                    Performance Metrics
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Efficiency Rate:
                    </span>
                    <span className="font-medium">
                      {selectedDRS.performance.efficiency}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      On-time Delivery:
                    </span>
                    <span className="font-medium">
                      {selectedDRS.performance.onTimeRate}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Avg Time/Stop:
                    </span>
                    <span className="font-medium">
                      {selectedDRS.performance.averageTimePerStop}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rider & Route Information */}
            <div className="space-y-4">
              {/* Rider Information */}
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-semibold text-foreground">
                    Rider Information
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">
                        {selectedDRS.rider.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedDRS.rider.id}
                      </p>
                    </div>
                    <Badge variant="outline" className="rounded-full">
                      {selectedDRS.rider.vehicle}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedDRS.rider.phone}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Capacity</p>
                      <p className="font-medium">
                        {selectedDRS.rider.capacity} shipments
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 gap-2 rounded-lg border-border/70"
                      onClick={() => handleContactRider(selectedDRS.rider)}
                    >
                      <Phone className="h-3 w-3" />
                      Call Rider
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 gap-2 rounded-lg border-border/70"
                      onClick={() => handleViewRoute(selectedDRS)}
                    >
                      <Navigation className="h-3 w-3" />
                      Track
                    </Button>
                  </div>
                </div>
              </div>

              {/* Route Information */}
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Route className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-semibold text-foreground">
                    Route Information
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Total Distance:
                    </span>
                    <span className="font-medium">
                      {selectedDRS.route.totalDistance}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Completed:</span>
                    <span className="font-medium">
                      {selectedDRS.route.completedDistance}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Remaining:</span>
                    <span className="font-medium">
                      {selectedDRS.route.remainingDistance}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Route Optimized:
                    </span>
                    <Badge
                      variant={
                        selectedDRS.route.optimized ? "success" : "secondary"
                      }
                      className="rounded-full text-xs"
                    >
                      {selectedDRS.route.optimized ? "Yes" : "No"}
                    </Badge>
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

export default DRSSummary;
