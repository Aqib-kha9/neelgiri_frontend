import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IndianRupee } from "lucide-react";

export function RevenueSharingPanel({
  data,
}: {
  data: {
    partner: string;
    revenue: number;
    commission: number;
    payout: string;
    status: "paid" | "pending" | "processing";
  }[];
}) {
  return (
    <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold text-foreground">
            Revenue Sharing & Commissions
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Q4 revenue distribution and payouts
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1 rounded-lg border-border/80"
        >
          <IndianRupee className="h-4 w-4" />
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((partner) => (
          <div
            key={partner.partner}
            className="flex items-center justify-between rounded-2xl border border-border/60 p-4"
          >
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                {partner.partner}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>Revenue: ₹{partner.revenue}L</span>
                <span>Commission: {partner.commission}L</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-foreground">
                {partner.payout}
              </div>
              <Badge
                variant={
                  partner.status === "paid"
                    ? "success"
                    : partner.status === "pending"
                    ? "warning"
                    : "secondary" // Changed from "primary" to "secondary"
                }
                className="rounded-full text-xs"
              >
                {partner.status}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
