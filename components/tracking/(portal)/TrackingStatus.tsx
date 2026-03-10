import { Truck } from "lucide-react";
import StatusBadge from "./StatusBadge";

interface TrackingStatusProps {
  tracking: any;
}

const TrackingStatus = ({ tracking }: TrackingStatusProps) => {
  return (
    <div className="rounded-xl border border-border/60 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Truck className="h-4 w-4 text-orange-600" />
        <span className="text-sm font-semibold text-foreground">
          Current Status
        </span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status</span>
          <StatusBadge status={tracking.status} />
        </div>
        <div className="text-sm">
          <p className="text-muted-foreground">Current Location</p>
          <p className="font-medium">{tracking.location.current}</p>
          <p className="text-xs text-muted-foreground">
            {tracking.location.coordinates}
          </p>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Last Scan:</span>
          <span className="font-medium">{tracking.location.lastScan}</span>
        </div>
      </div>
    </div>
  );
};

export default TrackingStatus;
