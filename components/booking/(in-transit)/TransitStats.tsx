import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Shipment } from "./types";

interface TransitStatsProps {
  shipments: Shipment[];
}

export const TransitStats = ({ shipments }: TransitStatsProps) => {
  const getTotalDelayed = () => {
    return shipments.filter((shipment) => shipment.delay > 0).length;
  };

  const getAverageTransitTime = () => {
    const total = shipments.reduce(
      (sum, shipment) => sum + (shipment.delay || 0),
      0
    );
    return Math.round(total / shipments.length);
  };

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-blue-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Total In Transit
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {shipments.length}
                </span>
                <Badge variant="success" className="rounded-full text-xs">
                  Active
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Active shipments</p>
            </div>
            <div className="rounded-2xl bg-blue-100 p-3">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-green-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                On Time
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {shipments.filter((s) => s.delay === 0).length}
                </span>
                <Badge variant="success" className="rounded-full text-xs">
                  {Math.round(
                    (shipments.filter((s) => s.delay === 0).length /
                      shipments.length) *
                      100
                  )}
                  %
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Meeting schedule</p>
            </div>
            <div className="rounded-2xl bg-green-100 p-3">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-red-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Delayed
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {getTotalDelayed()}
                </span>
                <Badge variant="error" className="rounded-full text-xs">
                  Attention
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Requiring intervention
              </p>
            </div>
            <div className="rounded-2xl bg-red-100 p-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-purple-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Avg. Delay
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {getAverageTransitTime()}
                </span>
                <span className="text-sm text-muted-foreground">mins</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Across all shipments
              </p>
            </div>
            <div className="rounded-2xl bg-purple-100 p-3">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
