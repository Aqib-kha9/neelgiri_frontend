import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Download, Filter, Activity } from "lucide-react";

export const QuickActionsCard = () => {
  return (
    <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">
          Quick Actions
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Common branch management tasks
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 rounded-lg border-border/70"
        >
          <Plus className="h-4 w-4" />
          Add New Branch
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start gap-2 rounded-lg border-border/70"
        >
          <Download className="h-4 w-4" />
          Export Branch Data
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start gap-2 rounded-lg border-border/70"
        >
          <Filter className="h-4 w-4" />
          Bulk Status Update
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start gap-2 rounded-lg border-border/70"
        >
          <Activity className="h-4 w-4" />
          Performance Reports
        </Button>
      </CardContent>
    </Card>
  );
};
