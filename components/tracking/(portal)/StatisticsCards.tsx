import { Card, CardContent } from "@/components/ui/card";
import { Eye, CheckCircle2, Truck, BarChart3 } from "lucide-react";

interface StatisticsCardsProps {
  stats: {
    totalActive: number;
    deliveredToday: number;
    inTransit: number;
    exceptions: number;
    onTimeRate: number;
    customerSatisfaction: number;
  };
}

const StatisticsCards = ({ stats }: StatisticsCardsProps) => {
  const statItems = [
    {
      title: "Active Trackings",
      value: stats.totalActive,
      icon: Eye,
      change: "Live",
      trend: "up",
      description: "Currently being tracked",
    },
    {
      title: "Delivered Today",
      value: stats.deliveredToday,
      icon: CheckCircle2,
      change: `${stats.onTimeRate}%`,
      trend: "up",
      description: "On-time delivery rate",
    },
    {
      title: "In Transit",
      value: stats.inTransit,
      icon: Truck,
      change: "Moving",
      trend: "up",
      description: "Active shipments",
    },
    {
      title: "Customer Satisfaction",
      value: stats.customerSatisfaction,
      icon: BarChart3,
      change: "Rating",
      trend: "up",
      description: "Average customer rating",
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
                      ? "bg-warning/15 text-warning"
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

export default StatisticsCards;
