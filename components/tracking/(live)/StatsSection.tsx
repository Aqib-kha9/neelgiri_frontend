import { Navigation, Package, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StatsSectionProps {
  stats: {
    totalActive: number;
    inTransit: number;
    outForDelivery: number;
    delayed: number;
    deliveredToday: number;
    avgDeliveryTime: string;
    onTimeRate: string;
  };
}

const StatsSection = ({ stats }: StatsSectionProps) => {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-blue-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Active Shipments
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {stats.totalActive}
                </span>
                <Badge
                  variant="secondary"
                  className="rounded-full text-xs bg-green-100 text-green-800"
                >
                  Live
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Being tracked in real-time
              </p>
            </div>
            <div className="rounded-2xl bg-blue-100 p-3">
              <Navigation className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-orange-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Out for Delivery
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {stats.outForDelivery}
                </span>
                <Badge
                  variant="secondary"
                  className="rounded-full text-xs bg-orange-100 text-orange-800"
                >
                  Today
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Scheduled for delivery today
              </p>
            </div>
            <div className="rounded-2xl bg-orange-100 p-3">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-green-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Delivered Today
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {stats.deliveredToday}
                </span>
                <Badge
                  variant="secondary"
                  className="rounded-full text-xs bg-green-100 text-green-800"
                >
                  {stats.onTimeRate}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                On-time delivery rate
              </p>
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
                Delayed Shipments
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {stats.delayed}
                </span>
                <Badge
                  variant="secondary"
                  className="rounded-full text-xs bg-red-100 text-red-800"
                >
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
    </div>
  );
};

export default StatsSection;
