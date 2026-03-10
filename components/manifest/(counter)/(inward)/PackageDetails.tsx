import { Package } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface PackageDetailsProps {
  selectedShipment: any;
}

const PackageDetails = ({ selectedShipment }: PackageDetailsProps) => {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Package className="h-5 w-5 text-primary" />
          Package Details
        </CardTitle>
        <CardDescription>
          Package information and specifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Package Type</p>
              <p className="font-medium">{selectedShipment.package.type}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Description</p>
              <p className="font-medium">
                {selectedShipment.package.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Declared Weight</p>
              <p className="font-medium">
                {selectedShipment.package.declaredWeight}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Actual Weight</p>
              <p className="font-medium">
                {selectedShipment.package.actualWeight || "Not weighed"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Dimensions</p>
              <p className="font-medium">
                {selectedShipment.package.dimensions}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Declared Value</p>
              <p className="font-medium">
                {selectedShipment.package.declaredValue}
              </p>
            </div>
          </div>

          <div className="text-sm">
            <p className="text-muted-foreground">COD Amount</p>
            <p className="font-medium text-green-600">
              {selectedShipment.package.codAmount}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PackageDetails;
