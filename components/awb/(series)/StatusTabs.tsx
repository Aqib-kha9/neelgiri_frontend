import { CheckCircle2, Ban, AlertCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { awbSeriesData } from "./data/mockData";

interface StatusTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const StatusTabs = ({ activeTab, setActiveTab }: StatusTabsProps) => {
  const getStatusCount = (status: string) => {
    return awbSeriesData.filter(
      (series) => status === "all" || series.status === status
    ).length;
  };

  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 rounded-xl bg-muted/50 p-1">
            <TabsTrigger
              value="all"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              All Series
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {awbSeriesData.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="active"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              Active
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {getStatusCount("active")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="inactive"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <Ban className="h-4 w-4" />
              Inactive
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {getStatusCount("inactive")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="suspended"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <AlertCircle className="h-4 w-4" />
              Suspended
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {getStatusCount("suspended")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="expired"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <Clock className="h-4 w-4" />
              Expired
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {getStatusCount("expired")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="near_exhaustion"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <AlertCircle className="h-4 w-4" />
              Near Exhaustion
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {getStatusCount("near_exhaustion")}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StatusTabs;
