// app/dashboard/manifest/bag-tags/components/QuickActions.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, Scan, Package, Download, Upload, QrCode } from "lucide-react";

interface QuickActionsProps {
  onBulkPrint?: () => void;
  onScanBag?: () => void;
  onCreateMultiple?: () => void;
  onImportData?: () => void;
  onGenerateQR?: () => void;
}

const QuickActions = ({ onBulkPrint, onScanBag, onCreateMultiple, onImportData, onGenerateQR }: QuickActionsProps) => {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">Bag Tag Tools</p>
            <p className="text-xs text-muted-foreground">
              Quick actions for bag tag management
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70"
              onClick={onBulkPrint}
            >
              <Printer className="h-4 w-4" />
              Bulk Print
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70"
              onClick={onScanBag}
            >
              <Scan className="h-4 w-4" />
              Scan Bag
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70"
              onClick={onCreateMultiple}
            >
              <Package className="h-4 w-4" />
              Create Multiple
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70"
              onClick={onImportData}
            >
              <Upload className="h-4 w-4" />
              Import Data
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70"
              onClick={onGenerateQR}
            >
              <QrCode className="h-4 w-4" />
              Generate QR
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
