import { Zap, RefreshCw, Users, Scan, Scale } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProcessingActionsProps {
  selectedShipment: any;
  setShowProcessingModal: (show: boolean) => void;
}

const ProcessingActions = ({
  selectedShipment,
  setShowProcessingModal,
}: ProcessingActionsProps) => {
  const handleStartProcessing = (shipment: any) => {
    console.log("Start processing:", shipment.id);
    setShowProcessingModal(true);
  };

  const handleAssignToMe = (shipment: any) => {
    console.log("Assign to me:", shipment.id);
  };

  const handleQuickScan = (shipment: any) => {
    console.log("Quick scan:", shipment.id);
  };

  const handleWeightUpdate = (shipment: any) => {
    console.log("Update weight:", shipment.id);
  };

  if (
    selectedShipment.status === "completed" ||
    selectedShipment.status === "rejected"
  ) {
    return null;
  }

  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Zap className="h-5 w-5 text-primary" />
          Processing Actions
        </CardTitle>
        <CardDescription>
          Take action to process this inward shipment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <Button
            className="gap-2 rounded-lg bg-blue-600 hover:bg-blue-700"
            onClick={() => handleStartProcessing(selectedShipment)}
          >
            <RefreshCw className="h-4 w-4" />
            Start Processing
          </Button>

          <Button
            variant="outline"
            className="gap-2 rounded-lg border-green-500 text-green-600 hover:bg-green-50"
            onClick={() => handleAssignToMe(selectedShipment)}
          >
            <Users className="h-4 w-4" />
            Assign to Me
          </Button>

          <Button
            variant="outline"
            className="gap-2 rounded-lg border-orange-500 text-orange-600 hover:bg-orange-50"
            onClick={() => handleQuickScan(selectedShipment)}
          >
            <Scan className="h-4 w-4" />
            Quick Scan
          </Button>

          <Button
            variant="outline"
            className="gap-2 rounded-lg border-purple-500 text-purple-600 hover:bg-purple-50"
            onClick={() => handleWeightUpdate(selectedShipment)}
          >
            <Scale className="h-4 w-4" />
            Update Weight
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessingActions;
