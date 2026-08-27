import { Hash, QrCode } from "lucide-react";
import StatusBadge from "./StatusBadge";
import AllocationTypeBadge from "./AllocationTypeBadge";

interface SeriesHeaderProps {
  series: any;
}

const SeriesHeader = ({ series }: SeriesHeaderProps) => {
  return (
    <div className="p-6 border-b border-border/70">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-2">
              <Hash className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-lg text-foreground">
                  {series.seriesName}
                </p>
                <QrCode className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                ID: {series.id} • {series.seriesCode || "AWB Series"}
              </p>
            </div>
          </div>
          <StatusBadge status={series.status} />
          <AllocationTypeBadge type={series.allocation.type} />
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="max-w-[28rem] break-all text-right font-mono text-sm font-medium text-foreground">
              {series.prefix}{String(series.startRange).padStart(series.numberWidth || String(series.endRange).length, "0")} through {series.prefix}{String(series.endRange).padStart(series.numberWidth || String(series.endRange).length, "0")}
            </p>
            <p className="text-xs text-muted-foreground">Inclusive range</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeriesHeader;