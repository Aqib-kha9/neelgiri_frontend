import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { branchesData } from "./data/mockData";

export const PerformanceCard = () => {
  return (
    <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">
          Branch Performance
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Top performing branches this month
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {branchesData
          .filter((branch) => branch.performance >= 90)
          .slice(0, 3)
          .map((branch) => (
            <div
              key={branch.id}
              className="flex items-center justify-between rounded-2xl border border-border/60 p-4"
            >
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  {branch.name}
                </p>
                <p className="text-xs text-muted-foreground">{branch.city}</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-success">
                  {branch.performance}%
                </div>
                <div className="text-xs text-muted-foreground">Performance</div>
              </div>
            </div>
          ))}
      </CardContent>
    </Card>
  );
};
