import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export const StatsCard = ({
  title,
  value,
  change,
  description,
  icon: Icon,
  color,
}: StatsCardProps) => {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">
                {value}
              </span>
              <Badge variant="success" className="rounded-full text-xs">
                {change}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className={`rounded-2xl p-3 ${color}/10`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
