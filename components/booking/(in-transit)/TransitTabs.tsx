import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Truck, Warehouse, AlertCircle, Navigation } from "lucide-react";
import { Shipment } from "./types";

interface TransitTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  shipments: Shipment[];
}

export const TransitTabs = ({
  activeTab,
  setActiveTab,
  shipments,
}: TransitTabsProps) => {
  const getStatusCount = (status: string) => {
    return shipments.filter(
      (shipment) => status === "all" || shipment.currentStatus === status
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
                {shipments.length}
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
              value="hub_processing"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <Warehouse className="h-4 w-4" />
              Hub Processing
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {getStatusCount("hub_processing")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="delay"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <AlertCircle className="h-4 w-4" />
              Delayed
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {getStatusCount("delay")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="out_for_delivery"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <Navigation className="h-4 w-4" />
              Out for Delivery
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {getStatusCount("out_for_delivery")}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  );
};
