import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Shield, AlertTriangle, Calendar, Download } from "lucide-react";

export function PartnerPerformanceHeader() {
  return (
    <section className="rounded-3xl border border-border/70 bg-card/95 p-7 shadow-card">
      <div className="flex flex-wrap sm:flex-nowrap items-start justify-between gap-5">
        <div className="space-y-3">
          <Badge className="rounded-full bg-primary/15 px-4 py-1 text-primary">
            Partner Network Intelligence
          </Badge>
          <div className="space-y-2 ">
            <h1 className="text-display-1 leading-tight">
              Partner Performance & SLA Compliance
            </h1>
            <p className="max-w-2xl text-body">
              Monitor partner performance scores, SLA compliance, revenue
              sharing, and incentive programs across your delivery network.
              Drive excellence through data-driven partnerships.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1">
              <Award className="h-3.5 w-3.5 text-success" />
              Avg. performance: 8.7/10
            </span>
            <span className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
              <Shield className="h-3.5 w-3.5 text-primary" />
              SLA compliance: 94.2%
            </span>
            <span className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
              <AlertTriangle className="h-3.5 w-3.5 text-warning" />6 partners
              need attention
            </span>
          </div>
        </div>

        <Card className="space-y-3 rounded-3xl border border-primary/30 bg-primary/5 p-5">
          <CardContent className="p-0 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Performance Period
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
                <span>Top performer</span>
                <span className="font-semibold text-foreground">
                  LogiMax (9.2)
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Incentives paid</span>
                <span className="font-semibold text-foreground">₹2.8L</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Network coverage</span>
                <span className="font-semibold text-foreground">
                  124 cities
                </span>
              </div>
            </div>
            <Button className="w-full gap-2 rounded-lg bg-primary text-primary-foreground shadow-brand">
              <Download className="h-4 w-4" />
              Export Partner Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
