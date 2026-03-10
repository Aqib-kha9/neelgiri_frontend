import { Hash, QrCode, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import StatusBadge from "./StatusBadge";
import AllocationTypeBadge from "./AllocationTypeBadge";
import { 
  Eye, 
  Edit3, 
  Copy, 
  RefreshCw, 
  Download, 
  Trash2 
} from "lucide-react";

interface SeriesHeaderProps {
  series: any;
}

const SeriesHeader = ({ series }: SeriesHeaderProps) => {
  const handleDeleteSeries = (id: string) => {
    console.log("Delete series:", id);
  };

  const handleDuplicateSeries = (series: any) => {
    console.log("Duplicate series:", series);
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    console.log("Toggle status for:", id, "from", currentStatus);
  };

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
                ID: {series.id} • {series.prefix}
                {series.seriesCode} Series
              </p>
            </div>
          </div>
          <StatusBadge status={series.status} />
          <AllocationTypeBadge type={series.allocation.type} />
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">
              {series.startRange.toLocaleString()} -{" "}
              {series.endRange.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Range</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg border-border/70"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                <Eye className="h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                <Edit3 className="h-4 w-4" />
                Edit Series
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 rounded-lg"
                onClick={() => handleDuplicateSeries(series)}
              >
                <Copy className="h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 rounded-lg"
                onClick={() => handleToggleStatus(series.id, series.status)}
              >
                <RefreshCw className="h-4 w-4" />
                {series.status === "active" ? "Suspend" : "Activate"}
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                <Download className="h-4 w-4" />
                Export Usage
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 rounded-lg text-red-600"
                onClick={() => handleDeleteSeries(series.id)}
              >
                <Trash2 className="h-4 w-4" />
                Delete Series
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default SeriesHeader;