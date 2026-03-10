import { Upload, Scan, Scale, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  onBulkUpload?: () => void;
  onBatchScan?: () => void;
  onBulkWeigh?: () => void;
  onAutoAssign?: () => void;
}

const QuickActions = ({ onBulkUpload, onBatchScan, onBulkWeigh, onAutoAssign }: QuickActionsProps) => {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              Processing Tools
            </p>
            <p className="text-xs text-muted-foreground">
              Quick actions for inward processing
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70"
              onClick={onBulkUpload}
            >
              <Upload className="h-4 w-4" />
              Bulk Upload
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70"
              onClick={onBatchScan}
            >
              <Scan className="h-4 w-4" />
              Batch Scan
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70"
              onClick={onBulkWeigh}
            >
              <Scale className="h-4 w-4" />
              Bulk Weighing
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70"
              onClick={onAutoAssign}
            >
              <RefreshCw className="h-4 w-4" />
              Auto Assign
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
