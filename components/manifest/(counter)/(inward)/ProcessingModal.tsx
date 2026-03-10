import { RefreshCw, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface ProcessingModalProps {
  selectedShipment: any;
  showProcessingModal: boolean;
  setShowProcessingModal: (show: boolean) => void;
}

const ProcessingModal = ({
  selectedShipment,
  showProcessingModal,
  setShowProcessingModal,
}: ProcessingModalProps) => {
  const submitProcessing = () => {
    // In real app, this would submit processing
    console.log("Submit processing for:", selectedShipment.id);
    setShowProcessingModal(false);
  };

  if (!showProcessingModal) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl rounded-2xl border-border/70 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Process Inward Shipment
          </CardTitle>
          <CardDescription>
            Complete the processing steps for {selectedShipment.awbNumber}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Actual Weight
                </label>
                <Input
                  placeholder="Enter actual weight"
                  className="rounded-lg"
                  defaultValue={
                    selectedShipment.package.actualWeight ||
                    selectedShipment.package.declaredWeight
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Processing Status
                </label>
                <Select defaultValue={selectedShipment.status}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Verification Checks
              </label>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch id="weight-check" />
                  <label htmlFor="weight-check" className="text-sm">
                    Weight Check Passed
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="document-check" />
                  <label htmlFor="document-check" className="text-sm">
                    Document Check Passed
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="value-check" />
                  <label htmlFor="value-check" className="text-sm">
                    Value Check Passed
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="security-check" />
                  <label htmlFor="security-check" className="text-sm">
                    Security Check Passed
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Processing Notes
              </label>
              <Textarea
                placeholder="Add any observations or special notes..."
                className="rounded-lg min-h-[120px]"
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-border/70">
              <Button
                variant="outline"
                className="flex-1 rounded-lg"
                onClick={() => setShowProcessingModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 gap-2 rounded-lg bg-green-600 hover:bg-green-700"
                onClick={submitProcessing}
              >
                <CheckCircle2 className="h-4 w-4" />
                Complete Processing
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessingModal;
