// app/dashboard/manifest/history/components/HeaderSection.tsx
import { History, Download, Filter, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderSectionProps {
  onExport?: () => void;
  onRefresh?: () => void;
}

const HeaderSection = ({ onExport, onRefresh }: HeaderSectionProps) => {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-indigo-100 p-2">
            <History className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Manifest History
            </h1>
            <p className="text-muted-foreground">
              View and analyze historical dispatch data and performance
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" className="gap-2 rounded-xl border-border/70">
          <Filter className="h-4 w-4" />
          Advanced Analytics
        </Button>
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
          onClick={onRefresh}
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>
    </div>
  );
};

export default HeaderSection;
