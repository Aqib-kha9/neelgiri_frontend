import { Card, CardContent } from "@/components/ui/card";
import { Truck, Package, TrendingUp, AlertCircle } from "lucide-react";

interface PerformanceStats {
  peakPerformance: {
    rider: string;
    efficiency: number;
    deliveries: number;
  };
  onTimeDelivery: number;
  cancellationRate: number;
}

interface AnalyticsSummaryProps {
  performanceStats: PerformanceStats;
}

const AnalyticsSummary = ({ performanceStats }: AnalyticsSummaryProps) => {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Truck className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Peak Performer</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              {performanceStats.peakPerformance.rider}
            </p>
            <p className="text-sm text-muted-foreground">
              {performanceStats.peakPerformance.efficiency}% efficiency
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Package className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">On-time Delivery</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              {performanceStats.onTimeDelivery}%
            </p>
            <p className="text-sm text-muted-foreground">
              Delivery success rate
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Total Deliveries</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              {performanceStats.peakPerformance.deliveries}
            </p>
            <p className="text-sm text-muted-foreground">This month</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Cancellation Rate</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              {performanceStats.cancellationRate}%
            </p>
            <p className="text-sm text-muted-foreground">Need improvement</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsSummary;
