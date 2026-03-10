import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, RefreshCw, MessageCircle, Phone, MapPin } from "lucide-react";

interface QuickActionsPanelProps {
  tracking: any;
}

const QuickActionsPanel = ({ tracking }: QuickActionsPanelProps) => {
  const handleUpdateStatus = () => {
    console.log("Update status for:", tracking.id);
  };

  const handleContactCustomer = () => {
    console.log("Contact customer:", tracking.customer.name);
  };

  const handleContactAgent = () => {
    console.log("Contact agent:", tracking.deliveryAgent.name);
  };

  const handleViewRoute = () => {
    console.log("View route for:", tracking.id);
  };

  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Zap className="h-5 w-5 text-primary" />
          Quick Actions
        </CardTitle>
        <CardDescription>
          Manage this customer tracking efficiently
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <Button
            className="gap-2 rounded-lg bg-blue-600 hover:bg-blue-700"
            onClick={handleUpdateStatus}
          >
            <RefreshCw className="h-4 w-4" />
            Update Status
          </Button>

          <Button
            variant="outline"
            className="gap-2 rounded-lg border-green-500 text-green-600 hover:bg-green-50"
            onClick={handleContactCustomer}
          >
            <MessageCircle className="h-4 w-4" />
            Send Update
          </Button>

          <Button
            variant="outline"
            className="gap-2 rounded-lg border-orange-500 text-orange-600 hover:bg-orange-50"
            onClick={handleContactAgent}
          >
            <Phone className="h-4 w-4" />
            Call Agent
          </Button>

          <Button
            variant="outline"
            className="gap-2 rounded-lg border-purple-500 text-purple-600 hover:bg-purple-50"
            onClick={handleViewRoute}
          >
            <MapPin className="h-4 w-4" />
            View Route
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsPanel;
