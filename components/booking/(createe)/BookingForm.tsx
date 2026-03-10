"use client";

import { useState } from "react";
import {
  Package,
  User,
  Users,
  FileText,
  Scan,
  ArrowLeft,
  Plus,
  QrCode,
  Download,
  Calculator,
  Weight,
  Ruler,
  IndianRupee,
  Phone,
  Mail,
  MapPinned,
  MapPin,
  Shield,
  AlertCircle,
  Building,
  Truck,
  Clock,
  Zap,
  Search,
  Wallet,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ShippingLabel } from "./ShippingLabel";
import { ChargesCalculator } from "./ChargesCalculator";
import { AWBGeneration } from "./AWBGeneration";
import { ServiceCoverage } from "./ServiceCoverage";
import { QuickActions } from "./QuickActions";

const serviceTypes = [
  {
    value: "same-day",
    label: "Same Day",
    rate: 120,
    icon: Zap,
    color: "text-red-600",
  },
  {
    value: "next-day",
    label: "Next Day",
    rate: 80,
    icon: Clock,
    color: "text-orange-600",
  },
  {
    value: "express",
    label: "Express",
    rate: 150,
    icon: Truck,
    color: "text-blue-600",
  },
  {
    value: "economy",
    label: "Economy",
    rate: 60,
    icon: Building,
    color: "text-green-600",
  },
  {
    value: "standard",
    label: "Standard",
    rate: 70,
    icon: Package,
    color: "text-purple-600",
  },
];

const paymentModes = [
  { value: "prepaid", label: "Prepaid", icon: Wallet },
  { value: "cod", label: "COD", icon: IndianRupee },
  { value: "credit", label: "Credit", icon: FileText },
  { value: "topay", label: "To Pay", icon: Calculator },
];

const packageTypes = [
  { value: "document", label: "Document", weightLimit: 2 },
  { value: "parcel", label: "Parcel", weightLimit: 30 },
  { value: "electronics", label: "Electronics", weightLimit: 20 },
  { value: "fragile", label: "Fragile", weightLimit: 15 },
  { value: "clothing", label: "Clothing", weightLimit: 25 },
];

