import { IndianRupee } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface ChargesServiceProps {
  selectedShipment: any;
}

const ChargesService = ({ selectedShipment }: ChargesServiceProps) => {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <IndianRupee className="h-5 w-5 text-primary" />
          Charges & Service
        </CardTitle>
        <CardDescription>
          Service details and calculated charges
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Service Type</p>
              <p className="font-medium">{selectedShipment.service.type}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Payment Type</p>
              <p className="font-medium">{selectedShipment.service.payment}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Freight Charges:</span>
              <span className="font-medium">
                {selectedShipment.charges.freight}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Handling Charges:</span>
              <span className="font-medium">
                {selectedShipment.charges.handling}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">COD Fee:</span>
              <span className="font-medium">
                {selectedShipment.charges.codFee}
              </span>
            </div>
            <div className="flex justify-between text-sm font-semibold border-t pt-2">
              <span>Total Charges:</span>
              <span className="text-green-600">
                {selectedShipment.charges.total}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChargesService;
