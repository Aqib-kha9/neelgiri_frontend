import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Download,
  MessageCircle,
  RefreshCw,
  QrCode,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import CustomerInfo from "./CustomerInfo";
import PackageInfo from "./PackageInfo";
import TrackingStatus from "./TrackingStatus";
import DeliveryAgent from "./DeliveryAgent";
import CommunicationHistory from "./CommunicationHistory";

interface TrackingSummaryProps {
  tracking: any;
}

const TrackingSummary = ({ tracking }: TrackingSummaryProps) => {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-0">
        <div className="p-6 border-b border-border/70">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-green-100 p-2">
                  <Eye className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-mono font-bold text-lg text-foreground">
                      {tracking.awbNumber}
                    </p>
                    <QrCode className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Customer Tracking • {tracking.customer.name}
                  </p>
                </div>
              </div>
              <StatusBadge status={tracking.status} />
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  Last Scan: {tracking.location.lastScan}
                </p>
                <p className="text-xs text-muted-foreground">
                  Location Updated
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg border-border/70"
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                    <Eye className="h-4 w-4" />
                    View Full History
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                    <Download className="h-4 w-4" />
                    Export Tracking
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                    <MessageCircle className="h-4 w-4" />
                    Send Update
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                    <RefreshCw className="h-4 w-4" />
                    Refresh Status
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <CustomerInfo customer={tracking.customer} />
              <PackageInfo packageInfo={tracking.package} />
            </div>

            <div className="space-y-4">
              <TrackingStatus tracking={tracking} />
              <DeliveryAgent
                agent={tracking.deliveryAgent}
                tracking={tracking}
              />
              <CommunicationHistory communication={tracking.communication} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackingSummary;
