import { Truck, CheckCircle2, User, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { outForDeliveryData } from "./data/mockData";
import { Delivery } from "./types/index";

const StatsOverview = () => {
  const getTodayDeliveries = () => {
    return outForDeliveryData.filter(
      (d: Delivery) => d.currentStatus === "delivered"
    ).length;
  };

  const getSuccessRate = () => {
    const delivered = outForDeliveryData.filter(
      (d: Delivery) => d.currentStatus === "delivered"
    ).length;
    const attempted = outForDeliveryData.filter(
      (d: Delivery) => d.currentStatus === "delivery_attempted"
    ).length;
    const total = delivered + attempted;
    return total > 0 ? Math.round((delivered / total) * 100) : 0;
  };

  const getTotalActiveRiders = () => {
    const uniqueRiders = new Set(outForDeliveryData.map((d) => d.rider.id));
    return uniqueRiders.size;
  };

  const getActiveDeliveries = () => {
    return outForDeliveryData.filter(
      (d: Delivery) => d.currentStatus === "out_for_delivery"
    ).length;
  };

  const getAttemptedDeliveries = () => {
    return outForDeliveryData.filter(
      (d: Delivery) => d.currentStatus === "delivery_attempted"
    ).length;
  };

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-green-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Active Deliveries
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {getActiveDeliveries()}
                </span>
                <Badge variant="success" className="rounded-full text-xs">
                  Live
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Currently with riders
              </p>
            </div>
            <div className="rounded-2xl bg-green-100 p-3">
              <Truck className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-blue-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Delivered Today
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {getTodayDeliveries()}
                </span>
                <Badge variant="success" className="rounded-full text-xs">
                  {getSuccessRate()}% Success
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Successful deliveries
              </p>
            </div>
            <div className="rounded-2xl bg-blue-100 p-3">
              <CheckCircle2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-orange-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Active Riders
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {getTotalActiveRiders()}
                </span>
                <Badge variant="warning" className="rounded-full text-xs">
                  On Road
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Currently delivering
              </p>
            </div>
            <div className="rounded-2xl bg-orange-100 p-3">
              <User className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-red-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Pending Attempts
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {getAttemptedDeliveries()}
                </span>
                <Badge variant="error" className="rounded-full text-xs">
                  Retry
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Require reattempt</p>
            </div>
            <div className="rounded-2xl bg-red-100 p-3">
              <Clock className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverview;
