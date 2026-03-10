import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function IncentiveProgramsPanel({
  data,
}: {
  data: {
    program: string;
    description: string;
    reward: string;
    participants: number;
    status: "active";
    deadline: string;
  }[];
}) {
  return (
    <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold text-foreground">
            Active Incentive Programs
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Performance-based reward programs
          </p>
        </div>
        <Badge className="rounded-full bg-primary/15 px-3 py-1 text-primary">
          3 Active
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((program) => (
          <div
            key={program.program}
            className="rounded-2xl border border-border/60 p-4"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    {program.program}
                  </p>
                  <Badge variant="success" className="rounded-full text-xs">
                    {program.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {program.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Reward: {program.reward}</span>
                  <span>Participants: {program.participants}</span>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>Deadline: {program.deadline}</span>
              <Button size="sm" className="rounded-lg">
                View Details
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
