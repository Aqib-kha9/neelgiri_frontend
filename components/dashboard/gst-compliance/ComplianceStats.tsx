import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, FileText, IndianRupee, AlertTriangle } from "lucide-react";

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
  },
  financials: {
    totalGSTCollected: 42.8,
    totalGSTPaid: 38.2,
    netGSTLiability: 4.6,
    lastQuarterGrowth: 12.5,
  },
  complianceAlerts: {
    critical: 3,
    warning: 8,
    info: 12,
  },
};

const formatCurrency = (amount: number) => {
  return `₹${amount.toFixed(1)}L`;
};

const ComplianceStats = () => {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardContent className="p-4 lg:p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1 lg:space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Compliance Rate
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl lg:text-2xl font-bold text-foreground">
                  {complianceData.overview.complianceRate}%
                </span>
                <Badge variant="success" className="rounded-full text-xs">
                  +5.2%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {complianceData.overview.compliantBranches} of{" "}
                {complianceData.overview.totalBranches} branches
              </p>
            </div>
            <div className="rounded-2xl bg-success/10 p-2 lg:p-3">
              <Shield className="h-5 w-5 lg:h-6 lg:w-6 text-success" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardContent className="p-4 lg:p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1 lg:space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                GST Filing Rate
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl lg:text-2xl font-bold text-foreground">
                  {complianceData.overview.gstFilingRate}%
                </span>
                <Badge variant="success" className="rounded-full text-xs">
                  +3.1%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {complianceData.gstStatus.filed} of{" "}
                {complianceData.overview.totalBranches} filed
              </p>
            </div>
            <div className="rounded-2xl bg-primary/10 p-2 lg:p-3">
              <FileText className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardContent className="p-4 lg:p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1 lg:space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Total GST Collected
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl lg:text-2xl font-bold text-foreground">
                  {formatCurrency(complianceData.financials.totalGSTCollected)}
                </span>
                <Badge variant="success" className="rounded-full text-xs">
                  +12.5%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Current quarter</p>
            </div>
            <div className="rounded-2xl bg-warning/10 p-2 lg:p-3">
              <IndianRupee className="h-5 w-5 lg:h-6 lg:w-6 text-warning" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardContent className="p-4 lg:p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1 lg:space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Active Alerts
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl lg:text-2xl font-bold text-foreground">
                  {complianceData.complianceAlerts.critical}
                </span>
                <span className="text-xs text-muted-foreground">critical</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {complianceData.complianceAlerts.warning} warnings,{" "}
                {complianceData.complianceAlerts.info} info
              </p>
            </div>
            <div className="rounded-2xl bg-error/10 p-2 lg:p-3">
              <AlertTriangle className="h-5 w-5 lg:h-6 lg:w-6 text-error" />
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default ComplianceStats;
