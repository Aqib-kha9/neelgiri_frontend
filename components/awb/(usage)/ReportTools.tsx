import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  BarChart3,
  FileText,
  CheckCircle2,
  PieChart,
} from "lucide-react";

export const ReportTools = () => {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              Report Generation Tools
            </p>
            <p className="text-xs text-muted-foreground">
              Quickly generate standard reports
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70"
            >
              <Calendar className="h-4 w-4" />
              Daily Report
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70"
            >
              <BarChart3 className="h-4 w-4" />
              Weekly Summary
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70"
            >
              <FileText className="h-4 w-4" />
              Monthly Analysis
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70"
            >
              <CheckCircle2 className="h-4 w-4" />
              Reconciliation
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70"
            >
              <PieChart className="h-4 w-4" />
              Custom Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
