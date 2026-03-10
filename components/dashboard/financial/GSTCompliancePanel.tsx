import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export function GSTCompliancePanel({
  data,
}: {
  data: {
    form: string;
    period: string;
    status: string;
    dueDate: string;
    filedOn: string;
  }[];
}) {
  return (
    <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">
          GST Compliance Status
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Filing status and upcoming deadlines
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {data.map((filing) => (
            <div
              key={filing.form}
              className="flex items-center justify-between rounded-2xl border border-border/60 p-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {filing.form}
                  </span>
                  <Badge
                    variant={
                      filing.status === "filed"
                        ? "success"
                        : filing.status === "reconciled"
                        ? "secondary" // "primary" ki jagah "secondary" use karo
                        : "warning"
                    }
                    className="rounded-full text-xs capitalize"
                  >
                    {filing.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{filing.period}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Due: {filing.dueDate}</span>
                  {filing.filedOn !== "-" && (
                    <span>Filed: {filing.filedOn}</span>
                  )}
                </div>
              </div>

              {filing.status === "pending" && (
                <Button size="sm" className="gap-2 rounded-lg">
                  <FileText className="h-4 w-4" />
                  File Now
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
