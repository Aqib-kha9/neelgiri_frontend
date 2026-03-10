import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Signature, CheckCircle2, Clock, BarChart3 } from "lucide-react";

interface SignaturesStatsProps {
  stats: {
    totalSignatures: number;
    pendingVerification: number;
    verifiedToday: number;
    rejectionRate: number;
    avgQualityScore: number;
    digitalAdoption: number;
  };
}

const SignaturesStats = ({ stats }: SignaturesStatsProps) => {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-blue-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Total Signatures
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {stats.totalSignatures}
                </span>
                <Badge variant="success" className="rounded-full text-xs">
                  Digital
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Captured signatures
              </p>
            </div>
            <div className="rounded-2xl bg-blue-100 p-3">
              <Signature className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-orange-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Pending Verification
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {stats.pendingVerification}
                </span>
                <Badge variant="warning" className="rounded-full text-xs">
                  Attention
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting validation
              </p>
            </div>
            <div className="rounded-2xl bg-orange-100 p-3">
              <Clock className="h-6 w-6 text-orange-600" />
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
                  {stats.digitalAdoption}%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Digital adoption rate
              </p>
            </div>
            <div className="rounded-2xl bg-green-100 p-3">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-purple-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Quality Score
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {stats.avgQualityScore}%
                </span>
                <Badge variant="success" className="rounded-full text-xs">
                  Excellent
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Average signature quality
              </p>
            </div>
            <div className="rounded-2xl bg-purple-100 p-3">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignaturesStats;
