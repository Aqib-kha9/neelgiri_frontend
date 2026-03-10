// FILE: src/components/dashboard/operations/OperationsHeader.tsx
// =====================================================
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Truck,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Download,
  RefreshCw,
} from "lucide-react";

export function OperationsHeader() {
  return (
    <section className="rounded-3xl border border-border/70 bg-card/95 p-7 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="space-y-3">
          <Badge className="rounded-full bg-primary/15 px-4 py-1 text-primary">
            Operations Command Center
          </Badge>
          <div className="space-y-2">
            <h1 className="text-display-1 leading-tight">
              Live Operations Intelligence
            </h1>
            <p className="max-w-2xl text-body">
              Monitor real-time shipment lifecycle, hub performance, rider
              efficiency, and exception tracking across your delivery network.
              Optimize operations with live insights and predictive analytics.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1">
              <Truck className="h-3.5 w-3.5 text-primary" />
              1,248 active shipments
            </span>
            <span className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
              <AlertTriangle className="h-3.5 w-3.5 text-warning" />
              23 exceptions pending
            </span>
            <span className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-success" />
              96.2% on-time delivery
            </span>
          </div>
        </div>
        <Card className="space-y-3 rounded-3xl border border-primary/30 bg-primary/5 p-5">
          <CardContent className="p-0 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Operations Period
                </p>
                <p className="text-lg font-bold text-foreground">
                  Today · 12 Dec 2024
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-lg border-border/70"
              >
                <Calendar className="h-4 w-4" />
                Date Range
              </Button>
            </div>
            <div className="grid gap-3 text-sm">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Active hubs</span>
                <span className="font-semibold text-foreground">24/28</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Riders on duty</span>
                <span className="font-semibold text-foreground">184</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Vehicles deployed</span>
                <span className="font-semibold text-foreground">92</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 gap-2 rounded-lg bg-primary text-primary-foreground shadow-brand">
                <Download className="h-4 w-4" />
                Export Report
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-lg border-border/70"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

// =====================================================
