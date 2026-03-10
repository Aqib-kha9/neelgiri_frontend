import { Calendar, Verified, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { deliveredData } from "./data/mockData";

interface StatusTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const StatusTabs = ({ activeTab, setActiveTab }: StatusTabsProps) => {
  const getVerificationCount = (status: string) => {
    return deliveredData.filter(
      (delivery) =>
        status === "all" || delivery.podVerification.status === status
    ).length;
  };

  const getTodayDeliveries = () => {
    return deliveredData.filter(
      (delivery) =>
        new Date(delivery.deliveryInfo.deliveredAt).toDateString() ===
        new Date().toDateString()
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
              All Deliveries
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {deliveredData.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="today"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <Calendar className="h-4 w-4" />
              Today
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {getTodayDeliveries()}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="verified"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <Verified className="h-4 w-4" />
              Verified
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {getVerificationCount("verified")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <Clock className="h-4 w-4" />
              Pending Review
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {getVerificationCount("pending")}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StatusTabs;
