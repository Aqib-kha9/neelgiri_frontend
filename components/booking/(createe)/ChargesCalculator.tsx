import { Calculator, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChargesCalculatorProps {
  charges: {
    baseFreight: number;
    fuelSurcharge: number;
    serviceTax: number;
    totalAmount: number;
  };
  onRecalculate: () => void;
}

export const ChargesCalculator = ({ charges, onRecalculate }: ChargesCalculatorProps) => {
  return (
    <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Calculator className="h-5 w-5 text-primary" />
          Charges Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Base Freight:</span>
            <span className="font-medium">₹{charges.baseFreight.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Fuel Surcharge:</span>
            <span className="font-medium">₹{charges.fuelSurcharge.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">GST (18%):</span>
            <span className="font-medium">₹{charges.serviceTax.toFixed(2)}</span>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between font-semibold text-base">
              <span>Total Amount:</span>
              <span className="text-primary">₹{charges.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <Button onClick={onRecalculate} className="w-full gap-2 rounded-xl" variant="outline">
          <RefreshCw className="h-4 w-4" />
          Recalculate
        </Button>
      </CardContent>
    </Card>
  );
};