import { Navigation, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { outForDeliveryData } from "./data/mockData";

interface StatusTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const StatusTabs = ({ activeTab, setActiveTab }: StatusTabsProps) => {
  const getStatusCount = (status: string) => {
    return outForDeliveryData.filter(
      (delivery) => status === "all" || delivery.currentStatus === status
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
              All Deliveries
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {outForDeliveryData.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="out_for_delivery"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <Navigation className="h-4 w-4" />
              Active
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {getStatusCount("out_for_delivery")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="delivery_attempted"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <Clock className="h-4 w-4" />
              Attempted
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {getStatusCount("delivery_attempted")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="delivered"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              Delivered
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {getStatusCount("delivered")}
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

export default StatusTabs;
