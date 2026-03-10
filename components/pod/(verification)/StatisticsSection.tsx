import { Clock, CheckCircle2, BarChart3, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StatsProps {
  stats: {
    totalPending: number;
    verifiedToday: number;
    rejectionRate: number;
    avgVerificationTime: string;
    automationRate: number;
    qualityScore: number;
    highRiskCases: number;
  };
}

const StatisticsSection = ({ stats }: StatsProps) => {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-blue-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Pending Verification
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {stats.totalPending}
                </span>
                <Badge variant="warning" className="rounded-full text-xs">
                  Attention
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting validation
              </p>
            </div>
            <div className="rounded-2xl bg-blue-100 p-3">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-green-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Verified Today
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {stats.verifiedToday}
                </span>
                <Badge variant="success" className="rounded-full text-xs">
                  {stats.automationRate}%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Automation rate</p>
            </div>
            <div className="rounded-2xl bg-green-100 p-3">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-orange-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Quality Score
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {stats.qualityScore}%
                </span>
                <Badge variant="success" className="rounded-full text-xs">
                  Excellent
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Average verification quality
              </p>
            </div>
            <div className="rounded-2xl bg-orange-100 p-3">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-red-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                High Risk Cases
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {stats.highRiskCases}
                </span>
                <Badge variant="error" className="rounded-full text-xs">
                  Critical
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Require immediate attention
              </p>
            </div>
            <div className="rounded-2xl bg-red-100 p-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsSection;
