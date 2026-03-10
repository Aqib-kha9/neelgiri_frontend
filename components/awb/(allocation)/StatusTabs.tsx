import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Clock, Ban } from "lucide-react";

interface StatusTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  statusCounts: {
    all: number;
    active: number;
    near_exhaustion: number;
    expiring_soon: number;
    expired: number;
    suspended: number;
  };
}

export const StatusTabs = ({
  activeTab,
  onTabChange,
  statusCounts,
}: StatusTabsProps) => {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-6 rounded-xl bg-muted/50 p-1">
            <TabsTrigger
              value="all"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              All Allocations
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {statusCounts.all}
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
                {statusCounts.active}
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
                {statusCounts.near_exhaustion}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="expiring_soon"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <Clock className="h-4 w-4" />
              Expiring Soon
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {statusCounts.expiring_soon}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="expired"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <Ban className="h-4 w-4" />
              Expired
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {statusCounts.expired}
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
                {statusCounts.suspended}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  );
};
