import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface DRSData {
  progress: {
    totalShipments: number;
    delivered: number;
    completion: number;
  };
  performance: {
    efficiency: number;
    onTimeRate: number;
    customerRating: number;
  };
}

interface PerformanceStats {
  averageEfficiency: number;
  onTimeDelivery: number;
  customerSatisfaction: number;
}

interface PerformanceComparisonProps {
  selectedDRS: DRSData;
  performanceStats: PerformanceStats;
}

const PerformanceComparison = ({
  selectedDRS,
  performanceStats,
}: PerformanceComparisonProps) => {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="h-5 w-5 text-primary" />
          Performance Comparison
        </CardTitle>
        <CardDescription>
          Compare this DRS performance with averages
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-muted/30 rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">Efficiency</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-2xl font-bold text-foreground">
                {selectedDRS.performance.efficiency}%
              </p>
              {selectedDRS.performance.efficiency >=
              performanceStats.averageEfficiency ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Avg: {performanceStats.averageEfficiency}%
            </p>
          </div>

          <div className="text-center p-4 bg-muted/30 rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">On-time Rate</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-2xl font-bold text-foreground">
                {selectedDRS.performance.onTimeRate}%
              </p>
              {selectedDRS.performance.onTimeRate >=
              performanceStats.onTimeDelivery ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Avg: {performanceStats.onTimeDelivery}%
            </p>
          </div>

          <div className="text-center p-4 bg-muted/30 rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">
              Customer Rating
            </p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-2xl font-bold text-foreground">
                {selectedDRS.performance.customerRating}
              </p>
              {selectedDRS.performance.customerRating >=
              performanceStats.customerSatisfaction ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Avg: {performanceStats.customerSatisfaction}
            </p>
          </div>

          <div className="text-center p-4 bg-muted/30 rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">Completion</p>
            <p className="text-2xl font-bold text-foreground">
              {selectedDRS.progress.completion}%
            </p>
            <p className="text-xs text-muted-foreground">
              {selectedDRS.progress.delivered} of{" "}
              {selectedDRS.progress.totalShipments}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceComparison;
