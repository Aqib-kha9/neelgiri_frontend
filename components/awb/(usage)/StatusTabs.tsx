import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  BarChart3,
  Building,
  Users,
  CheckCircle2,
  TrendingUp,
  PieChart,
} from "lucide-react";

interface StatusTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  typeCounts: {
    all: number;
    monthly: number;
    quarterly: number;
    branch: number;
    partner: number;
    reconciliation: number;
    weekly: number;
    analytical: number;
  };
}

export const StatusTabs = ({
  activeTab,
  onTabChange,
  typeCounts,
}: StatusTabsProps) => {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-8 rounded-xl bg-muted/50 p-1">
            <TabsTrigger
              value="all"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              All Reports
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {typeCounts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="monthly"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <Calendar className="h-4 w-4" />
              Monthly
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {typeCounts.monthly}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="quarterly"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Quarterly
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {typeCounts.quarterly}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="branch"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <Building className="h-4 w-4" />
              Branch
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {typeCounts.branch}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="partner"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <Users className="h-4 w-4" />
              Partner
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {typeCounts.partner}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="reconciliation"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              Reconciliation
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {typeCounts.reconciliation}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="weekly"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Weekly
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {typeCounts.weekly}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="analytical"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <PieChart className="h-4 w-4" />
              Analytical
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {typeCounts.analytical}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  );
};
