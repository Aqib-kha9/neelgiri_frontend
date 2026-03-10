import { Clock, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface StatusTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  data: any[];
}

const StatusTabs = ({ activeTab, setActiveTab, data }: StatusTabsProps) => {
  const getStatusCount = (status: string) => {
    return data.filter((pod) => status === "all" || pod.status === status)
      .length;
  };

  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 rounded-xl bg-muted/50 p-1">
            <TabsTrigger
              value="all"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              All Cases
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {data.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <Clock className="h-4 w-4" />
              Pending
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {getStatusCount("pending")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="in_progress"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              In Progress
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {getStatusCount("in_progress")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="resolved"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              Resolved
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {getStatusCount("resolved")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="escalated"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <AlertCircle className="h-4 w-4" />
              Escalated
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {getStatusCount("escalated")}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StatusTabs;