const CreateBooking = () => {
  const [activeTab, setActiveTab] = useState("details");
  const [bookingCompleted, setBookingCompleted] = useState(false);
  const [awbNumber, setAwbNumber] = useState("");
  const [formData, setFormData] = useState({
    // Sender Details
    senderName: "Aqib",
    senderPhone: "8601677140",
    senderEmail: "aqib@example.com",
    senderAddress: "Delhi, India",
    senderPincode: "110094",
    senderGSTIN: "07AABCU9603R1ZM",

    // Receiver Details
    receiverName: "Aqib Khan",
    receiverPhone: "8601677140",
    receiverEmail: "aqib.khan@example.com",
    receiverAddress: "Delhi, India",
    receiverPincode: "110094",
    receiverGSTIN: "07AABCU9603R1ZP",

    // Package Details
    packageType: "parcel",
    weight: "5",
    length: "30",
    width: "20",
    height: "15",
    declaredValue: "5000",
    description: "Electronics items - Mobile Phone",

    // Service Details
    serviceType: "standard",
    paymentMode: "cod",
    codAmount: "500",
    specialInstructions: "Handle with care - Fragile items",
  });

  const [calculatedCharges, setCalculatedCharges] = useState({
    baseFreight: 350,
    fuelSurcharge: 42,
    serviceTax: 70.56,
    totalAmount: 462.56,
  });

  const progress = {
    details: 25,
    sender: 50,
    receiver: 75,
    review: 100,
  }[activeTab];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateCharges = () => {
    const selectedService = serviceTypes.find(
      (s) => s.value === formData.serviceType
    );
    const weight = parseFloat(formData.weight) || 0;

    if (selectedService) {
      const baseFreight = selectedService.rate * (weight > 0.5 ? weight : 0.5);
      const fuelSurcharge = baseFreight * 0.12;
      const serviceTax = (baseFreight + fuelSurcharge) * 0.18;
      const totalAmount = baseFreight + fuelSurcharge + serviceTax;

      setCalculatedCharges({
        baseFreight,
        fuelSurcharge,
        serviceTax,
        totalAmount,
      });
    }
  };

  const generateAWB = () => {
    const randomAWB = `HJD${Math.floor(100000 + Math.random() * 900000)}`;
    setAwbNumber(randomAWB);
    return randomAWB;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate AWB Number
    const awb = generateAWB();

    // Calculate final charges
    calculateCharges();

    // Set booking as completed
    setBookingCompleted(true);
  };

  const resetForm = () => {
    setBookingCompleted(false);
    setAwbNumber("");
    setActiveTab("details");
  };

  // If booking is completed, show shipping label
  if (bookingCompleted) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={resetForm}
              className="rounded-xl"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Booking Confirmation
              </h1>
              <p className="text-muted-foreground">
                Your shipment has been booked successfully
              </p>
            </div>
          </div>
          <Button
            onClick={resetForm}
            className="gap-2 rounded-xl bg-primary text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
            Create New Booking
          </Button>
        </div>

        <ShippingLabel
          bookingData={formData}
          charges={calculatedCharges}
          awbNumber={awbNumber}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-2">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Create New Booking
              </h1>
              <p className="text-muted-foreground">
                Book shipments with AWB generation and real-time tracking
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="gap-2 rounded-xl border-border/70"
          >
            <QrCode className="h-4 w-4" />
            Scan AWB
          </Button>
          <Button
            variant="outline"
            className="gap-2 rounded-xl border-border/70"
          >
            <Download className="h-4 w-4" />
            Bulk Upload
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-foreground">
                Booking Progress
              </span>
              <span className="text-muted-foreground">
                {progress}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Package Details</span>
              <span>Sender Info</span>
              <span>Receiver Info</span>
              <span>Review & Book</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 rounded-2xl bg-muted/50 p-1">
                <TabsTrigger
                  value="details"
                  className="rounded-xl data-[state=active]:bg-background flex gap-2"
                >
                  <Package className="h-4 w-4" />
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="sender"
                  className="rounded-xl data-[state=active]:bg-background flex gap-2"
                >
                  <User className="h-4 w-4" />
                  Sender
                </TabsTrigger>
                <TabsTrigger
                  value="receiver"
                  className="rounded-xl data-[state=active]:bg-background flex gap-2"
                >
                  <Users className="h-4 w-4" />
                  Receiver
                </TabsTrigger>
                <TabsTrigger
                  value="review"
                  className="rounded-xl data-[state=active]:bg-background flex gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Review
                </TabsTrigger>
              </TabsList>

              {/* Booking Details Tab */}
              <TabsContent value="details" className="space-y-6">
                <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Package className="h-5 w-5 text-primary" />
                      Package Information
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Enter package details and select service type
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label
                          htmlFor="packageType"
                          className="text-sm font-medium"
                        >
                          Package Type *
                        </Label>
                        <Select
                          value={formData.packageType}
                          onValueChange={(value) =>
                            handleInputChange("packageType", value)
                          }
                        >
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Select package type" />
                          </SelectTrigger>
                          <SelectContent>
                            {packageTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label
                          htmlFor="serviceType"
                          className="text-sm font-medium"
                        >
                          Service Type *
                        </Label>
                        <Select
                          value={formData.serviceType}
                          onValueChange={(value) =>
                            handleInputChange("serviceType", value)
                          }
                        >
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Select service" />
                          </SelectTrigger>
                          <SelectContent>
                            {serviceTypes.map((service) => {
                              const IconComponent = service.icon;
                              return (
                                <SelectItem
                                  key={service.value}
                                  value={service.value}
                                >
                                  <div className="flex items-center gap-2">
                                    <IconComponent
                                      className={`h-4 w-4 ${service.color}`}
                                    />
                                    <span>{service.label}</span>
                                    <span className="text-muted-foreground ml-auto">
                                      ₹{service.rate}/kg
                                    </span>
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-4">
                      <div className="space-y-3">
                        <Label
                          htmlFor="weight"
                          className="text-sm font-medium flex items-center gap-1"
                        >
                          <Weight className="h-3 w-3" />
                          Weight (kg) *
                        </Label>
                        <Input
                          id="weight"
                          type="number"
                          placeholder="0.5"
                          value={formData.weight}
                          onChange={(e) =>
                            handleInputChange("weight", e.target.value)
                          }
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label
                          htmlFor="length"
                          className="text-sm font-medium flex items-center gap-1"
                        >
                          <Ruler className="h-3 w-3" />
                          Length (cm)
                        </Label>
                        <Input
                          id="length"
                          type="number"
                          placeholder="Length"
                          value={formData.length}
                          onChange={(e) =>
                            handleInputChange("length", e.target.value)
                          }
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="width" className="text-sm font-medium">
                          Width (cm)
                        </Label>
                        <Input
                          id="width"
                          type="number"
                          placeholder="Width"
                          value={formData.width}
                          onChange={(e) =>
                            handleInputChange("width", e.target.value)
                          }
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="height" className="text-sm font-medium">
                          Height (cm)
                        </Label>
                        <Input
                          id="height"
                          type="number"
                          placeholder="Height"
                          value={formData.height}
                          onChange={(e) =>
                            handleInputChange("height", e.target.value)
                          }
                          className="rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label
                          htmlFor="declaredValue"
                          className="text-sm font-medium flex items-center gap-1"
                        >
                          <IndianRupee className="h-3 w-3" />
                          Declared Value (₹)
                        </Label>
                        <Input
                          id="declaredValue"
                          type="number"
                          placeholder="0.00"
                          value={formData.declaredValue}
                          onChange={(e) =>
                            handleInputChange("declaredValue", e.target.value)
                          }
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label
                          htmlFor="paymentMode"
                          className="text-sm font-medium"
                        >
                          Payment Mode *
                        </Label>
                        <Select
                          value={formData.paymentMode}
                          onValueChange={(value) =>
                            handleInputChange("paymentMode", value)
                          }
                        >
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Select payment mode" />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentModes.map((mode) => {
                              const IconComponent = mode.icon;
                              return (
                                <SelectItem key={mode.value} value={mode.value}>
                                  <div className="flex items-center gap-2">
                                    <IconComponent className="h-4 w-4" />
                                    {mode.label}
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {formData.paymentMode === "cod" && (
                      <div className="space-y-3">
                        <Label
                          htmlFor="codAmount"
                          className="text-sm font-medium flex items-center gap-1"
                        >
                          <IndianRupee className="h-3 w-3" />
                          COD Amount (₹) *
                        </Label>
                        <Input
                          id="codAmount"
                          type="number"
                          placeholder="0.00"
                          value={formData.codAmount}
                          onChange={(e) =>
                            handleInputChange("codAmount", e.target.value)
                          }
                          className="rounded-xl"
                        />
                      </div>
                    )}

                    <div className="space-y-3">
                      <Label
                        htmlFor="description"
                        className="text-sm font-medium"
                      >
                        Package Description
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Describe the contents of the package..."
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        className="rounded-xl min-h-[100px]"
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <div></div>
                  <div className="flex gap-3">
                    <Button
                      onClick={calculateCharges}
                      variant="outline"
                      className="gap-2 rounded-xl"
                    >
                      <Calculator className="h-4 w-4" />
                      Calculate Charges
                    </Button>
                    <Button
                      onClick={() => setActiveTab("sender")}
                      className="gap-2 rounded-xl bg-primary text-primary-foreground"
                    >
                      Continue
                      <User className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Sender Information Tab */}
              <TabsContent value="sender" className="space-y-6">
                <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <User className="h-5 w-5 text-primary" />
                      Sender Information
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Enter sender details and pickup location
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label
                          htmlFor="senderName"
                          className="text-sm font-medium flex items-center gap-1"
                        >
                          <User className="h-3 w-3" />
                          Full Name *
                        </Label>
                        <Input
                          id="senderName"
                          placeholder="Enter sender's name"
                          value={formData.senderName}
                          onChange={(e) =>
                            handleInputChange("senderName", e.target.value)
                          }
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label
                          htmlFor="senderPhone"
                          className="text-sm font-medium flex items-center gap-1"
                        >
                          <Phone className="h-3 w-3" />
                          Phone Number *
                        </Label>
                        <Input
                          id="senderPhone"
                          placeholder="9876543210"
                          value={formData.senderPhone}
                          onChange={(e) =>
                            handleInputChange("senderPhone", e.target.value)
                          }
                          className="rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="senderEmail"
                        className="text-sm font-medium flex items-center gap-1"
                      >
                        <Mail className="h-3 w-3" />
                        Email Address
                      </Label>
                      <Input
                        id="senderEmail"
                        type="email"
                        placeholder="sender@example.com"
                        value={formData.senderEmail}
                        onChange={(e) =>
                          handleInputChange("senderEmail", e.target.value)
                        }
                        className="rounded-xl"
                      />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label
                          htmlFor="senderPincode"
                          className="text-sm font-medium flex items-center gap-1"
                        >
                          <MapPinned className="h-3 w-3" />
                          Pincode *
                        </Label>
                        <Input
                          id="senderPincode"
                          placeholder="560001"
                          value={formData.senderPincode}
                          onChange={(e) =>
                            handleInputChange("senderPincode", e.target.value)
                          }
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label
                          htmlFor="senderGSTIN"
                          className="text-sm font-medium flex items-center gap-1"
                        >
                          <Shield className="h-3 w-3" />
                          GSTIN
                        </Label>
                        <Input
                          id="senderGSTIN"
                          placeholder="07AABCU9603R1ZM"
                          value={formData.senderGSTIN}
                          onChange={(e) =>
                            handleInputChange("senderGSTIN", e.target.value)
                          }
                          className="rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="senderAddress"
                        className="text-sm font-medium flex items-center gap-1"
                      >
                        <MapPin className="h-3 w-3" />
                        Complete Address *
                      </Label>
                      <Textarea
                        id="senderAddress"
                        placeholder="Enter complete address with landmark"
                        value={formData.senderAddress}
                        onChange={(e) =>
                          handleInputChange("senderAddress", e.target.value)
                        }
                        className="rounded-xl min-h-[100px]"
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("details")}
                    className="gap-2 rounded-xl"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    onClick={() => setActiveTab("receiver")}
                    className="gap-2 rounded-xl bg-primary text-primary-foreground"
                  >
                    Continue
                    <Users className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              {/* Receiver Information Tab */}
              <TabsContent value="receiver" className="space-y-6">
                <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Users className="h-5 w-5 text-primary" />
                      Receiver Information
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Enter receiver details and delivery location
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label
                          htmlFor="receiverName"
                          className="text-sm font-medium flex items-center gap-1"
                        >
                          <User className="h-3 w-3" />
                          Full Name *
                        </Label>
                        <Input
                          id="receiverName"
                          placeholder="Enter receiver's name"
                          value={formData.receiverName}
                          onChange={(e) =>
                            handleInputChange("receiverName", e.target.value)
                          }
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label
                          htmlFor="receiverPhone"
                          className="text-sm font-medium flex items-center gap-1"
                        >
                          <Phone className="h-3 w-3" />
                          Phone Number *
                        </Label>
                        <Input
                          id="receiverPhone"
                          placeholder="9876543210"
                          value={formData.receiverPhone}
                          onChange={(e) =>
                            handleInputChange("receiverPhone", e.target.value)
                          }
                          className="rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="receiverEmail"
                        className="text-sm font-medium flex items-center gap-1"
                      >
                        <Mail className="h-3 w-3" />
                        Email Address
                      </Label>
                      <Input
                        id="receiverEmail"
                        type="email"
                        placeholder="receiver@example.com"
                        value={formData.receiverEmail}
                        onChange={(e) =>
                          handleInputChange("receiverEmail", e.target.value)
                        }
                        className="rounded-xl"
                      />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label
                          htmlFor="receiverPincode"
                          className="text-sm font-medium flex items-center gap-1"
                        >
                          <MapPinned className="h-3 w-3" />
                          Pincode *
                        </Label>
                        <Input
                          id="receiverPincode"
                          placeholder="560001"
                          value={formData.receiverPincode}
                          onChange={(e) =>
                            handleInputChange("receiverPincode", e.target.value)
                          }
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label
                          htmlFor="receiverGSTIN"
                          className="text-sm font-medium flex items-center gap-1"
                        >
                          <Shield className="h-3 w-3" />
                          GSTIN
                        </Label>
                        <Input
                          id="receiverGSTIN"
                          placeholder="07AABCU9603R1ZM"
                          value={formData.receiverGSTIN}
                          onChange={(e) =>
                            handleInputChange("receiverGSTIN", e.target.value)
                          }
                          className="rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="receiverAddress"
                        className="text-sm font-medium flex items-center gap-1"
                      >
                        <MapPin className="h-3 w-3" />
                        Complete Address *
                      </Label>
                      <Textarea
                        id="receiverAddress"
                        placeholder="Enter complete address with landmark"
                        value={formData.receiverAddress}
                        onChange={(e) =>
                          handleInputChange("receiverAddress", e.target.value)
                        }
                        className="rounded-xl min-h-[100px]"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="specialInstructions"
                        className="text-sm font-medium flex items-center gap-1"
                      >
                        <AlertCircle className="h-3 w-3" />
                        Special Instructions
                      </Label>
                      <Textarea
                        id="specialInstructions"
                        placeholder="Any special delivery instructions, timing preferences, or handling requirements..."
                        value={formData.specialInstructions}
                        onChange={(e) =>
                          handleInputChange(
                            "specialInstructions",
                            e.target.value
                          )
                        }
                        className="rounded-xl min-h-[80px]"
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("sender")}
                    className="gap-2 rounded-xl"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    onClick={() => setActiveTab("review")}
                    className="gap-2 rounded-xl bg-primary text-primary-foreground"
                  >
                    Review & Book
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              {/* Review & Book Tab */}
              <TabsContent value="review" className="space-y-6">
                <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Scan className="h-5 w-5 text-primary" />
                      Review & Confirm Booking
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Verify all details before creating the booking
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <Card className="rounded-2xl border-blue-200 bg-blue-50/50">
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-600" />
                            Sender Details
                          </h3>
                          <div className="space-y-2 text-sm">
                            <p>
                              <strong>Name:</strong> {formData.senderName}
                            </p>
                            <p>
                              <strong>Phone:</strong> {formData.senderPhone}
                            </p>
                            <p>
                              <strong>Address:</strong> {formData.senderAddress}
                            </p>
                            <p>
                              <strong>Pincode:</strong> {formData.senderPincode}
                            </p>
                            {formData.senderGSTIN && (
                              <p>
                                <strong>GSTIN:</strong> {formData.senderGSTIN}
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="rounded-2xl border-green-200 bg-green-50/50">
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                            <Users className="h-4 w-4 text-green-600" />
                            Receiver Details
                          </h3>
                          <div className="space-y-2 text-sm">
                            <p>
                              <strong>Name:</strong> {formData.receiverName}
                            </p>
                            <p>
                              <strong>Phone:</strong> {formData.receiverPhone}
                            </p>
                            <p>
                              <strong>Address:</strong>{" "}
                              {formData.receiverAddress}
                            </p>
                            <p>
                              <strong>Pincode:</strong>{" "}
                              {formData.receiverPincode}
                            </p>
                            {formData.receiverGSTIN && (
                              <p>
                                <strong>GSTIN:</strong> {formData.receiverGSTIN}
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="rounded-2xl border-orange-200 bg-orange-50/50">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                          <Package className="h-4 w-4 text-orange-600" />
                          Package & Service Details
                        </h3>
                        <div className="grid gap-4 md:grid-cols-3 text-sm">
                          <div>
                            <p>
                              <strong>Service:</strong>{" "}
                              {
                                serviceTypes.find(
                                  (s) => s.value === formData.serviceType
                                )?.label
                              }
                            </p>
                            <p>
                              <strong>Weight:</strong> {formData.weight} kg
                            </p>
                          </div>
                          <div>
                            <p>
                              <strong>Payment:</strong>{" "}
                              {
                                paymentModes.find(
                                  (p) => p.value === formData.paymentMode
                                )?.label
                              }
                            </p>
                            {formData.paymentMode === "cod" && (
                              <p>
                                <strong>COD Amount:</strong> ₹
                                {formData.codAmount}
                              </p>
                            )}
                          </div>
                          <div>
                            <p>
                              <strong>Declared Value:</strong> ₹
                              {formData.declaredValue || "0"}
                            </p>
                            <p>
                              <strong>Type:</strong>{" "}
                              {
                                packageTypes.find(
                                  (p) => p.value === formData.packageType
                                )?.label
                              }
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-primary/20 bg-primary/5">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                          <IndianRupee className="h-4 w-4 text-primary" />
                          Charges Summary
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Base Freight:</span>
                            <span>
                              ₹{calculatedCharges.baseFreight.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Fuel Surcharge (12%):</span>
                            <span>
                              ₹{calculatedCharges.fuelSurcharge.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>GST (18%):</span>
                            <span>
                              ₹{calculatedCharges.serviceTax.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between font-semibold text-foreground border-t pt-2 text-base">
                            <span>Total Amount:</span>
                            <span className="text-primary">
                              ₹{calculatedCharges.totalAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("receiver")}
                    className="gap-2 rounded-xl"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    type="submit"
                    className="gap-2 rounded-xl bg-primary text-primary-foreground shadow-brand"
                  >
                    <Plus className="h-4 w-4" />
                    Create Booking & Generate AWB
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            <ChargesCalculator
              charges={calculatedCharges}
              onRecalculate={calculateCharges}
            />

            <AWBGeneration />

            <ServiceCoverage
              senderPincode={formData.senderPincode}
              receiverPincode={formData.receiverPincode}
            />

            <QuickActions />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateBooking;
