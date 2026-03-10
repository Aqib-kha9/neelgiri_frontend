// components/manifest/counter/bulk/components/BulkManifestTools.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Download, RefreshCw, Settings, FileText } from "lucide-react";

interface BulkManifestToolsProps {
  onUpload: () => void;
  onDownloadTemplate?: () => void;
}

const BulkManifestTools = ({ onUpload, onDownloadTemplate }: BulkManifestToolsProps) => {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              Bulk Processing Tools
            </p>
            <p className="text-xs text-muted-foreground">
              Quick actions for bulk manifest management
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70"
              onClick={onDownloadTemplate}
            >
              <Download className="h-4 w-4" />
              Download Template
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70"
              onClick={onUpload}
            >
              <Upload className="h-4 w-4" />
              Bulk Upload
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70"
            >
              <FileText className="h-4 w-4" />
              Validate Data
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70"
            >
              <RefreshCw className="h-4 w-4" />
              Auto Process
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkManifestTools;
