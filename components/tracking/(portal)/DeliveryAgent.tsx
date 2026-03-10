import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Phone, MapPin } from "lucide-react";

interface DeliveryAgentProps {
  agent: any;
  tracking: any;
}

const DeliveryAgent = ({ agent, tracking }: DeliveryAgentProps) => {
  const handleContactAgent = () => {
    console.log("Contact agent:", agent.name);
  };

  const handleViewRoute = () => {
    console.log("View route for:", tracking.id);
  };

  return (
    <div className="rounded-xl border border-border/60 p-4">
      <div className="flex items-center gap-2 mb-3">
        <User className="h-4 w-4 text-green-600" />
        <span className="text-sm font-semibold text-foreground">
          Delivery Agent
        </span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">{agent.name}</p>
            <p className="text-sm text-muted-foreground">{agent.id}</p>
          </div>
          <Badge
            variant={agent.status === "active" ? "success" : "secondary"}
            className="rounded-full"
          >
            {agent.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Phone</p>
            <p className="font-medium">{agent.phone}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Status</p>
            <p className="font-medium capitalize">{agent.status}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 gap-2 rounded-lg border-border/70"
            onClick={handleContactAgent}
          >
            <Phone className="h-3 w-3" />
            Call Agent
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 gap-2 rounded-lg border-border/70"
            onClick={handleViewRoute}
          >
            <MapPin className="h-3 w-3" />
            Track Route
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAgent;
