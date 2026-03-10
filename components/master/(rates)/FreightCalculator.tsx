// components/master/rates/FreightCalculator.tsx
"use client";

import { useState, useEffect } from "react";
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
  FreightCalculationResult,
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

  const [result, setResult] = useState<FreightCalculationResult | null>(null);
  const [matchedRules, setMatchedRules] = useState<RateRule[]>([]);

  // Available zones from rates
  const availableZones = zonesList;

  // Find matching rate rules
  useEffect(() => {
    const matched = rates.filter((rate) => {
      // Check if rate is active and valid
      if (!rate.isActive || new Date(rate.validTo) < new Date()) return false;

      // Check service type
      if (
        rate.serviceType !== "ALL" &&
        rate.serviceType !== formData.serviceType
      )
        return false;

      // Check customer type (for calculation we use first matching rule)
      // In real app, you would filter by actual customer type

      // Check if there's a zone match
      const hasZoneMatch = rate.zones.some(
        (zone) =>
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
      calculateFreight(matched[0]); // Use first matching rule
    } else {
      setResult(null);
    }
  }, [formData, rates]);

  const calculateFreight = (rule?: RateRule) => {
    const rateRule = rule || matchedRules[0];
    if (!rateRule) return;

    const weight = formData.weight;
    const declaredValue = formData.declaredValue || 0;

    // Find matching slab
    const slab = rateRule.slabs.find(
      (s) => weight >= s.minWeight && weight <= s.maxWeight
    );
    if (!slab) return;

    // Find zone rate
    const zone = rateRule.zones.find(
      (z) =>
        z.fromZone === formData.originZone &&
        z.toZone === formData.destinationZone
    );
    if (!zone) return;

    // Calculate base freight
    let baseFreight = 0;
    if (slab.rateType === "FIXED") {
      baseFreight = slab.rate;
    } else if (slab.rateType === "PER_KG") {
      baseFreight = slab.rate * weight;
    }

    // Add zone rate
    baseFreight += zone.rate;

    // Calculate fuel surcharge
    let fuelSurcharge = baseFreight * (rateRule.fuelSurcharge.percentage / 100);
    fuelSurcharge = Math.max(fuelSurcharge, rateRule.fuelSurcharge.minAmount);
    if (rateRule.fuelSurcharge.maxAmount) {
      fuelSurcharge = Math.min(fuelSurcharge, rateRule.fuelSurcharge.maxAmount);
    }

    // Calculate FOV charge
    let fovCharge = declaredValue * (rateRule.fovCharge.percentage / 100);
    fovCharge = Math.max(fovCharge, rateRule.fovCharge.minAmount);
    if (rateRule.fovCharge.maxAmount) {
      fovCharge = Math.min(fovCharge, rateRule.fovCharge.maxAmount);
    }

    // Calculate COD charges
    let codCharges = 0;
    if (formData.paymentMode === "COD") {
      codCharges = declaredValue * (rateRule.codCharges.percentage / 100);
      codCharges = Math.max(codCharges, rateRule.codCharges.minAmount);
      if (rateRule.codCharges.fixedCharge) {
        codCharges = Math.max(codCharges, rateRule.codCharges.fixedCharge);
      }
    }

    // Calculate additional charges
    let additionalCharges = 0;
    const additionalBreakdown: {
      item: string;
      amount: number;
      description: string;
    }[] = [];

    // ODA charge
    if (formData.isODA) {
      const odaCharge = rateRule.additionalCharges.find(
        (c) => c.name === "ODA Charge"
      );
      if (odaCharge) {
        const amount =
          odaCharge.type === "FIXED"
            ? odaCharge.value
            : baseFreight * (odaCharge.value / 100);
        additionalCharges += amount;
        additionalBreakdown.push({
          item: odaCharge.name,
          amount,
          description: odaCharge.description,
        });
      }
    }

    // Sunday/Holiday charge
    if (formData.isSundayHoliday) {
      const holidayCharge = rateRule.additionalCharges.find(
        (c) => c.name.includes("Sunday") || c.name.includes("Holiday")
      );
      if (holidayCharge) {
        const amount =
          holidayCharge.type === "FIXED"
            ? holidayCharge.value
            : baseFreight * (holidayCharge.value / 100);
        additionalCharges += amount;
        additionalBreakdown.push({
          item: holidayCharge.name,
          amount,
          description: holidayCharge.description,
        });
      }
    }

    // Special handling charge
    if (formData.isSpecialHandling) {
      const specialCharge = rateRule.additionalCharges.find((c) =>
        c.name.includes("Special")
      );
      if (specialCharge) {
        const amount =
          specialCharge.type === "FIXED"
            ? specialCharge.value
            : baseFreight * (specialCharge.value / 100);
        additionalCharges += amount;
        additionalBreakdown.push({
          item: specialCharge.name,
          amount,
          description: specialCharge.description,
        });
      }
    }

    // Calculate total
    let totalFreight =
      baseFreight + fuelSurcharge + fovCharge + codCharges + additionalCharges;

    // Apply minimum charge
    if (
      totalFreight < rateRule.minCharge.amount &&
      (rateRule.minCharge.applicableZones.includes("ALL") ||
        rateRule.minCharge.applicableZones.includes(formData.destinationZone))
    ) {
      totalFreight = rateRule.minCharge.amount;
    }

    // Apply rounding
    if (rateRule.autoCalculate.enabled) {
      if (rateRule.autoCalculate.rounding === "UP") {
        totalFreight =
          Math.ceil(totalFreight / rateRule.autoCalculate.roundingFactor) *
          rateRule.autoCalculate.roundingFactor;
      } else if (rateRule.autoCalculate.rounding === "DOWN") {
        totalFreight =
          Math.floor(totalFreight / rateRule.autoCalculate.roundingFactor) *
          rateRule.autoCalculate.roundingFactor;
      } else if (rateRule.autoCalculate.rounding === "NEAREST") {
        totalFreight =
          Math.round(totalFreight / rateRule.autoCalculate.roundingFactor) *
          rateRule.autoCalculate.roundingFactor;
      }
    }

    const breakdown = [
      {
        item: "Base Freight",
        amount: baseFreight,
        description: `Weight: ${weight}kg, Zone: ${formData.originZone} → ${formData.destinationZone}`,
      },
      {
        item: "Fuel Surcharge",
        amount: fuelSurcharge,
        description: `${rateRule.fuelSurcharge.percentage}% of base freight`,
      },
      {
        item: "FOV Charge",
        amount: fovCharge,
        description: `${rateRule.fovCharge.percentage}% of declared value (₹${declaredValue})`,
      },
      ...additionalBreakdown,
    ];

    if (codCharges > 0) {
      breakdown.push({
        item: "COD Charges",
        amount: codCharges,
        description: `${rateRule.codCharges.percentage}% of COD amount`,
      });
    }

    setResult({
      baseFreight,
      fuelSurcharge,
      fovCharge,
      codCharges,
      additionalCharges,
      totalFreight,
      breakdown,
      appliedRule: rateRule,
    });
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
                Calculate shipment charges based on rate rules
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
                    Additional charges apply
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  checked={formData.isSundayHoliday}
                  onCheckedChange={(v) =>
                    setFormData({ ...formData, isSundayHoliday: v })
                  }
                />
                <div>
                  <Label>Sunday/Holiday Delivery</Label>
                  <p className="text-xs text-muted-foreground">
                    25% extra charges
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  checked={formData.isSpecialHandling}
                  onCheckedChange={(v) =>
                    setFormData({ ...formData, isSpecialHandling: v })
                  }
                />
                <div>
                  <Label>Special Handling</Label>
                  <p className="text-xs text-muted-foreground">
                    Fragile/Perishable items
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
                      <span>No matching rate rules found</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {matchedRules.map((rule, index) => (
                      <Card
                        key={rule.id}
                        className={`border ${
                          index === 0 ? "border-primary" : ""
                        }`}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                {index === 0 && (
                                  <Badge variant="default" className="gap-1">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Applied
                                  </Badge>
                                )}
                                <span className="font-medium">{rule.name}</span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {rule.customerType} • {rule.serviceType} •{" "}
                                {rule.paymentMode}
                              </div>
                            </div>
                            {index !== 0 && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => calculateFreight(rule)}
                              >
                                Use This Rule
                              </Button>
                            )}
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
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Calculation Results</h3>
                  <div className="text-2xl font-bold text-primary">
                    ₹{result.totalFreight.toFixed(2)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-3">Breakdown</h4>
                      <div className="space-y-3">
                        {result.breakdown.map((item, index) => (
                          <div key={index} className="flex justify-between">
                            <div>
                              <div className="font-medium">{item.item}</div>
                              <div className="text-xs text-muted-foreground">
                                {item.description}
                              </div>
                            </div>
                            <div className="font-medium">
                              ₹{item.amount.toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-3">Applied Rule Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Rule Name:
                          </span>
                          <span className="font-medium">
                            {result.appliedRule.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Customer Type:
                          </span>
                          <Badge variant="outline">
                            {result.appliedRule.customerType}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Service Type:
                          </span>
                          <Badge variant="outline">
                            {result.appliedRule.serviceType}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Fuel Surcharge:
                          </span>
                          <span>
                            {result.appliedRule.fuelSurcharge.percentage}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            FOV Charge:
                          </span>
                          <span>
                            {result.appliedRule.fovCharge.percentage}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Minimum Charge:
                          </span>
                          <span>₹{result.appliedRule.minCharge.amount}</span>
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
                onClick={() => calculateFreight()}
              >
                <Calculator className="h-4 w-4" />
                Recalculate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FreightCalculator;
