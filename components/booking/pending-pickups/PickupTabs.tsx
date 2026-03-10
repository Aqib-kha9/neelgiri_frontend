import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Clock, UserPlus, Calendar, XCircle } from "lucide-react";
import { Pickup } from "./types";

interface PickupTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  pickups: Pickup[];
}

export const PickupTabs = ({
  activeTab,
  setActiveTab,
  pickups,
}: PickupTabsProps) => {
  const getStatusCount = (status: string) => {
    return pickups.filter(
      (pickup) => status === "all" || pickup.status === status
    ).length;
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
              All Pickups
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {pickups.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <Clock className="h-4 w-4" />
              Unassigned
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {getStatusCount("pending")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="assigned"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Assigned
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {getStatusCount("assigned")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="scheduled"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <Calendar className="h-4 w-4" />
              Scheduled
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {getStatusCount("scheduled")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="failed"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <XCircle className="h-4 w-4" />
              Failed
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {getStatusCount("failed")}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  );
};
