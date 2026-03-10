import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Info, AlertTriangle } from "lucide-react";

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  status: "success" | "info" | "warning";
  timestamp: string;
}

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => {
          const iconMap = {
            success: <CheckCircle2 className="h-4 w-4 text-success" />,
            info: <Info className="h-4 w-4 text-primary" />,
            warning: <AlertTriangle className="h-4 w-4 text-warning" />,
          };

          const badgeColor =
            item.status === "success"
              ? "bg-success/15 text-success"
              : item.status === "info"
              ? "bg-primary/15 text-primary"
              : "bg-warning/15 text-warning";

          return (
            <div
              key={item.id}
              className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-background/80 p-3 transition-colors hover:border-primary/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {iconMap[item.status]}
                  <p className="text-sm font-medium text-foreground">
                    {item.title}
                  </p>
                </div>
                <Badge className={`rounded-full ${badgeColor}`}>
                  {item.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-snug">
                {item.description}
              </p>
              <p className="text-[0.7rem] text-muted-foreground">
                {item.timestamp}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
