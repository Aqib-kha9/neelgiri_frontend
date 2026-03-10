// app/dashboard/manifest/history/components/StatusTabs.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
} from "lucide-react";

interface StatusTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  data: any[];
}

const StatusTabs = ({ activeTab, setActiveTab, data }: StatusTabsProps) => {
  const getStatusCount = (status: string) => {
    return data.filter(
      (history) => status === "all" || history.status === status
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
              All History
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {data.length}
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
              value="delayed"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <AlertCircle className="h-4 w-4" />
              Delayed
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {getStatusCount("delayed")}
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
              <Clock className="h-4 w-4" />
              Partial
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {getStatusCount("partial")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="issues"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <AlertCircle className="h-4 w-4" />
              With Issues
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {data.filter((h) => h.issues.length > 0).length}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StatusTabs;
