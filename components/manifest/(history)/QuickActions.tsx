// app/dashboard/manifest/history/components/QuickActions.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  BarChart3,
  Filter,
  Calendar,
  RefreshCw,
  FileText,
} from "lucide-react";

interface QuickActionsProps {
  onExport?: () => void;
  onGenerateReport?: () => void;
}

const QuickActions = ({ onExport, onGenerateReport }: QuickActionsProps) => {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">History Tools</p>
            <p className="text-xs text-muted-foreground">
              Quick actions for historical data analysis
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70"
              onClick={onExport}
            >
              <Download className="h-4 w-4" />
              Export Data
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70"
              onClick={onGenerateReport}
            >
              <BarChart3 className="h-4 w-4" />
              Generate Report
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70"
            >
              <Filter className="h-4 w-4" />
              Custom Filter
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70"
            >
              <Calendar className="h-4 w-4" />
              Date Range
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70"
            >
              <FileText className="h-4 w-4" />
              Audit Log
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
