import { IndianRupee, Clock, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import AlertBadge from "./AlertBadge";

interface FinancialTimelineProps {
  selectedDRS: any;
}

const FinancialTimeline = ({ selectedDRS }: FinancialTimelineProps) => {
  const getTimeRemaining = (expectedEnd: string) => {
    const now = new Date();
    const end = new Date(expectedEnd);
    const diffMs = end.getTime() - now.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffMs < 0)
      return `Overdue by ${Math.abs(diffHrs)}h ${Math.abs(diffMins)}m`;
    return `${diffHrs}h ${diffMins}m remaining`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Financial Summary */}
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <IndianRupee className="h-5 w-5 text-primary" />
            Financial Summary
          </CardTitle>
          <CardDescription>
            COD collection and financial progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Total COD Value:
              </span>
              <span className="font-medium text-foreground">
                ₹{selectedDRS.financial.totalCOD}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Collected COD:
              </span>
              <span className="font-medium text-green-600">
                ₹{selectedDRS.financial.collectedCOD}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Pending COD:
              </span>
              <span className="font-medium text-orange-600">
                ₹{selectedDRS.financial.pendingCOD}
              </span>
            </div>
            <Progress
              value={
                (selectedDRS.financial.collectedCOD /
                  selectedDRS.financial.totalCOD) *
                100
              }
              className="h-2"
            />
            <div className="text-center text-sm text-muted-foreground">
              {Math.round(
                (selectedDRS.financial.collectedCOD /
                  selectedDRS.financial.totalCOD) *
                  100
              )}
              % collected
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline & Alerts */}
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-5 w-5 text-primary" />
            Timeline & Alerts
          </CardTitle>
          <CardDescription>Delivery timeline and active alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Start Time:</span>
                <span className="font-medium">
                  {new Date(selectedDRS.timeline.startTime).toLocaleTimeString(
                    "en-IN"
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Expected End:</span>
                <span className="font-medium">
                  {new Date(
                    selectedDRS.timeline.expectedEnd
                  ).toLocaleTimeString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Time Remaining:</span>
                <span className="font-medium">
                  {getTimeRemaining(selectedDRS.timeline.expectedEnd)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Update:</span>
                <span className="font-medium">
                  {selectedDRS.location.lastUpdate}
                </span>
              </div>
            </div>

            {selectedDRS.alerts.length > 0 && (
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-foreground mb-2">
                  Active Alerts
                </p>
                <div className="space-y-2">
                  {selectedDRS.alerts.map((alert: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 bg-red-50 rounded-lg"
                    >
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <div className="flex-1">
                        <p className="text-sm text-foreground">
                          {alert.message}
                        </p>
                      </div>
                      <AlertBadge priority={alert.priority} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialTimeline;
