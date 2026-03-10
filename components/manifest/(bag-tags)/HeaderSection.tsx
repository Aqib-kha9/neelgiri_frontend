// app/dashboard/manifest/bag-tags/components/HeaderSection.tsx
import { Package, Plus, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderSectionProps {
  onExport?: () => void;
  onPrint?: () => void;
  onNewTag?: () => void;
}

const HeaderSection = ({ onExport, onPrint, onNewTag }: HeaderSectionProps) => {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-purple-100 p-2">
            <Package className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Bag Tags</h1>
            <p className="text-muted-foreground">
              Create and manage bag tags for shipment consolidation
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
          Export Tags
        </Button>
        <Button
          variant="outline"
          className="gap-2 rounded-xl border-border/70"
          onClick={onPrint}
        >
          <Printer className="h-4 w-4" />
          Print Tags
        </Button>
        <Button
          className="gap-2 rounded-xl bg-primary text-primary-foreground shadow-brand"
          onClick={onNewTag}
        >
          <Plus className="h-4 w-4" />
          New Bag Tag
        </Button>
      </div>
    </div>
  );
};

export default HeaderSection;
