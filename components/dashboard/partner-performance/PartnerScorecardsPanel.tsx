import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter, MapPin, Star } from "lucide-react";

export function PartnerScorecardsPanel({
  data,
}: {
  data: {
    name: string;
    location: string;
    performance: number;
    slaCompliance: number;
    revenue: number;
    growth: number;
    status: "excellent" | "good" | "warning";
    joined: string;
  }[];
}) {
  return (
    <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold text-foreground">
            Partner Performance Scorecards
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Ranked by overall performance score
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1 rounded-lg border-border/80"
        >
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((partner, index) => (
          <div
            key={partner.name}
            className="flex items-center justify-between rounded-2xl border border-border/60 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary">
                {index + 1}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    {partner.name}
                  </p>
                  <Badge
                    variant={
                      partner.status === "excellent"
                        ? "success"
                        : partner.status === "good"
                        ? "secondary" // Changed from "primary" to "secondary"
                        : "warning"
                    }
                    className="rounded-full text-xs"
                  >
                    {partner.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {partner.location}
                  </span>
                  <span>Joined: {partner.joined}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-warning fill-current" />
                <span className="text-sm font-semibold text-foreground">
                  {partner.performance}/10
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                SLA: {partner.slaCompliance}% • Growth:{" "}
                {partner.growth > 0 ? "+" : ""}
                {partner.growth}%
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
