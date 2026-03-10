import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  IndianRupee,
  Shield,
  Calendar,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
} from "lucide-react";

const complianceData = {
  overview: {
    totalBranches: 48,
    compliantBranches: 42,
    nonCompliantBranches: 4,
    pendingBranches: 2,
    complianceRate: 87.5,
  },
  gstStatus: {
    nextDeadline: "2024-12-20",
  },
};

const taxSummary = {
  currentQuarter: {
    gstCollected: 42.8,
    gstPaid: 38.2,
    netLiability: 4.6,
    filingStatus: "87% Filed",
  },
  growth: {
    collected: 12.3,
    paid: 10.7,
    liability: 27.8,
  },
};

const gstFilings = [
  {
    id: "GSTR-001",
    branch: "Mumbai Central Hub",
    period: "Nov 2024",
    type: "GSTR-3B",
    filedDate: "2024-12-05",
    taxAmount: 2.8,
    status: "filed" as const,
  },
  {
    id: "GSTR-002",
    branch: "Delhi North Gateway",
    period: "Nov 2024",
    type: "GSTR-3B",
    filedDate: "2024-12-04",
    taxAmount: 1.9,
    status: "filed" as const,
  },
  {
    id: "GSTR-003",
    branch: "Bangalore Tech Park",
    period: "Nov 2024",
    type: "GSTR-3B",
    filedDate: "2024-12-03",
    taxAmount: 1.7,
    status: "filed" as const,
  },
  {
    id: "GSTR-004",
    branch: "Kolkata Eastern Hub",
    period: "Nov 2024",
    type: "GSTR-3B",
    filedDate: "2024-12-02",
    taxAmount: 0.9,
    status: "filed" as const,
  },
];

const formatCurrency = (amount: number) => {
  return `₹${amount.toFixed(1)}L`;
};

const getGSTStatusBadge = (status: string) => {
  switch (status) {
    case "filed":
      return (
        <Badge variant="success" className="rounded-full">
          Filed
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="warning" className="rounded-full">
          Pending
        </Badge>
      );
    case "overdue":
      return (
        <Badge variant="error" className="rounded-full">
          Overdue
        </Badge>
      );
    case "filed_late":
      return (
        <Badge variant="warning" className="rounded-full">
          Filed Late
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className="rounded-full">
          Unknown
        </Badge>
      );
  }
};

const OverviewTab = () => {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Tax Summary */}
      <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
            <IndianRupee className="h-5 w-5 text-primary" />
            Tax Summary
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Quarterly GST overview and comparison
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-border/60 p-4 text-center">
                <p className="text-xl lg:text-2xl font-bold text-foreground">
                  {formatCurrency(taxSummary.currentQuarter.gstCollected)}
                </p>
                <p className="text-sm text-muted-foreground">GST Collected</p>
                <div className="flex items-center justify-center gap-1 text-xs text-success">
                  <TrendingUp className="h-3 w-3" />+
                  {taxSummary.growth.collected}%
                </div>
              </div>
              <div className="rounded-2xl border border-border/60 p-4 text-center">
                <p className="text-xl lg:text-2xl font-bold text-foreground">
                  {formatCurrency(taxSummary.currentQuarter.gstPaid)}
                </p>
                <p className="text-sm text-muted-foreground">GST Paid</p>
                <div className="flex items-center justify-center gap-1 text-xs text-success">
                  <TrendingUp className="h-3 w-3" />+{taxSummary.growth.paid}%
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-center">
              <p className="text-xl lg:text-2xl font-bold text-foreground">
                {formatCurrency(taxSummary.currentQuarter.netLiability)}
              </p>
              <p className="text-sm text-muted-foreground">Net GST Liability</p>
              <div className="flex items-center justify-center gap-1 text-xs text-warning">
                <TrendingUp className="h-3 w-3" />+{taxSummary.growth.liability}
                %
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Filing Progress
              </span>
              <span className="text-sm font-medium">
                {taxSummary.currentQuarter.filingStatus}
              </span>
            </div>
            <Progress value={87} className="h-2" />

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Current Quarter</span>
              <span>
                Due:{" "}
                {new Date(
                  complianceData.gstStatus.nextDeadline
                ).toLocaleDateString("en-IN")}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Status */}
      <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Shield className="h-5 w-5 text-primary" />
            Compliance Status
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Branch-wise compliance overview
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-sm font-medium">Compliant Branches</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-foreground">
                  {complianceData.overview.compliantBranches}
                </p>
                <p className="text-xs text-muted-foreground">
                  {complianceData.overview.complianceRate}% of total
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span className="text-sm font-medium">
                  Non-Compliant Branches
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-foreground">
                  {complianceData.overview.nonCompliantBranches}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(
                    (complianceData.overview.nonCompliantBranches /
                      complianceData.overview.totalBranches) *
                    100
                  ).toFixed(1)}
                  % of total
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-info" />
                <span className="text-sm font-medium">Pending Review</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-foreground">
                  {complianceData.overview.pendingBranches}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(
                    (complianceData.overview.pendingBranches /
                      complianceData.overview.totalBranches) *
                    100
                  ).toFixed(1)}
                  % of total
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-success/20 bg-success/5 p-4">
            <div className="text-center">
              <p className="text-xl lg:text-2xl font-bold text-foreground">
                {complianceData.overview.complianceRate}%
              </p>
              <p className="text-sm text-muted-foreground">
                Overall Compliance Rate
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Deadlines */}
      <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Calendar className="h-5 w-5 text-primary" />
            Upcoming Deadlines
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Important compliance and filing dates
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              type: "GSTR-3B Filing",
              deadline: "2024-12-20",
              branches: "All Branches",
              status: "upcoming" as const,
            },
            {
              type: "GSTR-1 Filing",
              deadline: "2024-12-11",
              branches: "Hyderabad, Pune",
              status: "urgent" as const,
            },
            {
              type: "Tax Audit",
              deadline: "2024-12-31",
              branches: "Mumbai, Delhi",
              status: "upcoming" as const,
            },
            {
              type: "Annual Return",
              deadline: "2025-03-31",
              branches: "All Branches",
              status: "future" as const,
            },
          ].map((deadline, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-2xl border border-border/60 p-4"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  {deadline.type}
                </p>
                <p className="text-xs text-muted-foreground">
                  {deadline.branches}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">
                  {new Date(deadline.deadline).toLocaleDateString("en-IN")}
                </p>
                <Badge
                  variant={
                    deadline.status === "urgent"
                      ? "error"
                      : deadline.status === "upcoming"
                      ? "warning"
                      : "success"
                  }
                  className="rounded-full text-xs"
                >
                  {deadline.status === "urgent"
                    ? "Urgent"
                    : deadline.status === "upcoming"
                    ? "Upcoming"
                    : "Future"}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
            <FileCheck className="h-5 w-5 text-primary" />
            Recent Activities
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Latest compliance activities and updates
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {gstFilings.slice(0, 4).map((filing) => (
            <div
              key={filing.id}
              className="flex items-center justify-between rounded-2xl border border-border/60 p-4"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  {filing.branch}
                </p>
                <p className="text-xs text-muted-foreground">
                  {filing.type} - {filing.period}
                </p>
                <p className="text-xs text-muted-foreground">
                  Filed:{" "}
                  {new Date(filing.filedDate).toLocaleDateString("en-IN")}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-foreground">
                  {formatCurrency(filing.taxAmount)}
                </div>
                {getGSTStatusBadge(filing.status)}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;
