import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { branchesData } from "./data/mockData";

export const AuditsCard = () => {
  return (
    <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">
          Recent Audits
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Branches with recent compliance checks
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {branchesData
          .sort(
            (a, b) =>
              new Date(b.lastAudit).getTime() - new Date(a.lastAudit).getTime()
          )
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
                <p className="text-xs text-muted-foreground">
                  Audit:{" "}
                  {new Date(branch.lastAudit).toLocaleDateString("en-IN")}
                </p>
              </div>
              <Badge variant="success" className="rounded-full">
                Compliant
              </Badge>
            </div>
          ))}
      </CardContent>
    </Card>
  );
};
