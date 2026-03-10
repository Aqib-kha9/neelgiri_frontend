import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface DRSData {
  id: string;
  status: string;
}

interface StatusTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  drsHistoryData: DRSData[];
}

const StatusTabs = ({
  activeTab,
  setActiveTab,
  drsHistoryData,
}: StatusTabsProps) => {
  const getStatusCount = (status: string) => {
    return drsHistoryData.filter(
      (drs) => status === "all" || drs.status === status
    ).length;
  };

  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 rounded-xl bg-muted/50 p-1">
            <TabsTrigger
              value="all"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              All DRS
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {drsHistoryData.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              Completed
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {getStatusCount("completed")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="cancelled"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <XCircle className="h-4 w-4" />
              Cancelled
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {getStatusCount("cancelled")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="partial"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <AlertCircle className="h-4 w-4" />
              Partial
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {getStatusCount("partial")}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StatusTabs;
