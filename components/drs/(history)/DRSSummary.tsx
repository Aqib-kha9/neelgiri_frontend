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
import {
  FileText,
  QrCode,
  MoreHorizontal,
  BarChart3,
  Copy,
  Download,
  Trash2,
  IndianRupee,
  Clock,
  Target,
  Star,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import PerformanceBadge from "./PerformanceBadge";

interface DRSData {
  id: string;
  drsNumber: string;
  status: string;
  rider: {
    id: string;
    name: string;
    phone: string;
    vehicle: string;
    rating: number;
  };
  date: string;
  timeline: {
    startTime: string;
    endTime: string;
    duration: string;
  };
  progress: {
    totalShipments: number;
    delivered: number;
    pending: number;
    returned: number;
    completion: number;
  };
  financial: {
    totalCOD: number;
    collectedCOD: number;
    pendingCOD: number;
    cashDeposited: number;
    depositTime: string;
  };
  performance: {
    averageTimePerStop: string;
    efficiency: number;
    onTimeRate: number;
    customerRating: number;
  };
  route: {
    totalDistance: string;
    optimized: boolean;
    fuelCost: string;
  };
}

interface DRSSummaryProps {
  selectedDRS: DRSData;
}

const DRSSummary = ({ selectedDRS }: DRSSummaryProps) => {
  const handleRecreateDRS = (drs: any) => {
    console.log("Recreating DRS:", drs.id);
  };

  const handleViewAnalytics = (drs: any) => {
    console.log("Viewing analytics for:", drs.id);
  };

  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-0">
        <div className="p-6 border-b border-border/70">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-purple-100 p-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-mono font-bold text-lg text-foreground">
                      {selectedDRS.drsNumber}
                    </p>
                    <QrCode className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Historical Delivery Run • {selectedDRS.rider.name}
                  </p>
                </div>
              </div>
              <StatusBadge
                status={
                  selectedDRS.status as "completed" | "cancelled" | "partial"
                }
              />
              <PerformanceBadge
                efficiency={selectedDRS.performance.efficiency}
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {selectedDRS.performance.customerRating} ★
                </p>
                <p className="text-xs text-muted-foreground">Customer Rating</p>
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
                  <DropdownMenuItem
                    className="flex items-center gap-2 rounded-lg"
                    onClick={() => handleRecreateDRS(selectedDRS)}
                  >
                    <Copy className="h-4 w-4" />
                    Recreate DRS
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-2 rounded-lg"
                    onClick={() => handleViewAnalytics(selectedDRS)}
                  >
                    <BarChart3 className="h-4 w-4" />
                    View Analytics
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                    <Download className="h-4 w-4" />
                    Export Details
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-red-600">
                    <Trash2 className="h-4 w-4" />
                    Delete Record
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Metrics */}
            <div className="space-y-4">
              {/* Delivery Performance */}
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-foreground">
                    Delivery Performance
                  </span>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">
                        Completion Rate
                      </span>
                      <span className="font-medium">
                        {selectedDRS.progress.completion}%
                      </span>
                    </div>
                    <Progress
                      value={selectedDRS.progress.completion}
                      className="h-3"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Shipments</p>
                      <p className="font-medium text-lg">
                        {selectedDRS.progress.totalShipments}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Success Rate</p>
                      <p className="font-medium text-lg text-green-600">
                        {(
                          (selectedDRS.progress.delivered /
                            selectedDRS.progress.totalShipments) *
                          100
                        ).toFixed(1)}
                        %
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="space-y-1 p-2 bg-green-50 rounded-lg">
                      <p className="text-lg font-bold text-green-600">
                        {selectedDRS.progress.delivered}
                      </p>
                      <p className="text-xs text-muted-foreground">Delivered</p>
                    </div>
                    <div className="space-y-1 p-2 bg-blue-50 rounded-lg">
                      <p className="text-lg font-bold text-blue-600">
                        {selectedDRS.progress.pending}
                      </p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                    <div className="space-y-1 p-2 bg-orange-50 rounded-lg">
                      <p className="text-lg font-bold text-orange-600">
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
                  <Target className="h-4 w-4 text-green-600" />
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
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Customer Rating:
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">
                        {selectedDRS.performance.customerRating}
                      </span>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial & Timeline */}
            <div className="space-y-4">
              {/* Financial Summary */}
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <IndianRupee className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-foreground">
                    Financial Summary
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Total COD Value:
                    </span>
                    <span className="font-medium">
                      ₹{selectedDRS.financial.totalCOD.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Collected COD:
                    </span>
                    <span className="font-medium text-green-600">
                      ₹{selectedDRS.financial.collectedCOD.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Pending COD:</span>
                    <span className="font-medium text-orange-600">
                      ₹{selectedDRS.financial.pendingCOD.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Cash Deposited:
                    </span>
                    <span className="font-medium">
                      ₹{selectedDRS.financial.cashDeposited.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Deposit Time:</span>
                    <span className="font-medium">
                      {new Date(
                        selectedDRS.financial.depositTime
                      ).toLocaleTimeString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline Information */}
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-semibold text-foreground">
                    Timeline Information
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">
                      {new Date(selectedDRS.date).toLocaleDateString("en-IN", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Start Time:</span>
                    <span className="font-medium">
                      {new Date(
                        selectedDRS.timeline.startTime
                      ).toLocaleTimeString("en-IN")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">End Time:</span>
                    <span className="font-medium">
                      {new Date(
                        selectedDRS.timeline.endTime
                      ).toLocaleTimeString("en-IN")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Total Duration:
                    </span>
                    <span className="font-medium">
                      {selectedDRS.timeline.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Route Distance:
                    </span>
                    <span className="font-medium">
                      {selectedDRS.route.totalDistance}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Fuel Cost:</span>
                    <span className="font-medium">
                      {selectedDRS.route.fuelCost}
                    </span>
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
