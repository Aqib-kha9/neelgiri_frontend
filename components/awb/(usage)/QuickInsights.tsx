import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, TrendingUp, BarChart3, IndianRupee } from "lucide-react";

interface QuickInsightsProps {
  quickInsights: Array<{
    title: string;
    value: string;
    change: string;
    description: string;
    icon: any;
    color: string;
  }>;
}

export const QuickInsights = ({ quickInsights }: QuickInsightsProps) => {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <PieChart className="h-5 w-5 text-primary" />
          Quick Insights
        </CardTitle>
        <CardDescription>
          Key metrics and performance indicators for AWB usage
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickInsights.map((insight, index) => {
            const IconComponent = insight.icon;
            return (
              <Card key={index} className="rounded-xl border-border/60">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">
                        {insight.title}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-foreground">
                          {insight.value}
                        </span>
                        <Badge
                          variant="success"
                          className="rounded-full text-xs"
                        >
                          {insight.change}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {insight.description}
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-2">
                      <IconComponent className={`h-4 w-4 ${insight.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
