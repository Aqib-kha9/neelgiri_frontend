// FILE: src/components/dashboard/operations/ExceptionSummaryPanel.tsx
// (Exact UI for "Exception Analysis")
// =====================================================
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ExceptionSummaryPanel({
  data,
}: {
  data: { type: string; count: number; percentage: number; color: string }[];
}) {
  return (
    <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold text-foreground">
            Exception Analysis
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Breakdown of operational exceptions
          </p>
        </div>
        <Badge className="rounded-full bg-error text-error-foreground">
          23 Total
        </Badge>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-4">
          {data.map((ex) => (
            <div key={ex.type}>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{ex.type}</span>
                <span className="font-semibold text-foreground">
                  {ex.count} cases
                </span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-muted/40">
                <div
                  className={`h-full rounded-full ${ex.color}`}
                  style={{ width: `${ex.percentage}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {ex.percentage}% of total exceptions
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-2xl bg-muted/40 p-4 text-xs text-muted-foreground">
          Address verification workflow optimization could reduce 35% of
          exceptions. Consider implementing pre-delivery SMS confirmations.
        </div>
      </CardContent>
    </Card>
  );
}

// =====================================================
