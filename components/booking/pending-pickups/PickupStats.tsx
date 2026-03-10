import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Clock, AlertCircle, Truck } from "lucide-react";
import { Pickup, Rider } from "./types";

interface PickupStatsProps {
  pickups: Pickup[];
  riders: Rider[];
}

export const PickupStats = ({ pickups, riders }: PickupStatsProps) => {
  const getStatusCount = (status: string) => {
    return pickups.filter(
      (pickup) => status === "all" || pickup.status === status
    ).length;
  };

  const getPriorityCount = (priority: string) => {
    return pickups.filter(
      (pickup) => priority === "all" || pickup.priority === priority
    ).length;
  };

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-orange-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Total Pending
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {pickups.length}
                </span>
                <Badge variant="warning" className="rounded-full text-xs">
                  Active
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Pickups awaiting action
              </p>
            </div>
            <div className="rounded-2xl bg-orange-100 p-3">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-blue-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Unassigned
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {getStatusCount("pending")}
                </span>
                <Badge variant="error" className="rounded-full text-xs">
                  Attention
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Need rider assignment
              </p>
            </div>
            <div className="rounded-2xl bg-blue-100 p-3">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-red-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                High Priority
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {getPriorityCount("high")}
                </span>
                <Badge variant="error" className="rounded-full text-xs">
                  Urgent
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Immediate attention
              </p>
            </div>
            <div className="rounded-2xl bg-red-100 p-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-green-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Available Riders
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {riders.filter((r) => r.status === "available").length}
                </span>
                <Badge variant="success" className="rounded-full text-xs">
                  Ready
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">For assignment</p>
            </div>
            <div className="rounded-2xl bg-green-100 p-3">
              <Truck className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
