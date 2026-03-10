import { Settings, CheckCircle2, AlertCircle, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ConfigStats = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card overflow-hidden">
        <CardContent className="p-5">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">
                Active Settings
              </span>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold tracking-tight text-foreground">
                  42
                </h3>
                <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-xs">
                  Live
                </Badge>
              </div>
            </div>
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Settings className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card overflow-hidden">
        <CardContent className="p-5">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">
                Verified Config
              </span>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold tracking-tight text-green-600">
                  38
                </h3>
                <Badge variant="outline" className="border-green-500/20 bg-green-500/5 text-green-600 text-xs">
                  Valid
                </Badge>
              </div>
            </div>
            <div className="p-3 bg-green-500/10 rounded-2xl">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card overflow-hidden">
        <CardContent className="p-5">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">
                Pending Changes
              </span>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold tracking-tight text-orange-600">
                  4
                </h3>
                <Badge variant="outline" className="border-orange-500/20 bg-orange-500/5 text-orange-600 text-xs">
                  Review
                </Badge>
              </div>
            </div>
            <div className="p-3 bg-orange-500/10 rounded-2xl">
              <AlertCircle className="h-5 w-5 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card overflow-hidden">
        <CardContent className="p-5">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">
                Security Level
              </span>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold tracking-tight text-purple-600">
                  High
                </h3>
                <Badge variant="outline" className="border-purple-500/20 bg-purple-500/5 text-purple-600 text-xs">
                  Protected
                </Badge>
              </div>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-2xl">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfigStats;
