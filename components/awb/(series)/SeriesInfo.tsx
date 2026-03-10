import { FileText, QrCode } from "lucide-react";

interface SeriesInfoProps {
  series: any;
}

const SeriesInfo = ({ series }: SeriesInfoProps) => {
  const AWBPreview = ({ series }: { series: any }) => {
    return (
      <div className="bg-muted/30 rounded-lg p-3 border border-border/60">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            AWB Format
          </span>
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

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border/60 p-4">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-semibold text-foreground">
            Series Information
          </span>
        </div>
        <div className="space-y-3">
          <AWBPreview series={series} />

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Range:</span>
              <span className="font-mono font-medium">
                {series.startRange} - {series.endRange}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Current:</span>
              <span className="font-mono font-medium">#{series.current}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Numbers:</span>
              <span className="font-medium">
                {(series.endRange - series.startRange + 1).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeriesInfo;
