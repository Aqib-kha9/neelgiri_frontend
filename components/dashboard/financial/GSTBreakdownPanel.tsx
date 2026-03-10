import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function GSTBreakdownPanel({
  data,
}: {
  data: { name: string; value: number; color: string }[];
}) {
  return (
    <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold text-foreground">
            GST Collection Breakdown
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Distribution of GST types collected
          </p>
        </div>
        <Badge className="rounded-full bg-primary/15 px-3 py-1 text-primary">
          ₹4.2L Total
        </Badge>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex h-60 items-center justify-center">
          <div className="relative">
            {/* Simplified Pie UI (center value) */}
            <div className="flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-success/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">₹4.2L</div>
                <div className="text-xs text-muted-foreground">
                  GST Collected
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${item.color}`} />
                <span className="text-sm font-medium text-foreground">
                  {item.name}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-foreground">
                  {item.value}%
                </div>
                <div className="text-xs text-muted-foreground">
                  ₹{((item.value / 100) * 4.2).toFixed(1)}L
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
