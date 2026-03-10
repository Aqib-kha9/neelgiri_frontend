import { Map, AlertCircle, BarChart3, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MonitoringTools = () => {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              Monitoring Tools
            </p>
            <p className="text-xs text-muted-foreground">
              Real-time tracking and management
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70"
            >
              <Map className="h-4 w-4" />
              Live Map View
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70"
            >
              <AlertCircle className="h-4 w-4" />
              View Alerts
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70"
            >
              <BarChart3 className="h-4 w-4" />
              Performance Report
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70"
            >
              <Download className="h-4 w-4" />
              Bulk Actions
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonitoringTools;
