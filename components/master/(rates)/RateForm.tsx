// components/master/rates/RateForm.tsx
"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  X,
  Save,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Calculator,
  Package,
  Map,
  Percent,
  IndianRupee,
  Calendar,
  Shield,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { RateRule, SlabRate, ZoneRate, AdditionalCharge } from "./types";

interface RateFormProps {
  onClose: () => void;
  initialData?: RateRule;
}

const RateForm = ({ onClose, initialData }: RateFormProps) => {
  const [activeTab, setActiveTab] = useState("basic");

  // Default form data
  const [formData, setFormData] = useState<Partial<RateRule>>({
    name: initialData?.name || "",
    customerType: initialData?.customerType || "ALL",
    serviceType: initialData?.serviceType || "SURFACE",
    paymentMode: initialData?.paymentMode || "ALL",
    slabs: initialData?.slabs || [
      {
        id: "1",
        slabName: "0-1 kg",
        minWeight: 0,
        maxWeight: 1,
        rate: 50,
        rateType: "FIXED",
      },
      {
        id: "2",
        slabName: "1-5 kg",
        minWeight: 1,
        maxWeight: 5,
        rate: 80,
        rateType: "PER_KG",
      },
      {
        id: "3",
        slabName: "5-10 kg",
        minWeight: 5,
        maxWeight: 10,
        rate: 150,
        rateType: "PER_KG",
      },
    ],
    zones: initialData?.zones || [
      {
        id: "1",
        fromZone: "DELHI",
        toZone: "MUMBAI",
        rate: 120,
        transitDays: 3,
        isActive: true,
      },
      {
        id: "2",
        fromZone: "DELHI",
        toZone: "BANGALORE",
        rate: 150,
        transitDays: 4,
        isActive: true,
      },
    ],
    fuelSurcharge: initialData?.fuelSurcharge || {
      percentage: 5,
      minAmount: 10,
      maxAmount: 100,
      applicableFrom: 0,
    },
    fovCharge: initialData?.fovCharge || {
      percentage: 2,
      minAmount: 20,
      maxAmount: 500,
    },
    codCharges: initialData?.codCharges || {
      percentage: 10,
      minAmount: 15,
      fixedCharge: 20,
    },
    minCharge: initialData?.minCharge || {
      amount: 30,
      applicableZones: ["ALL"],
    },
    additionalCharges: initialData?.additionalCharges || [
      {
        id: "2",
        name: "Sunday/Holiday",
        type: "PERCENTAGE",
        value: 25,
        description: "Delivery on Sunday/Holiday",
      },
      {
        id: "3",
        name: "Special Handling",
        type: "FIXED",
        value: 100,
        description: "Fragile/Perishable items",
      },
    ],
    vehicleType: initialData?.vehicleType || "",
    volumetricDivisor: initialData?.volumetricDivisor || 5000,
    odaCharge: initialData?.odaCharge || 0,
    validFrom: initialData?.validFrom || new Date().toISOString().split("T")[0],
    validTo:
      initialData?.validTo ||
      new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    isActive: initialData?.isActive || true,
    autoCalculate: initialData?.autoCalculate || {
      enabled: true,
      baseOn: "BOTH",
      rounding: "UP",
      roundingFactor: 0.5,
    },
    restrictions: initialData?.restrictions || {
      maxWeight: 50,
      minWeight: 0.1,
      allowedPackaging: ["BOX", "ENVELOPE", "BAG"],
      prohibitedItems: ["LIQUIDS", "EXPLOSIVES", "WEAPONS"],
      specialInstructions: "Handle with care",
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const isNew = !initialData;

      const payload = {
        name: formData.name,
        customerType: formData.customerType,
        serviceType: formData.serviceType,
        paymentMode: formData.paymentMode,
        slabs: formData.slabs,
        zones: formData.zones,
        fuelSurcharge: formData.fuelSurcharge,
        fovCharge: formData.fovCharge,
        codCharges: formData.codCharges,
        minCharge: formData.minCharge,
        additionalCharges: formData.additionalCharges,
        vehicleType: formData.vehicleType,
        volumetricDivisor: formData.volumetricDivisor,
        odaCharge: formData.odaCharge,
        validFrom: formData.validFrom,
        validTo: formData.validTo,
        isActive: formData.isActive,
        autoCalculate: formData.autoCalculate,
        restrictions: formData.restrictions
      };

      if (isNew) {
        await axios.post("/api/rates", payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Rate card created successfully");
      } else {
        await axios.put(`/api/rates/${initialData.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Rate card updated successfully");
      }

      onClose();
    } catch (error) {
      toast.error("Failed to save rate card");
      console.error(error);
    }
  };

  const addSlab = () => {
    const newSlab: SlabRate = {
      id: `slab-${Date.now()}`,
      slabName: "",
      minWeight: 0,
      maxWeight: 0,
      rate: 0,
      rateType: "PER_KG",
    };
    setFormData({
      ...formData,
      slabs: [...(formData.slabs || []), newSlab],
    });
  };

  const updateSlab = (index: number, field: keyof SlabRate, value: any) => {
    const updatedSlabs = [...(formData.slabs || [])];
    updatedSlabs[index] = { ...updatedSlabs[index], [field]: value };
    setFormData({ ...formData, slabs: updatedSlabs });
  };

  const removeSlab = (index: number) => {
    const updatedSlabs = (formData.slabs || []).filter((_, i) => i !== index);
    setFormData({ ...formData, slabs: updatedSlabs });
  };

  const addZone = () => {
    const newZone: ZoneRate = {
      id: `zone-${Date.now()}`,
      fromZone: "",
      toZone: "",
      rate: 0,
      transitDays: 3,
      isActive: true,
    };
    setFormData({
      ...formData,
      zones: [...(formData.zones || []), newZone],
    });
  };

  const updateZone = (index: number, field: keyof ZoneRate, value: any) => {
    const updatedZones = [...(formData.zones || [])];
    updatedZones[index] = { ...updatedZones[index], [field]: value };
    setFormData({ ...formData, zones: updatedZones });
  };

  const removeZone = (index: number) => {
    const updatedZones = (formData.zones || []).filter((_, i) => i !== index);
    setFormData({ ...formData, zones: updatedZones });
  };

  const addAdditionalCharge = () => {
    const newCharge: AdditionalCharge = {
      id: `charge-${Date.now()}`,
      name: "",
      type: "FIXED",
      value: 0,
      description: "",
    };
    setFormData({
      ...formData,
      additionalCharges: [...(formData.additionalCharges || []), newCharge],
    });
  };

  const updateAdditionalCharge = (
    index: number,
    field: keyof AdditionalCharge,
    value: any
  ) => {
    const updatedCharges = [...(formData.additionalCharges || [])];
    updatedCharges[index] = { ...updatedCharges[index], [field]: value };
    setFormData({ ...formData, additionalCharges: updatedCharges });
  };

  const removeAdditionalCharge = (index: number) => {
    const updatedCharges = (formData.additionalCharges || []).filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, additionalCharges: updatedCharges });
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-6xl my-8 rounded-2xl border-border/70 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div>
            <CardTitle className="flex items-center gap-2">
              {initialData ? "Edit Rate Rule" : "Create New Rate Rule"}
            </CardTitle>
            <CardDescription>
              Define pricing rules for shipments
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 mb-6">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="slabs">Weight Slabs</TabsTrigger>
                <TabsTrigger value="zones">Zone Matrix</TabsTrigger>
                <TabsTrigger value="charges">Charges</TabsTrigger>
                <TabsTrigger value="restrictions">Restrictions</TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Rate Rule Name *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g., Standard Corporate Rates"
                      required
                    />
                  </div>

                  <div>
                    <Label>Applicable For</Label>
                    <Select
                      value={formData.customerType}
                      onValueChange={(v: any) =>
                        setFormData({ ...formData, customerType: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All Customers</SelectItem>
                        <SelectItem value="CUSTOMER">Customer Only</SelectItem>
                        <SelectItem value="AGENT">Agent Only</SelectItem>
                        <SelectItem value="VENDOR">Vendor Only</SelectItem>
                      </SelectContent>
                    </Select>
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
                        <SelectItem value="ALL">All Services</SelectItem>
                        <SelectItem value="SURFACE">Surface</SelectItem>
                        <SelectItem value="AIR">Air</SelectItem>
                        <SelectItem value="EXPRESS">Express</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Vehicle Type (Optional)</Label>
                    <Input
                      value={formData.vehicleType}
                      onChange={(e) =>
                        setFormData({ ...formData, vehicleType: e.target.value })
                      }
                      placeholder="e.g. Tata Ace, 10FT"
                    />
                  </div>
                  <div>
                    <Label>Volumetric Divisor (CFT)</Label>
                    <Input
                      type="number"
                      value={formData.volumetricDivisor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          volumetricDivisor: parseFloat(e.target.value),
                        })
                      }
                      placeholder="e.g. 5000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <SelectItem value="ALL">All Modes</SelectItem>
                        <SelectItem value="PREPAID">Prepaid</SelectItem>
                        <SelectItem value="COD">COD</SelectItem>
                        <SelectItem value="CREDIT">Credit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label>Validity From</Label>
                      <Input
                        type="date"
                        value={formData.validFrom}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            validFrom: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <Label>Validity To</Label>
                      <Input
                        type="date"
                        value={formData.validTo}
                        onChange={(e) =>
                          setFormData({ ...formData, validTo: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.isActive}
                        onCheckedChange={(v) =>
                          setFormData({ ...formData, isActive: v })
                        }
                      />
                      <Label>Active</Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.autoCalculate?.enabled}
                        onCheckedChange={(v) =>
                          setFormData({
                            ...formData,
                            autoCalculate: {
                              ...formData.autoCalculate!,
                              enabled: v,
                            },
                          })
                        }
                      />
                      <Label>Auto Calculate</Label>
                    </div>
                  </div>

                  <Badge variant={formData.isActive ? "success" : "secondary"}>
                    {formData.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </TabsContent>

              {/* Weight Slabs Tab */}
              <TabsContent value="slabs" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Weight Slab Pricing</h3>
                  <Button
                    type="button"
                    onClick={addSlab}
                    size="sm"
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Slab
                  </Button>
                </div>

                <div className="space-y-4">
                  {formData.slabs?.map((slab, index) => (
                    <Card key={slab.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <Package className="h-5 w-5 text-blue-500" />
                            <h4 className="font-medium">Slab {index + 1}</h4>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSlab(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <Label>Slab Name</Label>
                            <Input
                              value={slab.slabName}
                              onChange={(e) =>
                                updateSlab(index, "slabName", e.target.value)
                              }
                              placeholder="e.g., 0-1 kg"
                            />
                          </div>
                          <div>
                            <Label>Min Weight (kg)</Label>
                            <Input
                              type="number"
                              step="0.1"
                              value={slab.minWeight}
                              onChange={(e) =>
                                updateSlab(
                                  index,
                                  "minWeight",
                                  parseFloat(e.target.value)
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label>Max Weight (kg)</Label>
                            <Input
                              type="number"
                              step="0.1"
                              value={slab.maxWeight}
                              onChange={(e) =>
                                updateSlab(
                                  index,
                                  "maxWeight",
                                  parseFloat(e.target.value)
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label>Rate</Label>
                            <div className="flex gap-2">
                              <Input
                                type="number"
                                value={slab.rate}
                                onChange={(e) =>
                                  updateSlab(
                                    index,
                                    "rate",
                                    parseFloat(e.target.value)
                                  )
                                }
                              />
                              <Select
                                value={slab.rateType}
                                onValueChange={(v: any) =>
                                  updateSlab(index, "rateType", v)
                                }
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="FIXED">Fixed</SelectItem>
                                  <SelectItem value="PER_KG">Per KG</SelectItem>
                                  <SelectItem value="SLAB">Slab</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Zone Matrix Tab */}
              <TabsContent value="zones" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Zone-wise Rates</h3>
                  <Button
                    type="button"
                    onClick={addZone}
                    size="sm"
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Zone
                  </Button>
                </div>

                <div className="space-y-4">
                  {formData.zones?.map((zone, index) => (
                    <Card key={zone.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <Map className="h-5 w-5 text-green-500" />
                            <h4 className="font-medium">
                              Zone Pair {index + 1}
                            </h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={zone.isActive}
                              onCheckedChange={(v) =>
                                updateZone(index, "isActive", v)
                              }
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeZone(index)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <Label>From Zone</Label>
                            <Input
                              value={zone.fromZone}
                              onChange={(e) =>
                                updateZone(index, "fromZone", e.target.value)
                              }
                              placeholder="e.g., DELHI"
                            />
                          </div>
                          <div>
                            <Label>To Zone</Label>
                            <Input
                              value={zone.toZone}
                              onChange={(e) =>
                                updateZone(index, "toZone", e.target.value)
                              }
                              placeholder="e.g., MUMBAI"
                            />
                          </div>
                          <div>
                            <Label>Rate (₹)</Label>
                            <Input
                              type="number"
                              value={zone.rate}
                              onChange={(e) =>
                                updateZone(
                                  index,
                                  "rate",
                                  parseFloat(e.target.value)
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label>Transit Days</Label>
                            <Input
                              type="number"
                              value={zone.transitDays}
                              onChange={(e) =>
                                updateZone(
                                  index,
                                  "transitDays",
                                  parseInt(e.target.value)
                                )
                              }
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Charges Tab */}
              <TabsContent value="charges" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Fuel Surcharge */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Percent className="h-4 w-4" />
                        Fuel Surcharge
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label>Percentage (%)</Label>
                        <Input
                          type="number"
                          value={formData.fuelSurcharge?.percentage}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fuelSurcharge: {
                                ...formData.fuelSurcharge!,
                                percentage: parseFloat(e.target.value),
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Minimum Amount (₹)</Label>
                        <Input
                          type="number"
                          value={formData.fuelSurcharge?.minAmount}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fuelSurcharge: {
                                ...formData.fuelSurcharge!,
                                minAmount: parseFloat(e.target.value),
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Applicable From Weight (kg)</Label>
                        <Input
                          type="number"
                          value={formData.fuelSurcharge?.applicableFrom}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fuelSurcharge: {
                                ...formData.fuelSurcharge!,
                                applicableFrom: parseFloat(e.target.value),
                              },
                            })
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* FOV Charge */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        FOV Charge
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label>Percentage (%)</Label>
                        <Input
                          type="number"
                          value={formData.fovCharge?.percentage}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fovCharge: {
                                ...formData.fovCharge!,
                                percentage: parseFloat(e.target.value),
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Minimum Amount (₹)</Label>
                        <Input
                          type="number"
                          value={formData.fovCharge?.minAmount}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fovCharge: {
                                ...formData.fovCharge!,
                                minAmount: parseFloat(e.target.value),
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Maximum Amount (₹)</Label>
                        <Input
                          type="number"
                          value={formData.fovCharge?.maxAmount}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fovCharge: {
                                ...formData.fovCharge!,
                                maxAmount: parseFloat(e.target.value),
                              },
                            })
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* COD Charges */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <IndianRupee className="h-4 w-4" />
                        COD Charges
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label>Percentage (%)</Label>
                        <Input
                          type="number"
                          value={formData.codCharges?.percentage}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              codCharges: {
                                ...formData.codCharges!,
                                percentage: parseFloat(e.target.value),
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Minimum Amount (₹)</Label>
                        <Input
                          type="number"
                          value={formData.codCharges?.minAmount}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              codCharges: {
                                ...formData.codCharges!,
                                minAmount: parseFloat(e.target.value),
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Fixed Charge (₹)</Label>
                        <Input
                          type="number"
                          value={formData.codCharges?.fixedCharge}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              codCharges: {
                                ...formData.codCharges!,
                                fixedCharge: parseFloat(e.target.value),
                              },
                            })
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Minimum Charge */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Minimum Charge
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Minimum Amount (₹)</Label>
                        <Input
                          type="number"
                          value={formData.minCharge?.amount}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              minCharge: {
                                ...formData.minCharge!,
                                amount: parseFloat(e.target.value),
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>ODA Surcharge (₹)</Label>
                        <Input
                          type="number"
                          value={formData.odaCharge}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              odaCharge: parseFloat(e.target.value),
                            })
                          }
                          placeholder="e.g., 50"
                        />
                      </div>
                      <div>
                        <Label>Applicable Zones</Label>
                        <Input
                          value={formData.minCharge?.applicableZones?.join(
                            ", "
                          )}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              minCharge: {
                                ...formData.minCharge!,
                                applicableZones: e.target.value
                                  .split(",")
                                  .map((z) => z.trim()),
                              },
                            })
                          }
                          placeholder="e.g., DELHI, MUMBAI or ALL"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Charges */}
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Additional Charges</h3>
                  <Button
                    type="button"
                    onClick={addAdditionalCharge}
                    size="sm"
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Charge
                  </Button>
                </div>

                <div className="space-y-4">
                  {formData.additionalCharges?.map((charge, index) => (
                    <Card key={charge.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <Calculator className="h-5 w-5 text-purple-500" />
                            <h4 className="font-medium">
                              {charge.name || `Charge ${index + 1}`}
                            </h4>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAdditionalCharge(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label>Charge Name</Label>
                            <Input
                              value={charge.name}
                              onChange={(e) =>
                                updateAdditionalCharge(
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., ODA Charge"
                            />
                          </div>
                          <div>
                            <Label>Type</Label>
                            <Select
                              value={charge.type}
                              onValueChange={(v: any) =>
                                updateAdditionalCharge(index, "type", v)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="FIXED">Fixed (₹)</SelectItem>
                                <SelectItem value="PERCENTAGE">
                                  Percentage (%)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Amount</Label>
                            <Input
                              type="number"
                              value={charge.value}
                              onChange={(e) =>
                                updateAdditionalCharge(
                                  index,
                                  "value",
                                  parseFloat(e.target.value)
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className="mt-3">
                          <Label>Description</Label>
                          <Input
                            value={charge.description}
                            onChange={(e) =>
                              updateAdditionalCharge(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            placeholder="Describe when this charge applies"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Restrictions Tab */}
              <TabsContent value="restrictions" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      Weight Restrictions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Minimum Weight (kg)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.restrictions?.minWeight}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              restrictions: {
                                ...formData.restrictions!,
                                minWeight: parseFloat(e.target.value),
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Maximum Weight (kg)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.restrictions?.maxWeight}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              restrictions: {
                                ...formData.restrictions!,
                                maxWeight: parseFloat(e.target.value),
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      Allowed Packaging
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      value={formData.restrictions?.allowedPackaging?.join(
                        ", "
                      )}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          restrictions: {
                            ...formData.restrictions!,
                            allowedPackaging: e.target.value
                              .split(",")
                              .map((p) => p.trim()),
                          },
                        })
                      }
                      placeholder="e.g., BOX, ENVELOPE, BAG"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      Prohibited Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={formData.restrictions?.prohibitedItems?.join(", ")}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          restrictions: {
                            ...formData.restrictions!,
                            prohibitedItems: e.target.value
                              .split(",")
                              .map((p) => p.trim()),
                          },
                        })
                      }
                      placeholder="List prohibited items, separated by commas"
                      rows={3}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      Special Instructions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={formData.restrictions?.specialInstructions}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          restrictions: {
                            ...formData.restrictions!,
                            specialInstructions: e.target.value,
                          },
                        })
                      }
                      placeholder="Any special handling instructions"
                      rows={3}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 gap-2">
                <Save className="h-4 w-4" />
                {initialData ? "Update Rate Rule" : "Create Rate Rule"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RateForm;
