// components/master/rates/RateDetailsModal.tsx
"use client";

import {
  X,
  Calendar,
  Clock,
  Users,
  Tag,
  Map,
  Package,
  Percent,
  Shield,
  Zap,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RateRule } from "./types";

interface RateDetailsModalProps {
  rate: RateRule;
  onClose: () => void;
}

const RateDetailsModal = ({ rate, onClose }: RateDetailsModalProps) => {
  const getStatusBadge = () => {
    if (!rate.isActive) {
      return (
        <Badge variant="secondary" className="gap-1">
          <X className="h-3 w-3" /> Inactive
        </Badge>
      );
    }

    const today = new Date();
    const validTo = new Date(rate.validTo);

    if (validTo < today) {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertCircle className="h-3 w-3" /> Expired
        </Badge>
      );
    }

    const daysToExpiry = Math.ceil(
      (validTo.getTime() - today.getTime()) / (1000 * 3600 * 24)
    );

    if (daysToExpiry <= 7) {
      return (
        <Badge variant="warning" className="gap-1">
          <AlertCircle className="h-3 w-3" /> Expiring Soon
        </Badge>
      );
    }

    return (
      <Badge variant="success" className="gap-1">
        <CheckCircle2 className="h-3 w-3" /> Active
      </Badge>
    );
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-4xl my-8 rounded-2xl border-border/70 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Tag className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>{rate.name}</CardTitle>
              <CardDescription>Rate Rule ID: {rate.id}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="h-4 w-4 text-blue-500" />
                    <h4 className="font-medium">Customer Type</h4>
                  </div>
                  <Badge variant="outline" className="text-lg">
                    {rate.customerType}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="h-4 w-4 text-green-500" />
                    <h4 className="font-medium">Service Type</h4>
                  </div>
                  <Badge variant="outline" className="text-lg">
                    {rate.serviceType}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <IndianRupee className="h-4 w-4 text-purple-500" />
                    <h4 className="font-medium">Payment Mode</h4>
                  </div>
                  <Badge variant="outline" className="text-lg">
                    {rate.paymentMode === "ALL"
                      ? "All Modes"
                      : rate.paymentMode}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Validity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Validity Period
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Valid From</p>
                    <p className="font-medium">
                      {new Date(rate.validFrom).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valid To</p>
                    <p className="font-medium">
                      {new Date(rate.validTo).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weight Slabs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Weight Slabs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {rate.slabs.map((slab, index) => (
                    <div
                      key={slab.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{slab.slabName}</p>
                        <p className="text-sm text-muted-foreground">
                          {slab.minWeight} - {slab.maxWeight} kg
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">
                          ₹{slab.rate}
                        </p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {slab.rateType.replace("_", " ").toLowerCase()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Zone Rates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Map className="h-4 w-4" />
                  Zone Rates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rate.zones.map((zone) => (
                    <div key={zone.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">
                          {zone.fromZone} → {zone.toZone}
                        </div>
                        <Badge
                          variant={zone.isActive ? "success" : "secondary"}
                        >
                          {zone.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Rate</p>
                          <p className="font-medium">₹{zone.rate}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Transit Days</p>
                          <p className="font-medium">{zone.transitDays} days</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Charges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Percent className="h-4 w-4 text-orange-500" />
                    <h4 className="font-medium">Fuel Surcharge</h4>
                  </div>
                  <p className="text-2xl font-bold">
                    {rate.fuelSurcharge.percentage}%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Min: ₹{rate.fuelSurcharge.minAmount}, Max: ₹
                    {rate.fuelSurcharge.maxAmount || "No limit"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <h4 className="font-medium">FOV Charge</h4>
                  </div>
                  <p className="text-2xl font-bold">
                    {rate.fovCharge.percentage}%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Min: ₹{rate.fovCharge.minAmount}, Max: ₹
                    {rate.fovCharge.maxAmount || "No limit"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <IndianRupee className="h-4 w-4 text-green-500" />
                    <h4 className="font-medium">Minimum Charge</h4>
                  </div>
                  <p className="text-2xl font-bold">₹{rate.minCharge.amount}</p>
                  <p className="text-sm text-muted-foreground">
                    Zones: {rate.minCharge.applicableZones.join(", ")}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Additional Charges */}
            {rate.additionalCharges.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Additional Charges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {rate.additionalCharges.map((charge) => (
                      <div key={charge.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium">{charge.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {charge.type === "FIXED" ? "₹" : ""}
                            {charge.value}
                            {charge.type === "PERCENTAGE" ? "%" : ""}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {charge.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Restrictions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Restrictions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Weight Range
                    </p>
                    <p className="font-medium">
                      {rate.restrictions.minWeight} -{" "}
                      {rate.restrictions.maxWeight} kg
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Allowed Packaging
                    </p>
                    <p className="font-medium">
                      {rate.restrictions.allowedPackaging.join(", ")}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">
                      Prohibited Items
                    </p>
                    <p className="font-medium">
                      {rate.restrictions.prohibitedItems.join(", ") || "None"}
                    </p>
                  </div>
                  {rate.restrictions.specialInstructions && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">
                        Special Instructions
                      </p>
                      <p className="font-medium">
                        {rate.restrictions.specialInstructions}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Auto Calculation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Auto Calculation Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Enabled</p>
                    <p className="font-medium">
                      {rate.autoCalculate.enabled ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Base On</p>
                    <p className="font-medium">{rate.autoCalculate.baseOn}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rounding</p>
                    <p className="font-medium">
                      {rate.autoCalculate.rounding} (Factor:{" "}
                      {rate.autoCalculate.roundingFactor})
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Meta Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Meta Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Created At</p>
                    <p className="font-medium">
                      {new Date(rate.createdAt).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Updated At</p>
                    <p className="font-medium">
                      {new Date(rate.updatedAt).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Created By</p>
                    <p className="font-medium">{rate.createdBy}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Close Button */}
            <div className="pt-4 border-t">
              <Button onClick={onClose} className="w-full">
                Close
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RateDetailsModal;
