"use client";

import { useState } from "react";
import {
  Building,
  MapPin,
  Users,
  Phone,
  Mail,
  Clock,
  DollarSign,
  Shield,
  UserCheck,
  CheckCircle2,
  Upload,
  X,
  Download,
  FileText,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { BranchFormData, BulkUploadData } from "./types";
import { cities, states } from "./mockData";

const AddBranch = () => {
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");
  const [formData, setFormData] = useState<BranchFormData>({
    // Basic Information
    name: "",
    code: "",
    type: "company",
    status: "active",

    // Location Details
    address: "",
    city: "",
    state: "",
    pincode: "",
    serviceArea: "",
    latitude: "",
    longitude: "",

    // Contact Details
    phone: "",
    email: "",
    emergencyContact: "",
    supportEmail: "",

    // Staff & Operations
    managerName: "",
    managerEmail: "",
    managerPhone: "",
    staffCount: "",
    operatingHours: {
      open: "09:00",
      close: "18:00",
    },
    workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    maxDailyCapacity: "500",
    serviceRadius: "10",
    hasWarehouse: true,
    hasPickupCounter: true,
  });

  const [bulkUploadData, setBulkUploadData] = useState<BulkUploadData>({
    file: null,
    mapping: {},
    preview: [],
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleInputChange = (field: keyof BranchFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedChange = (
    parent: keyof BranchFormData,
    field: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as any),
        [field]: value,
      },
    }));
  };

  const handleArrayToggle = (
    arrayName: keyof BranchFormData,
    value: string
  ) => {
    setFormData((prev) => {
      const currentArray = prev[arrayName] as string[];
      return {
        ...prev,
        [arrayName]: currentArray.includes(value)
          ? currentArray.filter((item) => item !== value)
          : [...currentArray, value],
      };
    });
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBulkFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBulkUploadData((prev) => ({
        ...prev,
        file,
        preview: [
          { name: "Mumbai Central", code: "MUM-CENT", status: "Ready" },
          { name: "Delhi North", code: "DEL-NORTH", status: "Ready" },
          { name: "Bangalore South", code: "BLR-SOUTH", status: "Ready" },
        ],
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Branch Data:", formData);
    alert("Branch created successfully!");
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Bulk Upload Data:", bulkUploadData);
    alert("Branches uploaded successfully!");
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-100 p-2">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Add New Branch
              </h1>
              <p className="text-muted-foreground">
                Create a new branch in your delivery network
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="gap-2 rounded-xl border-border/70"
          >
            <Download className="h-4 w-4" />
            Download Template
          </Button>
        </div>
      </div>

      {/* Upload Mode Tabs */}
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Button
              variant={activeTab === "single" ? "default" : "outline"}
              onClick={() => setActiveTab("single")}
              className="flex-1 gap-2 rounded-lg"
            >
              <Building className="h-4 w-4" />
              Single Branch
            </Button>
            <Button
              variant={activeTab === "bulk" ? "default" : "outline"}
              onClick={() => setActiveTab("bulk")}
              className="flex-1 gap-2 rounded-lg"
            >
              <Upload className="h-4 w-4" />
              Bulk Upload
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Single Branch Form */}
      {activeTab === "single" && (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Panel - Basic Information */}
            <div className="xl:col-span-1 space-y-6">
              <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Building className="h-5 w-5 text-primary" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Logo Upload */}
                  <div className="space-y-3">
                    <Label>Branch Logo</Label>
                    <div className="flex items-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-dashed border-border">
                        {logoPreview ? (
                          <div className="relative">
                            <img
                              src={logoPreview}
                              alt="Branch logo"
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -right-1 -top-1 h-4 w-4 rounded-full"
                              onClick={() => setLogoPreview(null)}
                            >
                              <X className="h-2 w-2" />
                            </Button>
                          </div>
                        ) : (
                          <Building className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                          id="logo-upload"
                        />
                        <Label
                          htmlFor="logo-upload"
                          className="cursor-pointer rounded-lg border border-border/70 bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted/50"
                        >
                          <Upload className="mr-1 inline h-3 w-3" />
                          Upload Logo
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          256x256px PNG or JPG
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="name">Branch Name *</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Mumbai Central Hub"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        required
                        className="rounded-lg"
                      />
                    </div>

                    {/* <div className="space-y-2">
                      <Label htmlFor="code">Branch Code *</Label>
                      <Input
                        id="code"
                        placeholder="e.g., MUM-CENT"
                        value={formData.code}
                        onChange={(e) =>
                          handleInputChange("code", e.target.value)
                        }
                        required
                        className="rounded-lg"
                      />
                    </div> */}

                    <div className="space-y-2">
                      <Label>Branch Type *</Label>
                      <RadioGroup
                        value={formData.type}
                        onValueChange={(value: "company" | "partner") =>
                          handleInputChange("type", value)
                        }
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="company" id="company" />
                          <Label
                            htmlFor="company"
                            className="flex items-center gap-2 text-sm"
                          >
                            <Shield className="h-4 w-4 text-primary" />
                            Company Owned
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="partner" id="partner" />
                          <Label
                            htmlFor="partner"
                            className="flex items-center gap-2 text-sm"
                          >
                            <Users className="h-4 w-4 text-orange-500" />
                            Partner Branch
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(
                          value: "active" | "inactive" | "maintenance"
                        ) => handleInputChange("status", value)}
                      >
                        <SelectTrigger className="rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="maintenance">
                            Maintenance
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Facilities */}
              {/* <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Building className="h-5 w-5 text-primary" />
                    Facilities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <Label
                      htmlFor="hasWarehouse"
                      className="flex items-center gap-2 text-sm"
                    >
                      <Building className="h-4 w-4 text-muted-foreground" />
                      Warehouse Storage
                    </Label>
                    <Switch
                      id="hasWarehouse"
                      checked={formData.hasWarehouse}
                      onCheckedChange={(checked) =>
                        handleInputChange("hasWarehouse", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <Label
                      htmlFor="hasPickupCounter"
                      className="flex items-center gap-2 text-sm"
                    >
                      <UserCheck className="h-4 w-4 text-muted-foreground" />
                      Customer Pickup Counter
                    </Label>
                    <Switch
                      id="hasPickupCounter"
                      checked={formData.hasPickupCounter}
                      onCheckedChange={(checked) =>
                        handleInputChange("hasPickupCounter", checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card> */}
            </div>

            {/* Right Panel - Detailed Information */}
            <div className="xl:col-span-2 space-y-6">
              {/* Location Details */}
              <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <MapPin className="h-5 w-5 text-primary" />
                    Location Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Complete Address *</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter full street address with landmark"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      rows={3}
                      required
                      className="rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Select
                        value={formData.city}
                        onValueChange={(value) =>
                          handleInputChange("city", value)
                        }
                      >
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city} value={city.toLowerCase()}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Select
                        value={formData.state}
                        onValueChange={(value) =>
                          handleInputChange("state", value)
                        }
                      >
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {states.map((state) => (
                            <SelectItem key={state} value={state.toLowerCase()}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        placeholder="e.g., 400001"
                        value={formData.pincode}
                        onChange={(e) =>
                          handleInputChange("pincode", e.target.value)
                        }
                        required
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="serviceArea">
                      Service Area Description
                    </Label>
                    <Textarea
                      id="serviceArea"
                      placeholder="Describe the areas this branch serves"
                      value={formData.serviceArea}
                      onChange={(e) =>
                        handleInputChange("serviceArea", e.target.value)
                      }
                      rows={2}
                      className="rounded-lg"
                    />
                  </div>

                  {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        placeholder="e.g., 19.0760"
                        value={formData.latitude}
                        onChange={(e) =>
                          handleInputChange("latitude", e.target.value)
                        }
                        className="rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        placeholder="e.g., 72.8777"
                        value={formData.longitude}
                        onChange={(e) =>
                          handleInputChange("longitude", e.target.value)
                        }
                        className="rounded-lg"
                      />
                    </div>
                  </div> */}
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Phone className="h-5 w-5 text-primary" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="flex items-center gap-2"
                      >
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        Primary Phone
                      </Label>
                      <Input
                        id="phone"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        // required
                        className="rounded-lg"
                      />
                    </div>

                    {/* <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="flex items-center gap-2"
                      >
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        Primary Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="branch@company.com"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        required
                        className="rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">
                        Emergency Contact
                      </Label>
                      <Input
                        id="emergencyContact"
                        placeholder="+91 98765 43210"
                        value={formData.emergencyContact}
                        onChange={(e) =>
                          handleInputChange("emergencyContact", e.target.value)
                        }
                        className="rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="supportEmail">Support Email</Label>
                      <Input
                        id="supportEmail"
                        type="email"
                        placeholder="support@branch.com"
                        value={formData.supportEmail}
                        onChange={(e) =>
                          handleInputChange("supportEmail", e.target.value)
                        }
                        className="rounded-lg"
                      />
                    </div> */}
                  </div>
                </CardContent>
              </Card>

              {/* Staff & Operations */}
              {/* <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Users className="h-5 w-5 text-primary" />
                    Staff & Operations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="managerName">Manager Name *</Label>
                      <Input
                        id="managerName"
                        placeholder="Enter full name"
                        value={formData.managerName}
                        onChange={(e) =>
                          handleInputChange("managerName", e.target.value)
                        }
                        required
                        className="rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="managerEmail">Manager Email *</Label>
                      <Input
                        id="managerEmail"
                        type="email"
                        placeholder="manager@branch.com"
                        value={formData.managerEmail}
                        onChange={(e) =>
                          handleInputChange("managerEmail", e.target.value)
                        }
                        required
                        className="rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="managerPhone">Manager Phone *</Label>
                      <Input
                        id="managerPhone"
                        placeholder="+91 98765 43210"
                        value={formData.managerPhone}
                        onChange={(e) =>
                          handleInputChange("managerPhone", e.target.value)
                        }
                        required
                        className="rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="staffCount">Staff Count</Label>
                      <Input
                        id="staffCount"
                        type="number"
                        placeholder="e.g., 15"
                        value={formData.staffCount}
                        onChange={(e) =>
                          handleInputChange("staffCount", e.target.value)
                        }
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="openTime"
                        className="flex items-center gap-2"
                      >
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        Opening Time
                      </Label>
                      <Input
                        id="openTime"
                        type="time"
                        value={formData.operatingHours.open}
                        onChange={(e) =>
                          handleNestedChange(
                            "operatingHours",
                            "open",
                            e.target.value
                          )
                        }
                        className="rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="closeTime"
                        className="flex items-center gap-2"
                      >
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        Closing Time
                      </Label>
                      <Input
                        id="closeTime"
                        type="time"
                        value={formData.operatingHours.close}
                        onChange={(e) =>
                          handleNestedChange(
                            "operatingHours",
                            "close",
                            e.target.value
                          )
                        }
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="maxDailyCapacity"
                        className="flex items-center gap-2"
                      >
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        Max Daily Capacity
                      </Label>
                      <Input
                        id="maxDailyCapacity"
                        type="number"
                        placeholder="e.g., 500"
                        value={formData.maxDailyCapacity}
                        onChange={(e) =>
                          handleInputChange("maxDailyCapacity", e.target.value)
                        }
                        className="rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="serviceRadius"
                        className="flex items-center gap-2"
                      >
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        Service Radius (km)
                      </Label>
                      <Input
                        id="serviceRadius"
                        type="number"
                        placeholder="e.g., 10"
                        value={formData.serviceRadius}
                        onChange={(e) =>
                          handleInputChange("serviceRadius", e.target.value)
                        }
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card> */}

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="gap-2 rounded-xl bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Create Branch
                </Button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Bulk Upload Form */}
      {activeTab === "bulk" && (
        <form onSubmit={handleBulkSubmit}>
          <div className="space-y-6">
            <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Upload className="h-5 w-5 text-primary" />
                  Bulk Upload Branches
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border-2 border-dashed border-border/70 p-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">
                      Upload CSV File
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Upload a CSV file containing branch details. Download the
                      template for reference.
                    </p>
                  </div>
                  <div className="mt-4">
                    <Input
                      type="file"
                      accept=".csv"
                      onChange={handleBulkFileUpload}
                      className="hidden"
                      id="bulk-upload"
                    />
                    <Label
                      htmlFor="bulk-upload"
                      className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      <Upload className="mr-2 inline h-4 w-4" />
                      Choose File
                    </Label>
                    {bulkUploadData.file && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        Selected: {bulkUploadData.file.name}
                      </div>
                    )}
                  </div>
                </div>

                {bulkUploadData.preview.length > 0 && (
                  <div className="space-y-3">
                    <Label>Upload Preview</Label>
                    <div className="rounded-lg border border-border/70">
                      <div className="grid grid-cols-12 gap-4 p-3 border-b border-border/70 bg-muted/30 text-sm font-medium">
                        <div className="col-span-4">Branch Name</div>
                        <div className="col-span-3">Branch Code</div>
                        <div className="col-span-3">City</div>
                        <div className="col-span-2">Status</div>
                      </div>
                      {bulkUploadData.preview.map((branch, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-12 gap-4 p-3 border-b border-border/70 text-sm"
                        >
                          <div className="col-span-4">{branch.name}</div>
                          <div className="col-span-3">{branch.code}</div>
                          <div className="col-span-3">{branch.city || "-"}</div>
                          <div className="col-span-2">
                            <Badge
                              variant="success"
                              className="rounded-full text-xs"
                            >
                              {branch.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                className="gap-2 rounded-xl bg-green-600 hover:bg-green-700"
                size="lg"
                disabled={!bulkUploadData.file}
              >
                <Upload className="h-4 w-4" />
                Upload Branches
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddBranch;
