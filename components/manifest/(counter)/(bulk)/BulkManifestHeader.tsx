// components/manifest/counter/bulk/components/BulkManifestHeader.tsx
import { Truck, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BulkManifestHeaderProps {
  onDownloadTemplate?: () => void;
  onNewUpload?: () => void;
}

const BulkManifestHeader = ({ onDownloadTemplate, onNewUpload }: BulkManifestHeaderProps) => {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-blue-100 p-2">
            <Truck className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Bulk Manifest
            </h1>
            <p className="text-muted-foreground">
              Process bulk shipments upload and management
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          className="gap-2 rounded-xl border-border/70"
          onClick={onDownloadTemplate}
        >
          <Download className="h-4 w-4" />
          Download Template
        </Button>
        <Button
          className="gap-2 rounded-xl bg-primary text-primary-foreground shadow-brand"
          onClick={onNewUpload}
        >
          <Upload className="h-4 w-4" />
          New Bulk Upload
        </Button>
      </div>
    </div>
  );
};

export default BulkManifestHeader;
