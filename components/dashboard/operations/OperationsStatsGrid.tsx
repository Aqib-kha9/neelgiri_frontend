// FILE: src/components/dashboard/operations/OperationsStatsGrid.tsx
// =====================================================
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, AlertTriangle } from "lucide-react";

const IconMap: Record<string, any> = {
  Package: (props: any) => <svg {...props} />, // placeholder; icons are applied via color chip
  Truck: (props: any) => <svg {...props} />,
  MapPin: (props: any) => <svg {...props} />,
  CheckCircle2: (props: any) => <svg {...props} />,
  AlertTriangle: (props: any) => <svg {...props} />,
  Clock: (props: any) => <svg {...props} />,
};

export function OperationsStatsGrid({ stats }: { stats: any[] }) {
  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => {
        const TrendIcon =
          stat.trend === "up" ? (
            <TrendingUp className="h-4 w-4 text-success" />
          ) : stat.trend === "down" ? (
            <TrendingUp className="h-4 w-4 rotate-180 text-error" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-warning" />
          );
        return (
          <Card
            key={stat.title}
            className="rounded-2xl border-border/70 bg-card/95 shadow-card"
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </span>
                    {stat.suffix && (
                      <span className="text-sm text-muted-foreground">
                        {stat.suffix}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {TrendIcon}
                    <span className="text-xs text-muted-foreground">
                      {stat.changeValue} {stat.changeLabel}
                    </span>
                  </div>
                </div>
                <div className={`rounded-2xl p-3 ${stat.color}/10`}>
                  {/* Icon color chip for visual accent */}
                  <div
                    className={`h-6 w-6 rounded-md ${stat.color} bg-current`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}

// =====================================================
