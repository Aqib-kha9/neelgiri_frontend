import { Button } from "@/components/ui/button";
import { AlertTriangle, Download, Plus } from "lucide-react";

interface ExceptionsHeaderProps {
  onExport: () => void;
  onNewException: () => void;
}

export const ExceptionsHeader = ({
  onExport,
  onNewException,
}: ExceptionsHeaderProps) => {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-red-100 p-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Exceptions</h1>
            <p className="text-muted-foreground">
              Handle shipment exceptions, delays, and special handling cases
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          className="gap-2 rounded-xl border-border/70"
          onClick={onExport}
        >
          <Download className="h-4 w-4" />
          Export Report
        </Button>
        <Button
          className="gap-2 rounded-xl bg-primary text-primary-foreground shadow-brand"
          onClick={onNewException}
        >
          <Plus className="h-4 w-4" />
          New Exception
        </Button>
      </div>
    </div>
  );
};
