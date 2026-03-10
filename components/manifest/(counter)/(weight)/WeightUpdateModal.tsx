import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Scale, CheckCircle2 } from "lucide-react";

interface WeightUpdateModalProps {
  weight: any;
  isOpen: boolean;
  onClose: () => void;
}

const WeightUpdateModal = ({
  weight,
  isOpen,
  onClose,
}: WeightUpdateModalProps) => {
  const [weightInput, setWeightInput] = useState(
    weight.weights.actual?.toString() || ""
  );
  const [notes, setNotes] = useState(weight.notes || "");

  const submitWeightUpdate = () => {
    const actualWeight = parseFloat(weightInput);
    if (!isNaN(actualWeight)) {
      console.log("Update weight for:", weight.id, "to", actualWeight);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border-border/70 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Update Shipment Weight
          </CardTitle>
          <CardDescription>
            Update the actual weight for {weight.awbNumber}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Current Weight Information */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-xl">
              <div>
                <p className="text-sm text-muted-foreground">Declared Weight</p>
                <p className="text-lg font-bold">
                  {weight.weights.declared} kg
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Volumetric Weight
                </p>
                <p className="text-lg font-bold">
                  {weight.weights.volumetric} kg
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Actual Weight (kg)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Enter actual weight"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  className="rounded-lg text-lg font-medium"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter weight in kilograms
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Weight Type
                </label>
                <Select defaultValue="actual">
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select weight type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="actual">Actual Weight</SelectItem>
                    <SelectItem value="volumetric">
                      Volumetric Weight
                    </SelectItem>
                    <SelectItem value="charged">Charged Weight</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Calculated Values */}
            {weightInput && !isNaN(parseFloat(weightInput)) && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-xl">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Weight Difference
                  </p>
                  <p
                    className={`text-lg font-bold ${parseFloat(weightInput) > weight.weights.declared
                      ? "text-red-600"
                      : "text-green-600"
                      }`}
                  >
                    {parseFloat(weightInput) - weight.weights.declared > 0
                      ? "+"
                      : ""}
                    {(
                      parseFloat(weightInput) - weight.weights.declared
                    ).toFixed(1)}{" "}
                    kg
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Variance Percentage
                  </p>
                  <p className="text-lg font-bold text-orange-600">
                    {Math.abs(
                      ((parseFloat(weightInput) - weight.weights.declared) /
                        weight.weights.declared) *
                      100
                    ).toFixed(1)}
                    %
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Weight Verification
              </label>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch id="scale-calibrated" defaultChecked />
                  <label htmlFor="scale-calibrated" className="text-sm">
                    Scale Calibrated
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="package-intact" defaultChecked />
                  <label htmlFor="package-intact" className="text-sm">
                    Package Intact
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="document-verified" />
                  <label htmlFor="document-verified" className="text-sm">
                    Documents Verified
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="photos-taken" />
                  <label htmlFor="photos-taken" className="text-sm">
                    Photos Taken
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Update Notes
              </label>
              <Textarea
                placeholder="Add any observations or reasons for weight update..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="rounded-lg min-h-[100px]"
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-border/70">
              <Button
                variant="outline"
                className="flex-1 rounded-lg"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 gap-2 rounded-lg bg-green-600 hover:bg-green-700"
                onClick={submitWeightUpdate}
                disabled={!weightInput || isNaN(parseFloat(weightInput))}
              >
                <CheckCircle2 className="h-4 w-4" />
                Update Weight
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeightUpdateModal;
