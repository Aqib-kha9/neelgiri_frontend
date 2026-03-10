import { Truck, Download, RefreshCw, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface DRSHeaderProps {
  autoRefresh: boolean;
  setAutoRefresh: (value: boolean) => void;
  onImport?: () => void;
  onExport?: () => void;
}

const DRSHeader = ({ autoRefresh, setAutoRefresh, onImport, onExport }: DRSHeaderProps) => {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-blue-100 p-2">
            <Truck className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Active DRS</h1>
            <p className="text-muted-foreground">
              Monitor currently active Delivery Run Sheets and progress
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
          <span className="text-sm text-muted-foreground">Auto Refresh</span>
        </div>
        <Button variant="outline" className="gap-2 rounded-xl border-border/70" onClick={onImport}>
          <Upload className="h-4 w-4" />
          Import
        </Button>
        <Button variant="outline" className="gap-2 rounded-xl border-border/70" onClick={onExport}>
          <Download className="h-4 w-4" />
          Export Report
        </Button>
        <Button className="gap-2 rounded-xl bg-primary text-primary-foreground shadow-brand">
          <RefreshCw className="h-4 w-4" />
          Refresh Now
        </Button>
      </div>
    </div>
  );
};

export default DRSHeader;
