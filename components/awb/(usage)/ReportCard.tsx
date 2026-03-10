import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  FileText,
  Download,
  Eye,
  Printer,
  Share2,
  RefreshCw,
  Trash2,
  BarChart3,
  Calendar,
  Filter,
  DownloadCloud,
  FileSpreadsheet,
  AlertCircle,
  Clock,
} from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { ReportTypeBadge } from "./ReportTypeBadge";

interface ReportCardProps {
  report: any;
  onDownload: (reportId: string) => void;
  onDelete: (reportId: string) => void;
}

export const ReportCard = ({
  report,
  onDownload,
  onDelete,
}: ReportCardProps) => {
  return (
    <Card
      key={report.id}
      className="rounded-2xl border-border/70 bg-card/95 shadow-card hover:shadow-lg transition-all duration-300"
    >
      <CardContent className="p-0">
        {/* Header Section */}
        <div className="p-6 border-b border-border/70">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-100 p-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-lg text-foreground">
                      {report.name}
                    </p>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ID: {report.id} • Period: {report.period}
                  </p>
                </div>
              </div>
              <ReportTypeBadge type={report.type} />
              <StatusBadge status={report.status} />
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {report.recordCount.toLocaleString()} records
                </p>
                <p className="text-xs text-muted-foreground">{report.size}</p>
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
                  <DropdownMenuItem
                    className="flex items-center gap-2 rounded-lg"
                    onClick={() => onDownload(report.id)}
                  >
                    <Download className="h-4 w-4" />
                    Download Report
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                    <Eye className="h-4 w-4" />
                    Preview Report
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                    <Printer className="h-4 w-4" />
                    Print Report
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                    <Share2 className="h-4 w-4" />
                    Share Report
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                    <RefreshCw className="h-4 w-4" />
                    Regenerate
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-2 rounded-lg text-red-600"
                    onClick={() => onDelete(report.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Report Summary */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-foreground">
                    Report Summary
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Series</p>
                      <p className="font-medium">
                        {report.summary.totalSeries}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Used</p>
                      <p className="font-medium">
                        {report.summary.totalUsed.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Utilization</p>
                      <p className="font-medium">
                        {report.summary.utilizationRate}%
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Revenue</p>
                      <p className="font-medium text-green-600">
                        {report.summary.revenue}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Generation Details */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-foreground">
                    Generation Details
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Generated:</span>
                      <span className="font-medium">
                        {new Date(report.generatedAt).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">By:</span>
                      <span className="font-medium">{report.generatedBy}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Records:</span>
                      <span className="font-medium">
                        {report.recordCount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">File Size:</span>
                      <span className="font-medium">{report.size}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Applied Filters */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-semibold text-foreground">
                    Applied Filters
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Date Range:</span>
                    <span className="font-medium">
                      {report.filters.dateRange}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Series:</span>
                    <span className="font-medium">{report.filters.series}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Allocation Type:
                    </span>
                    <span className="font-medium">
                      {report.filters.allocationType}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium">{report.filters.status}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <DownloadCloud className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    Quick Actions
                  </span>
                </div>
                <div className="space-y-2">
                  <Button
                    size="sm"
                    className="w-full gap-2 rounded-lg bg-primary text-primary-foreground"
                    onClick={() => onDownload(report.id)}
                    disabled={report.status !== "completed"}
                  >
                    <Download className="h-3 w-3" />
                    Download PDF
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full gap-2 rounded-lg border-border/70"
                    disabled={report.status !== "completed"}
                  >
                    <FileSpreadsheet className="h-3 w-3" />
                    Export Excel
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full gap-2 rounded-lg border-border/70"
                    disabled={report.status !== "completed"}
                  >
                    <Printer className="h-3 w-3" />
                    Print Report
                  </Button>
                  {report.status === "processing" && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                      <div className="flex items-center gap-2 text-yellow-700">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs font-medium">
                          Processing...
                        </span>
                      </div>
                    </div>
                  )}
                  {report.status === "failed" && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                      <div className="flex items-center gap-2 text-red-700">
                        <AlertCircle className="h-3 w-3" />
                        <span className="text-xs font-medium">
                          Generation failed
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
