import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Truck, Phone, UserPlus } from "lucide-react";
import { Rider } from "./types";

interface AvailableRidersProps {
  riders: Rider[];
}

export const AvailableRiders = ({ riders }: AvailableRidersProps) => {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Truck className="h-5 w-5 text-primary" />
          Available Riders
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Riders available for pickup assignments
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {riders.map((rider) => (
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
                    <Badge
                      variant={
                        rider.status === "available" ? "success" : "secondary"
                      }
                      className="rounded-full text-xs"
                    >
                      {rider.status === "available" ? "Available" : "Busy"}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Current Load:
                      </span>
                      <span className="font-medium">
                        {rider.currentLoad}/{rider.maxLoad}
                      </span>
                    </div>
                    <Progress
                      value={(rider.currentLoad / rider.maxLoad) * 100}
                      className="h-1"
                    />
                  </div>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span>{rider.phone}</span>
                  </div>

                  <Button
                    size="sm"
                    className="w-full gap-2 rounded-lg"
                    disabled={
                      rider.status !== "available" ||
                      rider.currentLoad >= rider.maxLoad
                    }
                  >
                    <UserPlus className="h-3 w-3" />
                    Assign Pickup
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
