import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function AgingAnalysisPanel({
  data,
}: {
  data: { period: string; amount: number; percentage: number; color: string }[];
}) {
  return (
    <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold text-foreground">
            Payment Aging Analysis
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Outstanding payments by aging period
          </p>
        </div>
        <Badge className="rounded-full bg-warning text-warning-foreground">
          ₹3.8L Due
        </Badge>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-4">
          {data.map((item) => (
            <div key={item.period}>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{item.period}</span>
                <span className="font-semibold text-foreground">
                  ₹{item.amount}K
                </span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-muted/40">
                <div
                  className={`h-full rounded-full ${item.color}`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                <span>{item.percentage}% of total</span>
                <span>₹{(item.amount * 1000).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-2xl bg-muted/40 p-4 text-xs text-muted-foreground">
          Focus on reducing 31-60 days bucket. Consider payment reminders and
          early payment incentives.
        </div>
      </CardContent>
    </Card>
  );
}
