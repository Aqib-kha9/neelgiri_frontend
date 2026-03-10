import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Shield,
  FileText,
  IndianRupee,
  Plus,
  Download,
  Upload,
  MoreHorizontal,
  Eye,
  Calendar,
} from "lucide-react";

const complianceData = {
  overview: {
    totalBranches: 48,
    compliantBranches: 42,
    nonCompliantBranches: 4,
    pendingBranches: 2,
    complianceRate: 87.5,
    gstFilingRate: 92.3,
    taxPaymentRate: 95.1,
  },
  gstStatus: {
    filed: 44,
    pending: 3,
    overdue: 1,
    nextDeadline: "2024-12-20",
  },
  financials: {
    totalGSTCollected: 42.8,
    totalGSTPaid: 38.2,
    netGSTLiability: 4.6,
    lastQuarterGrowth: 12.5,
  },
};

const formatCurrency = (amount: number) => {
  return `₹${amount.toFixed(1)}L`;
};

const GSTHeader = () => {
  return (
    <section className="rounded-3xl border border-border/70 bg-card/95 p-4 lg:p-7 shadow-card">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Left Column - Content */}
        <div className="space-y-4 lg:space-y-6">
          <div className="space-y-2 lg:space-y-3">
            <Badge className="rounded-full bg-primary/15 px-3 lg:px-4 py-1 text-primary text-xs">
              Tax & Compliance
            </Badge>
            <div className="space-y-1 lg:space-y-2">
              <h1 className="text-xl lg:text-display-1 leading-tight font-bold">
                Compliance & GST Management
              </h1>
              <p className="text-sm lg:text-body text-muted-foreground max-w-2xl">
                Monitor GST compliance, tax filings, and regulatory requirements
                across all branches. Stay updated with filing deadlines and
                compliance status.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 lg:gap-2 rounded-full bg-muted/50 px-2 lg:px-3 py-1">
              <Shield className="h-3 w-3 lg:h-3.5 lg:w-3.5 text-success" />
              {complianceData.overview.compliantBranches} compliant branches
            </span>
            <span className="flex items-center gap-1 lg:gap-2 rounded-full bg-muted/40 px-2 lg:px-3 py-1">
              <FileText className="h-3 w-3 lg:h-3.5 lg:w-3.5 text-warning" />
              {complianceData.gstStatus.filed} GST returns filed
            </span>
            <span className="flex items-center gap-1 lg:gap-2 rounded-full bg-muted/40 px-2 lg:px-3 py-1">
              <IndianRupee className="h-3 w-3 lg:h-3.5 lg:w-3.5 text-primary" />
              {formatCurrency(complianceData.financials.totalGSTCollected)} GST
              collected
            </span>
          </div>
        </div>

        {/* Right Column - Actions & Info */}
        <div className="space-y-4 lg:space-y-6">
          <div className="flex flex-col gap-3 lg:gap-4">
            <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
              <Button className="gap-2 rounded-lg bg-primary text-primary-foreground shadow-brand flex-1 min-w-[140px] text-sm">
                <Plus className="h-4 w-4" />
                File GST Return
              </Button>
              <Button
                variant="outline"
                className="gap-2 rounded-lg border-border/70 flex-1 min-w-[140px] text-sm"
              >
                <Download className="h-4 w-4" />
                Export Reports
              </Button>
              <Button
                variant="outline"
                className="gap-2 rounded-lg border-border/70 flex-1 min-w-[140px] text-sm"
              >
                <Upload className="h-4 w-4" />
                Upload Documents
              </Button>
            </div>

            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-lg border-border/70"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                    <Eye className="h-4 w-4" />
                    View Compliance Report
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                    <Calendar className="h-4 w-4" />
                    Schedule Audit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                    <Download className="h-4 w-4" />
                    Download Certificates
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3 lg:p-4 space-y-2 lg:space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Next filing deadline
              </span>
              <span className="font-semibold text-foreground">
                {new Date(
                  complianceData.gstStatus.nextDeadline
                ).toLocaleDateString("en-IN")}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Active alerts</span>
              <span className="font-semibold text-foreground">3 critical</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Pending approvals</span>
              <span className="font-semibold text-foreground">0</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GSTHeader;
