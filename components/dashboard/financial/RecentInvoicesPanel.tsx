import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export function RecentInvoicesPanel({
  data,
}: {
  data: {
    id: string;
    customer: string;
    amount: string;
    gst: string;
    status: string;
    dueDate: string;
    type: string;
  }[];
}) {
  return (
    <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold text-foreground">
            Recent Invoices
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Latest invoice status and collections
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1 rounded-lg border-border/80"
        >
          <FileText className="h-4 w-4" />
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((invoice) => (
          <div
            key={invoice.id}
            className="flex items-center justify-between rounded-2xl border border-border/60 p-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {invoice.id}
                </span>
                <Badge
                  variant={
                    invoice.status === "paid"
                      ? "success"
                      : invoice.status === "overdue"
                      ? "destructive"
                      : "warning"
                  }
                  className="rounded-full text-xs"
                >
                  {invoice.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {invoice.customer}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>Due: {invoice.dueDate}</span>
                <span>Type: {invoice.type}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-foreground">
                {invoice.amount}
              </div>
              <div className="text-xs text-muted-foreground">
                GST: {invoice.gst}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
