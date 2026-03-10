// app/dashboard/manifest/forwarding/create/components/StatusTabs.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Clock, Truck, CheckCircle2, Package } from "lucide-react";

interface StatusTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  data: any[];
}

const StatusTabs = ({ activeTab, setActiveTab, data }: StatusTabsProps) => {
  const getStatusCount = (status: string) => {
    return data.filter(
      (shipment) => status === "all" || shipment.status === status
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
              All Shipments
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
              value="ready"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <Package className="h-4 w-4" />
              Ready
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {getStatusCount("ready")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="in_transit"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <Truck className="h-4 w-4" />
              In Transit
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {getStatusCount("in_transit")}
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
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StatusTabs;
