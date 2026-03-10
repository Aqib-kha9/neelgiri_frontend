import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function RevenueGSTPanel({
  data,
}: {
  data: { month: string; revenue: number; gst: number }[];
}) {
  return (
    <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold text-foreground">
            Revenue Trend & GST Collection
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Monthly revenue performance with GST breakdown
          </p>
        </div>
        <Badge className="rounded-full bg-success text-success-foreground">
          +12.4% Growth
        </Badge>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="relative h-60 rounded-2xl bg-gradient-to-br from-primary/10 via-background to-success/10 p-4">
          <div className="flex h-full w-full items-end gap-2">
            {data.map((month) => (
              <div key={month.month} className="flex-1 space-y-1">
                <div className="flex h-32 items-end gap-1">
                  <div
                    className="flex-1 rounded-t-2xl bg-primary"
                    style={{ height: `${(month.revenue / 35) * 100}%` }}
                  />
                  <div
                    className="flex-1 rounded-t-2xl bg-success"
                    style={{ height: `${(month.gst / 6) * 100}%` }}
                  />
                </div>
                <div className="text-center text-[0.65rem] text-muted-foreground">
                  {month.month}
                </div>
              </div>
            ))}
          </div>

          <div className="absolute left-4 top-4 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <span className="text-muted-foreground">Revenue (L)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-success" />
              <span className="text-muted-foreground">GST (L)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
