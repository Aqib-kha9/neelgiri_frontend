// components/master/rates/FreightCalculator.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  X,
  Calculator,
  Package,
  Map,
  Percent,
  IndianRupee,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  RateRule,
  FreightCalculationInput,
} from "./types";
import { zonesList } from "./mockData";

interface FreightCalculatorProps {
  onClose: () => void;
  rates: RateRule[];
}

const FreightCalculator = ({ onClose, rates }: FreightCalculatorProps) => {
  const [formData, setFormData] = useState<FreightCalculationInput>({
    originZone: "DELHI",
    destinationZone: "MUMBAI",
    weight: 2.5,
    serviceType: "SURFACE",
    paymentMode: "PREPAID",
    declaredValue: 5000,
    isODA: false,
    isSundayHoliday: false,
    isSpecialHandling: false,
    dimensions: {
      length: 20,
      width: 15,
      height: 10,
    },
  });

  const [result, setResult] = useState<any | null>(null);
  const [matchedRules, setMatchedRules] = useState<RateRule[]>([]);
  const [loading, setLoading] = useState(false);

  // Available zones from rates
  const availableZones = zonesList;

  // Find matching rate rules
  useEffect(() => {
    const matched = rates.filter((rate) => {
      // Check if rate is active and valid
      if (!rate.isActive || (rate.validTo && new Date(rate.validTo) < new Date())) return false;

      // Check service type
      if (
        rate.serviceType !== "ALL" &&
        rate.serviceType !== formData.serviceType
      )
        return false;

      // Check if there's a zone match
      const hasZoneMatch = rate.zones?.some(
        (zone: any) =>
          zone.fromZone === formData.originZone &&
          zone.toZone === formData.destinationZone &&
          zone.isActive
      );

      if (!hasZoneMatch) return false;

      return true;
    });

    setMatchedRules(matched);

    // Auto-calculate if we have matching rules
    if (matched.length > 0) {
      calculateFreight(matched[0]);
    } else {
      setResult(null);
    }
  }, [formData, rates]);

  const calculateFreight = async (rule?: RateRule) => {
    const rateRule = rule || matchedRules[0];
    if (!rateRule) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post("/api/rates/calculate", {
        originZone: formData.originZone,
        destinationZone: formData.destinationZone,
        weight: formData.weight,
        length: formData.dimensions?.length,
        width: formData.dimensions?.width,
        height: formData.dimensions?.height,
        rateCardId: rateRule.id || (rateRule as any)._id,
        declaredValue: formData.declaredValue,
        isODA: formData.isODA
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setResult({
        ...data,
        appliedRule: rateRule
      });
    } catch (error) {
      console.error("Calculation failed:", error);
      toast.error("Failed to calculate freight");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-4xl my-8 rounded-2xl border-border/70 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Calculator className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Freight Calculator</CardTitle>
              <p className="text-sm text-muted-foreground">
                Calculate shipment charges based on real-time rate rules
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Input Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label>Origin Zone</Label>
                <Select
                  value={formData.originZone}
                  onValueChange={(v) =>
                    setFormData({ ...formData, originZone: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableZones.map((zone) => (
                      <SelectItem key={zone} value={zone}>
                        {zone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Destination Zone</Label>
                <Select
                  value={formData.destinationZone}
                  onValueChange={(v) =>
                    setFormData({ ...formData, destinationZone: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableZones.map((zone) => (
                      <SelectItem key={zone} value={zone}>
                        {zone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Weight (kg)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      weight: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div>
                <Label>Service Type</Label>
                <Select
                  value={formData.serviceType}
                  onValueChange={(v: any) =>
                    setFormData({ ...formData, serviceType: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SURFACE">Surface</SelectItem>
                    <SelectItem value="AIR">Air</SelectItem>
                    <SelectItem value="EXPRESS">Express</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Payment Mode</Label>
                <Select
                  value={formData.paymentMode}
                  onValueChange={(v: any) =>
                    setFormData({ ...formData, paymentMode: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PREPAID">Prepaid</SelectItem>
                    <SelectItem value="COD">COD</SelectItem>
                    <SelectItem value="CREDIT">Credit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Declared Value (₹)</Label>
                <Input
                  type="number"
                  value={formData.declaredValue}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      declaredValue: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            {/* Additional Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Switch
                  checked={formData.isODA}
                  onCheckedChange={(v) =>
                    setFormData({ ...formData, isODA: v })
                  }
                />
                <div>
                  <Label>Out of Delivery Area (ODA)</Label>
                  <p className="text-xs text-muted-foreground">
                    Calculates ODA surcharge
                  </p>
                </div>
              </div>
            </div>

            {/* Matched Rules */}
            <div>
              <Label className="mb-2 block">Matching Rate Rules</Label>
              <div className="space-y-2">
                {matchedRules.length === 0 ? (
                  <div className="p-4 border rounded-lg bg-yellow-50 text-yellow-800">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>No matching rate rules found for this route</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {matchedRules.map((rule, index) => (
                      <Card
                        key={rule.id || (rule as any)._id}
                        className={`border ${result?.appliedRule?.id === rule.id ? "border-primary bg-primary/5" : ""}`}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                {result?.appliedRule?.id === rule.id && (
                                  <Badge variant="default" className="gap-1">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Applied
                                  </Badge>
                                )}
                                <span className="font-medium">{rule.name}</span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {rule.serviceType} • {rule.paymentMode}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant={result?.appliedRule?.id === rule.id ? "secondary" : "outline"}
                              disabled={loading}
                              onClick={() => calculateFreight(rule)}
                            >
                              {loading ? "Calculating..." : "Select & Calculate"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Results */}
            {result && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                <div className="flex items-center justify-between border-t pt-4">
                  <h3 className="text-lg font-semibold">Calculation Results</h3>
                  <div className="text-2xl font-bold text-primary">
                    ₹{result.totalAmount.toFixed(2)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <IndianRupee className="h-4 w-4" />
                        Charge Breakdown
                      </h4>
                      <div className="space-y-3">
                        {result.breakdown.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{item.label}</span>
                            <span className="font-medium">₹{item.value.toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="border-t pt-2 flex justify-between font-bold">
                          <span>Total Amount</span>
                          <span>₹{result.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Shipment Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Chargeable Weight:</span>
                          <span className="font-medium">{result.chargeableWeight.toFixed(2)} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Volumetric Weight:</span>
                          <span className="font-medium">{result.volumetricWeight.toFixed(2)} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Applied Rule:</span>
                          <span className="font-medium">{result.appliedRule.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Min Charge Applied:</span>
                          <span className="font-medium">{result.baseFreight === result.appliedRule.minCharge.amount ? "Yes" : "No"}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                type="button"
                className="flex-1 gap-2"
                disabled={loading || matchedRules.length === 0}
                onClick={() => calculateFreight()}
              >
                <Calculator className="h-4 w-4" />
                {loading ? "Processing..." : "Recalculate"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FreightCalculator;
