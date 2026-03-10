import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { PieChart, BarChart3 } from "lucide-react";
import { QuickStatCard } from "./QuickStatCard";
import { FileText, CheckCircle2, Hash, DownloadCloud } from "lucide-react";

interface ReportAnalyticsProps {
  totalReports: number;
  completedReports: number;
  totalRecords: number;
  totalSize: string;
}

export const ReportAnalytics = ({
  totalReports,
  completedReports,
  totalRecords,
  totalSize,
}: ReportAnalyticsProps) => {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <PieChart className="h-5 w-5 text-primary" />
          Report Analytics
        </CardTitle>
        <CardDescription>
          Comprehensive overview of report generation and usage patterns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <QuickStatCard
            title="Total Reports"
            value={totalReports.toLocaleString()}
            subtitle="All generated reports"
            icon={FileText}
            color="text-blue-600"
          />
          <QuickStatCard
            title="Completed Reports"
            value={completedReports.toLocaleString()}
            subtitle="Successfully generated"
            icon={CheckCircle2}
            color="text-green-600"
          />
          <QuickStatCard
            title="Total Records"
            value={totalRecords.toLocaleString()}
            subtitle="Across all reports"
            icon={Hash}
            color="text-purple-600"
          />
          <QuickStatCard
            title="Total Data Size"
            value={`${totalSize} MB`}
            subtitle="Compressed report data"
            icon={DownloadCloud}
            color="text-orange-600"
          />
        </div>

        <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50/50 p-4">
          <div className="flex items-start gap-3">
            <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Report Generation Tips
              </p>
              <p className="text-xs text-muted-foreground">
                Schedule regular reports during off-peak hours for better
                performance. Use custom date ranges for specific analysis
                periods and export in multiple formats for different stakeholder
                requirements.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
