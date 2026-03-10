import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Truck,
  MapPin,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Order } from "./types";

interface OrderTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  orders: Order[];
}

export const OrderTabs = ({
  activeTab,
  setActiveTab,
  orders,
}: OrderTabsProps) => {
  const getStatusCount = (status: string) => {
    return orders.filter((order) => status === "all" || order.status === status)
      .length;
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
              All Orders
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {orders.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="booked"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <Clock className="h-4 w-4" />
              Booked
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {getStatusCount("booked")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="in-transit"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <Truck className="h-4 w-4" />
              In Transit
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {getStatusCount("in-transit")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="out-for-delivery"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <MapPin className="h-4 w-4" />
              Out for Delivery
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {getStatusCount("out-for-delivery")}
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
              value="exception"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              Exceptions
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {getStatusCount("exception")}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  );
};
