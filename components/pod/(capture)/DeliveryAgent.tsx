import { User, PhoneCall, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeliveryAgentProps {
  selectedPOD: any;
}

const DeliveryAgent = ({ selectedPOD }: DeliveryAgentProps) => {
  return (
    <div className="rounded-xl border border-border/60 p-4">
      <div className="flex items-center gap-2 mb-3">
        <User className="h-4 w-4 text-purple-600" />
        <span className="text-sm font-semibold text-foreground">
          Delivery Agent
        </span>
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-foreground">
            {selectedPOD.delivery.agent}
          </p>
          <p className="text-xs text-muted-foreground">
            {selectedPOD.delivery.vehicle}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Delivery Time:</span>
            <span className="font-medium">
              {new Date(selectedPOD.delivery.timestamp).toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Payment:</span>
            <span className="font-medium">
              {selectedPOD.capture.codPayment.received ? "Received" : "Pending"}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 gap-2 rounded-lg border-border/70"
          >
            <PhoneCall className="h-3 w-3" />
            Call Agent
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 gap-2 rounded-lg border-border/70"
          >
            <MessageCircle className="h-3 w-3" />
            Message
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAgent;
