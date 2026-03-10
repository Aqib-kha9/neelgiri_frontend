import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, QrCode, AlertCircle } from "lucide-react";
import { StatusBadge } from "./WeightBadges";
import { PriorityBadge } from "./WeightBadges";
import { DiscrepancyBadge } from "./WeightBadges";

interface WeightListProps {
  weights: any[];
  selectedWeight: any;
  setSelectedWeight: (weight: any) => void;
}

const WeightList = ({
  weights,
  selectedWeight,
  setSelectedWeight,
}: WeightListProps) => {
  return (
    <div className="xl:col-span-1 space-y-4">
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardContent className="p-6">
          <div className="space-y-3">
            {weights.map((weight) => (
              <Card
                key={weight.id}
                className={`cursor-pointer transition-all border-2 ${
                  selectedWeight.id === weight.id
                    ? "border-primary shadow-lg"
                    : "border-border/70 hover:border-primary/50"
                } rounded-xl`}
                onClick={() => setSelectedWeight(weight)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="font-mono font-semibold text-foreground">
                          {weight.awbNumber}
                        </p>
                        <QrCode className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <PriorityBadge priority={weight.priority} />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Declared:</span>
                        <span className="font-medium">
                          {weight.weights.declared} kg
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Actual:</span>
                        <span className="font-medium">
                          {weight.weights.actual
                            ? `${weight.weights.actual} kg`
                            : "Not weighed"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Discrepancy:
                        </span>
                        <DiscrepancyBadge type={weight.discrepancy.type} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <StatusBadge status={weight.status} />
                      <div className="text-xs text-muted-foreground">
                        {weight.discrepancy.amount > 0 &&
                          `+${weight.discrepancy.amount}kg`}
                      </div>
                    </div>

                    {weight.discrepancy.percentage > 10 && (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-3 w-3 text-red-500" />
                        <span className="text-xs text-red-600">
                          {weight.discrepancy.percentage}% variance
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {weights.length === 0 && (
              <div className="text-center py-8">
                <Scale className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No weight entries found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeightList;
