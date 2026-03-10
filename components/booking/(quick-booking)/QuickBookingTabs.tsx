import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { BulkShipment } from "./types";

interface QuickBookingTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  bulkShipments: BulkShipment[];
}

export const QuickBookingTabs = ({
  activeTab,
  onTabChange,
  bulkShipments,
}: QuickBookingTabsProps) => {
  const getStatusCount = (status: string) => {
    return bulkShipments.filter(
      (shipment) => status === "all" || shipment.status === status
    ).length;
  };

  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-5 rounded-xl bg-muted/50 p-1">
            <TabsTrigger
              value="all"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              All Batches
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {bulkShipments.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="draft"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <FileText className="h-4 w-4" />
              Draft
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {getStatusCount("draft")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="processing"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <Clock className="h-4 w-4" />
              Processing
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-xs rounded-full"
              >
                {getStatusCount("processing")}
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
              value="failed"
              className="rounded-lg data-[state=active]:bg-background flex gap-2"
            >
              <AlertCircle className="h-4 w-4" />
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
