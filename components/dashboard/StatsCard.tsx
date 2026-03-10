// ===================== StatsCard.tsx =====================
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  changeLabel: string;
  changeValue: string;
  trend: "up" | "down";
  suffix?: string;
}

export function StatsCard({
  title,
  value,
  changeLabel,
  changeValue,
  trend,
  suffix,
}: StatsCardProps) {
  return (
    <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold text-foreground">
              {value}
              {suffix && (
                <span className="text-lg text-muted-foreground">{suffix}</span>
              )}
            </p>
            <p className="text-xs text-muted-foreground">{changeLabel}</p>
          </div>
          <span
            className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
              trend === "up"
                ? "bg-success/15 text-success"
                : "bg-destructive/15 text-destructive"
            }`}
          >
            {trend === "up" ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
            {changeValue}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
