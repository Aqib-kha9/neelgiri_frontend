import { QrCode } from "lucide-react";

interface AWBPreviewProps {
  series: {
    prefix: string;
    seriesCode: string;
    current: number;
  };
}

export const AWBPreview = ({ series }: AWBPreviewProps) => {
  return (
    <div className="bg-muted/30 rounded-lg p-3 border border-border/60">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">AWB Format</span>
        <QrCode className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <div className="font-mono text-sm bg-background rounded px-2 py-1 border">
          {series.prefix}
          {series.seriesCode}
          {series.current.toString().padStart(7, "0")}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Next Available</span>
          <span>#{series.current}</span>
        </div>
      </div>
    </div>
  );
};
