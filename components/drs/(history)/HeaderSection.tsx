import { FileText, Download, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderSectionProps {
  viewMode: string;
  setViewMode: (mode: string) => void;
  onExport?: () => void;
}

const HeaderSection = ({ viewMode, setViewMode, onExport }: HeaderSectionProps) => {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-purple-100 p-2">
            <FileText className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">DRS History</h1>
            <p className="text-muted-foreground">
              View historical Delivery Run Sheets and performance metrics
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-2">
          <Button
            variant={viewMode === "detailed" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("detailed")}
            className="rounded-lg"
          >
            Detailed
          </Button>
          <Button
            variant={viewMode === "summary" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("summary")}
            className="rounded-lg"
          >
            Summary
          </Button>
        </div>
        <Button variant="outline" className="gap-2 rounded-xl border-border/70" onClick={onExport}>
          <Download className="h-4 w-4" />
          Export
        </Button>
        <Button className="gap-2 rounded-xl bg-primary text-primary-foreground shadow-brand">
          <BarChart3 className="h-4 w-4" />
          Analytics
        </Button>
      </div>
    </div>
  );
};

export default HeaderSection;
