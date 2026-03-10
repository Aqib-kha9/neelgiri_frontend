import { User, PhoneCall, Sparkles, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RiderStatusBadge from "@/components/ui/RiderStatusBadge";
import { outForDeliveryData } from "./data/mockData";
import { Delivery } from "./types/index"; // Import Delivery type
import { Rider } from "./types/index"; // Import Rider type

const RiderOverview = () => {
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

    const uniqueRiders = Array.from(
      new Set(outForDeliveryData.map((d) => d.rider.id))
    )
      .map((riderId) => {
        const rider = outForDeliveryData.find((d) => d.rider.id === riderId)
          ?.rider as Rider; // Type assertion yahan use karo
        const riderDeliveries = outForDeliveryData.filter(
          (d) => d.rider.id === riderId
        );
        const activeDeliveries = riderDeliveries.filter(
          (d) => d.currentStatus === "out_for_delivery"
        );

        return { rider, activeDeliveries, riderDeliveries };
      })
      .filter((item) => item.rider);

  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <User className="h-5 w-5 text-primary" />
          Active Riders Overview
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Real-time status of riders currently on delivery routes
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {uniqueRiders.map(({ rider, activeDeliveries, riderDeliveries }) => (
            <Card
              key={rider.id}
              className="rounded-xl border-border/60 bg-card/95"
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">
                        {rider.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {rider.id}
                      </p>
                    </div>
                    <RiderStatusBadge status={rider.status} />{" "}
                    {/* Ab error nahi aayega */}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Active Deliveries:
                      </span>
                      <span className="font-medium">
                        {activeDeliveries.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Today's Total:
                      </span>
                      <span className="font-medium">
                        {rider!.deliveriesToday}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Rating:</span>
                      <span className="font-medium text-yellow-600">
                        {rider!.rating} ★
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span>{rider!.phone}</span>
                  </div>

                  <Button
                    size="sm"
                    className="w-full gap-2 rounded-lg"
                    variant={
                      activeDeliveries.length > 0 ? "default" : "outline"
                    }
                  >
                    <PhoneCall className="h-3 w-3" />
                    Contact Rider
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-green-200 bg-green-50/50 p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Delivery Performance
              </p>
              <p className="text-xs text-muted-foreground">
                {getTodayDeliveries()} successful deliveries today with{" "}
                {getSuccessRate()}% success rate.
                {
                  outForDeliveryData.filter(
                    (d: Delivery) => d.currentStatus === "out_for_delivery"
                  ).length
                }{" "}
                active deliveries in progress.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiderOverview;
