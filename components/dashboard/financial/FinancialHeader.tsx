import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Download,
  IndianRupee,
  Shield,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

export function FinancialHeader() {
  return (
    <section className="rounded-3xl border border-border/70 bg-card/95 p-7 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="space-y-3">
          <Badge className="rounded-full bg-primary/15 px-4 py-1 text-primary">
            Financial Intelligence
          </Badge>
          <div className="space-y-2">
            <h1 className="text-display-1 leading-tight">
              Revenue Analytics & GST Compliance
            </h1>
            <p className="max-w-2xl text-body">
              Monitor revenue performance, GST collections, tax compliance, and
              financial health across your delivery network. Real-time insights
              for better financial decision-making.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1">
              <IndianRupee className="h-3.5 w-3.5 text-success" />
              Revenue growth: +12.4%
            </span>
            <span className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
              <Shield className="h-3.5 w-3.5 text-primary" />
              GST compliance: 100%
            </span>
            <span className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
              <AlertTriangle className="h-3.5 w-3.5 text-warning" />3 invoices
              overdue
            </span>
          </div>
        </div>

        <Card className="space-y-3 rounded-3xl border border-primary/30 bg-primary/5 p-5">
          <CardContent className="p-0 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Financial Period
                </p>
                <p className="text-lg font-bold text-foreground">
                  Q4 FY2024-25
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-lg border-border/70"
              >
                <Calendar className="h-4 w-4" />
                Change Period
              </Button>
            </div>
            <div className="grid gap-3 text-sm">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Active customers</span>
                <span className="font-semibold text-foreground">248</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Avg. collection days</span>
                <span className="font-semibold text-foreground">18 days</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>ITC utilization</span>
                <span className="font-semibold text-foreground">92%</span>
              </div>
            </div>
            <Button className="w-full gap-2 rounded-lg bg-primary text-primary-foreground shadow-brand">
              <Download className="h-4 w-4" />
              Export Financial Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
