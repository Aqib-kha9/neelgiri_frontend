import { Card, CardContent } from "@/components/ui/card";
import { Truck, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";

interface StatsProps {
  stats: {
    totalDispatches: number;
    pendingDispatch: number;
    inTransit: number;
    deliveredToday: number;
    delayed: number;
    onTimeRate: number;
  };
}

const StatisticsSection = ({ stats }: StatsProps) => {
  const statItems = [
    {
      title: "Total Dispatches",
      value: stats.totalDispatches,
      icon: Truck,
      change: "+5.4%",
      trend: "up",
      description: "total created",
    },
    {
      title: "Active Dispatches",
      value: stats.inTransit + stats.pendingDispatch,
      icon: Clock,
      change: "+8",
      trend: "up",
      description: "in progress",
    },
    {
      title: "Delivered Today",
      value: stats.deliveredToday,
      icon: CheckCircle2,
      change: `${stats.onTimeRate}%`,
      trend: "up",
      description: "on time rate",
    },
    {
      title: "Delayed / Issues",
      value: stats.delayed,
      icon: AlertTriangle,
      change: "-2",
      trend: "down",
      description: "needs attention",
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((stat, index) => (
        <Card
          key={index}
          className="relative overflow-hidden rounded-2xl border-border/70 bg-card/95 shadow-card transition-all hover:shadow-lg"
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                  {stat.value}
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span
                className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${stat.trend === "up"
                    ? "bg-success/15 text-success"
                    : stat.trend === "down"
                      ? "bg-error/15 text-error"
                      : "bg-muted text-muted-foreground"
                  }`}
              >
                {stat.change}
              </span>
              <span className="text-xs text-muted-foreground">
                {stat.description}
              </span>
            </div>
          </CardContent>
          <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 translate-y--8 rounded-full bg-primary/5 blur-2xl" />
        </Card>
      ))}
    </div>
  );
};

export default StatisticsSection;
