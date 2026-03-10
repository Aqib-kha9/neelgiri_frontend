// app/dashboard/manifest/history/components/HistoryDetails.tsx
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
  BarChart3,
  Eye,
  Download,
  Copy,
  Calendar,
  AlertCircle,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import PerformanceBadge from "./PerformanceBadge";
import { ManifestTable } from "../shared/ManifestTable"; // Start using ManifestTable for shipments

interface HistoryDetailsProps {
  history: any;
}

const HistoryDetails = ({ history }: HistoryDetailsProps) => {
  return (
    <>
      {/* History Summary */}
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardContent className="p-0">
          <div className="p-6 border-b border-border/70">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-indigo-100 p-2">
                    <Truck className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-bold text-lg text-foreground">
                        {history.manifestNumber}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {history.vehicleNumber}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Historical Record • {history.origin.name} to{" "}
                      {history.destination.name}
                    </p>
                  </div>
                </div>
                <StatusBadge status={history.status} />
                <PerformanceBadge performance={history.performance.rating} />
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    Completed:{" "}
                    {new Date(history.deliveredTime).toLocaleDateString(
                      "en-IN"
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">Delivery date</p>
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
                      <Download className="h-4 w-4" />
                      Export Record
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                      <Copy className="h-4 w-4" />
                      Clone Record
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                      <BarChart3 className="h-4 w-4" />
                      Performance Analysis
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Dispatch Information */}
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
                          {history.origin.code}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {history.origin.name}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Destination
                        </p>
                        <p className="text-lg font-bold text-green-600">
                          {history.destination.code}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {history.destination.name}
                        </p>
                      </div>
                    </div>

                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Distance & Duration
                      </p>
                      <p className="text-lg font-bold text-purple-600">
                        {history.route.distance}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Actual: {history.performance.actualDuration}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Vehicle & Driver */}
                <div className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Truck className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-semibold text-foreground">
                      Vehicle & Driver
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Vehicle:</span>
                      <span className="font-medium">
                        {history.vehicleNumber} ({history.vehicle.type})
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Driver:</span>
                      <span className="font-medium">{history.driver.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Driver Rating:
                      </span>
                      <span className="font-medium">
                        {history.driver.rating}/5
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="space-y-4">
                {/* Delivery Performance */}
                <div className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-semibold text-foreground">
                      Delivery Performance
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Scheduled Delivery:
                      </span>
                      <span className="font-medium">
                        {new Date(history.estimatedTime).toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Actual Delivery:
                      </span>
                      <span className="font-medium">
                        {new Date(history.deliveredTime).toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Time Difference:
                      </span>
                      <span
                        className={`font-medium ${history.performance.deliveryTime === "early"
                          ? "text-green-600"
                          : history.performance.deliveryTime === "late"
                            ? "text-red-600"
                            : "text-blue-600"
                          }`}
                      >
                        {history.performance.timeDifference}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Performance Rating:
                      </span>
                      <PerformanceBadge
                        performance={history.performance.rating}
                      />
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
                      <span className="font-medium">{history.bagsCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Total Shipments:
                      </span>
                      <span className="font-medium">
                        {history.shipmentsCount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Total Weight:
                      </span>
                      <span className="font-medium">{history.totalWeight}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Success Rate:
                      </span>
                      <span className="font-medium text-green-600">
                        {history.performance.successRate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipments List (New Addition) */}
      <div className="mt-6">
        <ManifestTable
          data={history.shipments || []}
          title={`Shipments in ${history.manifestNumber}`}
        />
      </div>

      {/* Timeline & Issues */}
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-5 w-5 text-primary" />
            Complete Timeline
          </CardTitle>
          <CardDescription>
            Detailed timeline of dispatch events and milestones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Timeline */}
            <div className="space-y-4">
              <div className="space-y-3">
                {history.timeline.map((event: any, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${event.status === "completed"
                          ? "bg-green-500"
                          : event.status === "delayed"
                            ? "bg-red-500"
                            : "bg-gray-300"
                          }`}
                      />
                      {index < history.timeline.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-200" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">
                          {event.event}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.timestamp).toLocaleString("en-IN")}
                        </p>
                      </div>
                      {event.notes && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {event.notes}
                        </p>
                      )}
                      {event.delay && (
                        <Badge variant="error" className="mt-1 text-xs">
                          Delay: {event.delay}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Issues & Resolution */}
            {history.issues.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800">
                    Reported Issues
                  </span>
                </div>
                <div className="space-y-2">
                  {history.issues.map((issue: any, index: number) => (
                    <div key={index} className="text-sm">
                      <div className="flex justify-between items-start">
                        <span className="text-red-700 font-medium">
                          {issue.type}
                        </span>
                        <Badge
                          variant={issue.resolved ? "success" : "error"}
                          className="text-xs"
                        >
                          {issue.resolved ? "Resolved" : "Pending"}
                        </Badge>
                      </div>
                      <p className="text-red-600 text-xs mt-1">
                        {issue.description}
                      </p>
                      {issue.resolution && (
                        <p className="text-green-600 text-xs mt-1">
                          Resolution: {issue.resolution}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Performance Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Performance Summary
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Overall Rating</p>
                  <p className="font-medium text-blue-600">
                    {history.performance.rating}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Success Rate</p>
                  <p className="font-medium text-green-600">
                    {history.performance.successRate}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Delivery Time</p>
                  <p className="font-medium">
                    {history.performance.actualDuration}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Issues Reported</p>
                  <p className="font-medium">{history.issues.length}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Actions */}
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-5 w-5 text-primary" />
            Analysis Tools
          </CardTitle>
          <CardDescription>
            Tools for analyzing this historical record
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button
              variant="outline"
              className="gap-2 rounded-lg border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              <BarChart3 className="h-4 w-4" />
              Performance Report
            </Button>

            <Button
              variant="outline"
              className="gap-2 rounded-lg border-green-500 text-green-600 hover:bg-green-50"
            >
              <Download className="h-4 w-4" />
              Export Data
            </Button>

            <Button
              variant="outline"
              className="gap-2 rounded-lg border-orange-500 text-orange-600 hover:bg-orange-50"
            >
              <FileText className="h-4 w-4" />
              Generate PDF
            </Button>

            <Button
              variant="outline"
              className="gap-2 rounded-lg border-purple-500 text-purple-600 hover:bg-purple-50"
            >
              <Calendar className="h-4 w-4" />
              Compare Periods
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default HistoryDetails;
