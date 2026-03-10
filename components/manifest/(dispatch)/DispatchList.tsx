// app/dashboard/manifest/dispatch/components/DispatchList.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, MapPin, Clock, AlertCircle, Package } from "lucide-react";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";

interface DispatchListProps {
  dispatches: any[];
  selectedDispatch: any;
  setSelectedDispatch: (dispatch: any) => void;
}

const DispatchList = ({
  dispatches,
  selectedDispatch,
  setSelectedDispatch,
}: DispatchListProps) => {
  const getProgressPercentage = (dispatch: any) => {
    if (dispatch.status === "delivered") return 100;
    if (dispatch.status === "in_transit") return 75;
    if (dispatch.status === "loading") return 50;
    if (dispatch.status === "scheduled") return 25;
    return 0;
  };

  const getTimeStatus = (dispatch: any) => {
    if (dispatch.status === "delayed") return "delayed";
    if (
      dispatch.status === "in_transit" &&
      dispatch.estimatedTime < new Date().getTime()
    )
      return "delayed";
    return "on_time";
  };

  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-6">
        <div className="space-y-3">
          {dispatches.map((dispatch) => (
            <Card
              key={dispatch.id}
              className={`cursor-pointer transition-all border-2 ${
                selectedDispatch.id === dispatch.id
                  ? "border-primary shadow-lg"
                  : "border-border/70 hover:border-primary/50"
              } rounded-xl`}
              onClick={() => setSelectedDispatch(dispatch)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-semibold text-foreground">
                        {dispatch.manifestNumber}
                      </p>
                      <Truck className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <PriorityBadge priority={dispatch.priority} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Vehicle:</span>
                      <span className="font-medium">
                        {dispatch.vehicleNumber}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Route:</span>
                      <span className="font-medium">
                        {dispatch.origin.code} → {dispatch.destination.code}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Driver:</span>
                      <span className="font-medium">
                        {dispatch.driver.name}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${getProgressPercentage(dispatch)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <StatusBadge status={dispatch.status} />
                      <div className="text-xs text-muted-foreground">
                        {dispatch.bagsCount} bags
                      </div>
                    </div>
                  </div>

                  {getTimeStatus(dispatch) === "delayed" && (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-3 w-3 text-red-500" />
                      <span className="text-xs text-red-600">Delayed</span>
                    </div>
                  )}

                  {dispatch.alerts.length > 0 && (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-3 w-3 text-orange-500" />
                      <span className="text-xs text-orange-600">
                        {dispatch.alerts.length} alerts
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {dispatches.length === 0 && (
            <div className="text-center py-8">
              <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No dispatches found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DispatchList;
