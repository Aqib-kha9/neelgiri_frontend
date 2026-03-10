import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import {
  MoreHorizontal,
  Scale,
  QrCode,
  Edit,
  Eye,
  Copy,
  Trash2,
  Weight,
  Package,
  RefreshCw,
  AlertCircle,
  IndianRupee,
  Zap,
  FileText,
  Calculator,
  Ruler,
  CheckCircle2,
} from "lucide-react";
import { StatusBadge, SeverityBadge, DiscrepancyBadge } from "./WeightBadges";

interface WeightDetailsProps {
  weight: any;
  onUpdateWeight: () => void;
}

const WeightDetails = ({ weight, onUpdateWeight }: WeightDetailsProps) => {
  const handleQuickVerify = () => {
    console.log("Quick verify:", weight.id);
  };

  return (
    <div className="xl:col-span-2 space-y-6">
      {/* Weight Summary */}
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardContent className="p-0">
          <div className="p-6 border-b border-border/70">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-orange-100 p-2">
                    <Scale className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-bold text-lg text-foreground">
                        {weight.awbNumber}
                      </p>
                      <QrCode className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Weight Entry • {weight.shipment.description}
                    </p>
                  </div>
                </div>
                <StatusBadge status={weight.status} />
                <SeverityBadge severity={weight.discrepancy.severity} />
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    Variance: {weight.discrepancy.percentage}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Weight discrepancy
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg border-border/70"
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl">
                    <DropdownMenuItem
                      className="flex items-center gap-2 rounded-lg"
                      onClick={onUpdateWeight}
                    >
                      <Edit className="h-4 w-4" />
                      Update Weight
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                      <Eye className="h-4 w-4" />
                      View History
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                      <Copy className="h-4 w-4" />
                      Clone Entry
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-red-600">
                      <Trash2 className="h-4 w-4" />
                      Delete Entry
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weight Measurements */}
              <div className="space-y-4">
                <div className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Weight className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-semibold text-foreground">
                      Weight Measurements
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Declared Weight
                        </p>
                        <p className="text-xl font-bold text-blue-600">
                          {weight.weights.declared} kg
                        </p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Actual Weight
                        </p>
                        <p className="text-xl font-bold text-green-600">
                          {weight.weights.actual
                            ? `${weight.weights.actual} kg`
                            : "Pending"}
                        </p>
                      </div>
                    </div>

                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Volumetric Weight
                      </p>
                      <p className="text-xl font-bold text-orange-600">
                        {weight.weights.volumetric} kg
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Based on dimensions
                      </p>
                    </div>

                    {weight.weights.actual && (
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Weight Discrepancy
                        </p>
                        <p className="text-xl font-bold text-red-600">
                          +{weight.discrepancy.amount} kg
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {weight.discrepancy.percentage}% variance
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Package Information */}
                <div className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-semibold text-foreground">
                      Package Information
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Type</p>
                        <p className="font-medium">{weight.shipment.type}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Description</p>
                        <p className="font-medium">
                          {weight.shipment.description}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Dimensions</p>
                        <p className="font-medium">
                          {weight.shipment.dimensions}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">COD Amount</p>
                        <p className="font-medium text-green-600">
                          {weight.shipment.codAmount}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm">
                      <p className="text-muted-foreground">Declared Value</p>
                      <p className="font-medium">
                        {weight.shipment.declaredValue}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charges & Processing */}
              <div className="space-y-4">
                {/* Financial Impact */}
                <div className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <IndianRupee className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-semibold text-foreground">
                      Financial Impact
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Declared Charges:
                      </span>
                      <span className="font-medium">
                        {weight.charges.declared}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Actual Charges:
                      </span>
                      <span className="font-medium text-green-600">
                        {weight.charges.actual}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Difference:</span>
                      <span className="font-medium text-red-600">
                        {weight.charges.difference}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-semibold border-t pt-2">
                      <span>Extra Charges:</span>
                      <span className="text-red-600">
                        {weight.charges.extraCharges}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Processing Information */}
                <div className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <RefreshCw className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-semibold text-foreground">
                      Processing Information
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Processing Hub:
                      </span>
                      <span className="font-medium">
                        {weight.processing.hub}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Processed By:
                      </span>
                      <span className="font-medium">
                        {weight.processing.processedBy || "Unassigned"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Received:</span>
                      <span className="font-medium">
                        {new Date(weight.timeline.received).toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </div>
                    {weight.timeline.weighed && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Weighed:</span>
                        <span className="font-medium">
                          {new Date(weight.timeline.weighed).toLocaleString(
                            "en-IN"
                          )}
                        </span>
                      </div>
                    )}
                    {weight.processing.processedAt && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Processed:
                        </span>
                        <span className="font-medium">
                          {new Date(
                            weight.processing.processedAt
                          ).toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Discrepancy Analysis */}
                <div className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-semibold text-foreground">
                      Discrepancy Analysis
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Type:</span>
                      <DiscrepancyBadge type={weight.discrepancy.type} />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-medium">
                        +{weight.discrepancy.amount} kg
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Percentage:</span>
                      <span className="font-medium">
                        {weight.discrepancy.percentage}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Severity:</span>
                      <SeverityBadge severity={weight.discrepancy.severity} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weight Actions */}
      {weight.status !== "verified" && weight.status !== "accurate" && (
        <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="h-5 w-5 text-primary" />
              Weight Actions
            </CardTitle>
            <CardDescription>
              Update and verify weight measurements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button
                className="gap-2 rounded-lg bg-blue-600 hover:bg-blue-700"
                onClick={onUpdateWeight}
              >
                <Edit className="h-4 w-4" />
                Update Weight
              </Button>

              <Button
                variant="outline"
                className="gap-2 rounded-lg border-green-500 text-green-600 hover:bg-green-50"
                onClick={handleQuickVerify}
              >
                <CheckCircle2 className="h-4 w-4" />
                Quick Verify
              </Button>

              <Button
                variant="outline"
                className="gap-2 rounded-lg border-orange-500 text-orange-600 hover:bg-orange-50"
              >
                <Calculator className="h-4 w-4" />
                Calculate Charges
              </Button>

              <Button
                variant="outline"
                className="gap-2 rounded-lg border-purple-500 text-purple-600 hover:bg-purple-50"
              >
                <Ruler className="h-4 w-4" />
                Volumetric Calc
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weight Notes */}
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-5 w-5 text-primary" />
            Weight Notes
          </CardTitle>
          <CardDescription>
            Additional information and observations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weight.notes ? (
              <div className="bg-muted/30 rounded-xl p-4">
                <p className="text-sm text-foreground">{weight.notes}</p>
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-xl p-8 bg-muted/30 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-sm text-muted-foreground">
                  No weight notes yet
                </p>
              </div>
            )}

            <Textarea
              placeholder="Add weight observations, measurement notes, or special instructions..."
              className="rounded-lg min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeightDetails;
