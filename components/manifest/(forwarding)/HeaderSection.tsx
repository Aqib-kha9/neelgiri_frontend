// app/dashboard/manifest/forwarding/create/components/HeaderSection.tsx
import { Truck, Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderSectionProps {
  onExport?: () => void;
  onNewManifest?: () => void;
}

const HeaderSection = ({ onExport, onNewManifest }: HeaderSectionProps) => {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-green-100 p-2">
            <Truck className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Forwarding Manifest
            </h1>
            <p className="text-muted-foreground">
              Create and manage forwarding manifests for hub transfers
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
          Export Manifest
        </Button>
        <Button
          className="gap-2 rounded-xl bg-primary text-primary-foreground shadow-brand"
          onClick={onNewManifest}
        >
          <Plus className="h-4 w-4" />
          New Manifest
        </Button>
      </div>
    </div>
  );
};

export default HeaderSection;
