import { FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import ShipmentSummary from "./ShipmentSummary";
import PackageDetails from "./PackageDetails";
import ChargesService from "./ChargesService";
import ProcessingActions from "./ProcessingActions";

interface ShipmentDetailsProps {
  selectedShipment: any;
  processingNotes: string;
  setProcessingNotes: (notes: string) => void;
  setShowProcessingModal: (show: boolean) => void;
}

const ShipmentDetails = ({
  selectedShipment,
  processingNotes,
  setProcessingNotes,
  setShowProcessingModal,
}: ShipmentDetailsProps) => {
  return (
    <div className="xl:col-span-2 space-y-6">
      <ShipmentSummary selectedShipment={selectedShipment} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PackageDetails selectedShipment={selectedShipment} />
        <ChargesService selectedShipment={selectedShipment} />
      </div>

      <ProcessingActions
        selectedShipment={selectedShipment}
        setShowProcessingModal={setShowProcessingModal}
      />

      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-5 w-5 text-primary" />
            Processing Notes
          </CardTitle>
          <CardDescription>
            Add notes and observations for this inward shipment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedShipment.notes ? (
              <div className="bg-muted/30 rounded-xl p-4">
                <p className="text-sm text-foreground">
                  {selectedShipment.notes}
                </p>
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-xl p-8 bg-muted/30 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-sm text-muted-foreground">
                  No processing notes yet
                </p>
              </div>
            )}

            <Textarea
              placeholder="Add processing notes, observations, or special instructions..."
              value={processingNotes}
              onChange={(e) => setProcessingNotes(e.target.value)}
              className="rounded-lg min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShipmentDetails;
