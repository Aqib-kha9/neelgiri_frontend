import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Eye } from "lucide-react";

interface HeaderSectionProps {
  onExport?: () => void;
}

const HeaderSection = ({ onExport }: HeaderSectionProps) => {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-green-100 p-2">
            <Eye className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Customer Tracking
            </h1>
            <p className="text-muted-foreground">
              Monitor and track customer shipments in real-time
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
        <Button className="gap-2 rounded-xl bg-primary text-primary-foreground shadow-brand">
          <RefreshCw className="h-4 w-4" />
          Refresh All
        </Button>
      </div>
    </div>
  );
};

export default HeaderSection;
