// app/dashboard/manifest/forwarding/create/components/QuickActions.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Truck, Package, RefreshCw } from "lucide-react";

interface QuickActionsProps {
  onBulkUpload?: () => void;
  onVehicleAssign?: () => void;
  onBatchSelect?: () => void;
  onAutoGenerate?: () => void;
}

const QuickActions = ({ onBulkUpload, onVehicleAssign, onBatchSelect, onAutoGenerate }: QuickActionsProps) => {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              Forwarding Tools
            </p>
            <p className="text-xs text-muted-foreground">
              Quick actions for manifest creation
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
              onClick={onVehicleAssign}
            >
              <Truck className="h-4 w-4" />
              Vehicle Assignment
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70"
              onClick={onBatchSelect}
            >
              <Package className="h-4 w-4" />
              Batch Selection
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70"
              onClick={onAutoGenerate}
            >
              <RefreshCw className="h-4 w-4" />
              Auto Generate
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
