"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
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
  Loader2,
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

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

interface IndiaStateOption {
  name: string;
  isoCode: string;
}

type PincodeValidationStatus = "idle" | "checking" | "valid" | "invalid";

interface BranchPincodeValidationResponse {
  valid: true;
  pincode: string;
  officeName: string;
  district: string;
  state: string;
}

interface PartnerOption {
  _id: string;
  partnerCode: string;
  companyName: string;
  userId?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    status?: string;
  } | null;
  status: string;
}

const AddBranch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session } = useAuth();
  const editId = searchParams.get("edit");
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");
  const [submitting, setSubmitting] = useState(false);
  const [states, setStates] = useState<IndiaStateOption[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedStateCode, setSelectedStateCode] = useState("");
  const [statesLoading, setStatesLoading] = useState(true);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [statesError, setStatesError] = useState("");
  const [citiesError, setCitiesError] = useState("");
  const [pincodeStatus, setPincodeStatus] =
    useState<PincodeValidationStatus>("idle");
  const [pincodeMessage, setPincodeMessage] = useState("");
  const [validatedPincodeKey, setValidatedPincodeKey] = useState("");
  const [partners, setPartners] = useState<PartnerOption[]>([]);
  const [partnersLoading, setPartnersLoading] = useState(false);
  const [partnersError, setPartnersError] = useState("");
  const [selectedPartnerId, setSelectedPartnerId] = useState("");
  const isSuperAdmin = session?.user?.role === "super_admin";
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

  useEffect(() => {
    const controller = new AbortController();

    const loadStates = async () => {
      setStatesLoading(true);
      setStatesError("");

      try {
        const { data } = await axios.get<{ states: IndiaStateOption[] }>(
          `${API_BASE}/api/places/india/states`,
          { signal: controller.signal }
        );
        setStates(data.states);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error("Failed to load Indian states", error);
          setStatesError("States could not be loaded. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) setStatesLoading(false);
      }
    };

    loadStates();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!selectedStateCode) {
      setCities([]);
      setCitiesError("");
      return;
    }

    const controller = new AbortController();

    const loadCities = async () => {
      setCitiesLoading(true);
      setCitiesError("");
      setCities([]);

      try {
        const { data } = await axios.get<{ cities: string[] }>(
          `${API_BASE}/api/places/india/cities`,
          {
            params: { stateCode: selectedStateCode },
            signal: controller.signal,
          }
        );
        setCities(data.cities);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error("Failed to load cities", error);
          setCitiesError("Cities could not be loaded. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) setCitiesLoading(false);
      }
    };

    loadCities();
    return () => controller.abort();
  }, [selectedStateCode]);

  useEffect(() => {
    if (!isSuperAdmin || formData.type !== "partner") {
      setPartners([]);
      setPartnersError("");
      setPartnersLoading(false);
      return;
    }

    const controller = new AbortController();
    const loadPartners = async () => {
      setPartnersLoading(true);
      setPartnersError("");
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get<PartnerOption[]>(
          `${API_BASE}/api/partners`,
          {
            params: { status: "ACTIVE" },
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }
        );
        setPartners(Array.isArray(data) ? data : []);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error("Failed to load active partners", error);
          setPartnersError("Active partners could not be loaded.");
        }
      } finally {
        if (!controller.signal.aborted) setPartnersLoading(false);
      }
    };

    loadPartners();
    return () => controller.abort();
  }, [formData.type, isSuperAdmin]);

  useEffect(() => {
    const pincode = formData.pincode.trim();
    const validationKey = `${pincode}|${formData.state}|${formData.city}`;

    setValidatedPincodeKey("");
    if (!pincode || !formData.state || !formData.city) {
      setPincodeStatus("idle");
      setPincodeMessage("");
      return;
    }
    if (!/^\d{6}$/.test(pincode)) {
      setPincodeStatus("invalid");
      setPincodeMessage("Enter exactly 6 digits");
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setPincodeStatus("checking");
      setPincodeMessage("Verifying with Pincode Master...");

      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get<BranchPincodeValidationResponse>(
          `${API_BASE}/api/pincodes/validate-branch/${pincode}`,
          {
            params: { state: formData.state, city: formData.city },
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }
        );
        const location = [data.officeName, data.district]
          .filter(Boolean)
          .join(", ");
        setPincodeStatus("valid");
        setPincodeMessage(
          location ? `Verified: ${location}, ${data.state}` : "Pincode verified"
        );
        setValidatedPincodeKey(validationKey);
      } catch (error: any) {
        if (!axios.isCancel(error)) {
          setPincodeStatus("invalid");
          setPincodeMessage(
            error?.response?.data?.message || "Pincode could not be verified"
          );
        }
      }
    }, 500);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [formData.pincode, formData.state, formData.city]);

  const handleStateChange = (stateCode: string) => {
    const selectedState = states.find((state) => state.isoCode === stateCode);
    setSelectedStateCode(stateCode);
    setFormData((prev) => ({
      ...prev,
      state: selectedState?.name || "",
      city: "",
    }));
  };

  const handleInputChange = (field: keyof BranchFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOwnershipChange = (value: "company" | "partner") => {
    handleInputChange("type", value);
    if (value === "company") setSelectedPartnerId("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      toast.error("Branch name and code are required");
      return;
    }
    if (!formData.address || !formData.state || !formData.city || !formData.pincode) {
      toast.error("Address, state, city, and pincode are required");
      return;
    }
    const currentPincodeKey = `${formData.pincode.trim()}|${formData.state}|${formData.city}`;
    if (
      !/^\d{6}$/.test(formData.pincode.trim()) ||
      pincodeStatus !== "valid" ||
      validatedPincodeKey !== currentPincodeKey
    ) {
      toast.error("Enter a valid Pincode Master entry for the selected state and city");
      return;
    }
    if (!editId && isSuperAdmin && formData.type === "partner" && !selectedPartnerId) {
      toast.error("Select an active partner for a partner-owned branch");
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        phone: formData.phone,
        contact: formData.email,
        type: "branch",
        ownershipType: formData.type,
        operationalType: "branch",
        serviceArea: formData.serviceArea,
        managerName: formData.managerName,
        managerEmail: formData.managerEmail,
        managerPhone: formData.managerPhone,
        staffCount: formData.staffCount ? Number(formData.staffCount) : 0,
        emergencyContact: formData.emergencyContact,
        supportEmail: formData.supportEmail,
        latitude: formData.latitude,
        longitude: formData.longitude,
        operatingHours: formData.operatingHours,
        workingDays: formData.workingDays,
        maxDailyCapacity: formData.maxDailyCapacity ? Number(formData.maxDailyCapacity) : 0,
        serviceRadius: formData.serviceRadius ? Number(formData.serviceRadius) : 0,
        hasWarehouse: formData.hasWarehouse,
        hasPickupCounter: formData.hasPickupCounter,
        isActive: formData.status === "active",
        ...(isSuperAdmin && !editId && formData.type === "partner"
          ? { partnerId: selectedPartnerId }
          : {}),
      };

      if (editId) {
        await axios.put(`${API_BASE}/api/branches/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Branch updated successfully!");
      } else {
        await axios.post(`${API_BASE}/api/branches`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Branch created successfully!");
      }
      router.push("/dashboard/branches");
    } catch (error: any) {
      console.error("Failed to save branch", error);
      const msg = error?.response?.data?.message || "Failed to save branch";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkUploadData.file) {
      toast.error("Please select a CSV file to upload");
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const formDataObj = new FormData();
      formDataObj.append("file", bulkUploadData.file);

      await axios.post(`${API_BASE}/api/branches/bulk`, formDataObj, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Branches uploaded successfully!");
      router.push("/dashboard/branches");
    } catch (error: any) {
      console.error("Failed to upload branches", error);
      const msg = error?.response?.data?.message || "Failed to upload branches";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
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

                    <div className="space-y-2">
                      <Label htmlFor="code">Branch Code *</Label>
                      <Input
                        id="code"
                        placeholder="e.g., DEL-CENT"
                        value={formData.code}
                        onChange={(e) =>
                          handleInputChange(
                            "code",
                            e.target.value
                              .toUpperCase()
                              .replace(/[^A-Z0-9-]/g, "")
                          )
                        }
                        maxLength={30}
                        required
                        className="rounded-lg font-mono uppercase"
                      />
                      <p className="text-xs text-muted-foreground">
                        Unique identifier using letters, numbers, and hyphens.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Branch Type *</Label>
                      <RadioGroup
                        value={formData.type}
                        onValueChange={handleOwnershipChange}
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

                    {isSuperAdmin && formData.type === "partner" && !editId && (
                      <div className="space-y-2">
                        <Label htmlFor="partner-account">Partner Account *</Label>
                        <Select
                          value={selectedPartnerId}
                          onValueChange={setSelectedPartnerId}
                          disabled={partnersLoading || partners.length === 0}
                        >
                          <SelectTrigger id="partner-account" className="rounded-lg">
                            <SelectValue
                              placeholder={
                                partnersLoading
                                  ? "Loading active partners..."
                                  : "Select an active partner"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {partners.map((partner) => {
                              if (!partner.userId?._id) return null;
                              return (
                                <SelectItem
                                  key={partner.userId._id}
                                  value={partner.userId._id}
                                >
                                  {partner.companyName} ({partner.partnerCode})
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        {partnersError ? (
                          <p className="text-xs text-destructive">{partnersError}</p>
                        ) : partners.length === 0 && !partnersLoading ? (
                          <p className="text-xs text-muted-foreground">
                            No active partner accounts are available.
                          </p>
                        ) : null}
                      </div>
                    )}

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
                      <Label htmlFor="state">State *</Label>
                      <Select
                        value={selectedStateCode}
                        onValueChange={handleStateChange}
                        disabled={statesLoading || Boolean(statesError)}
                      >
                        <SelectTrigger id="state" className="rounded-lg">
                          <SelectValue
                            placeholder={statesLoading ? "Loading states..." : "Select state"}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {states.map((state) => (
                            <SelectItem key={state.isoCode} value={state.isoCode}>
                              {state.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {statesError && (
                        <p className="text-xs text-destructive">{statesError}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Select
                        value={formData.city}
                        onValueChange={(value) => handleInputChange("city", value)}
                        disabled={
                          !selectedStateCode ||
                          citiesLoading ||
                          Boolean(citiesError) ||
                          cities.length === 0
                        }
                      >
                        <SelectTrigger id="city" className="rounded-lg">
                          <SelectValue
                            placeholder={
                              !selectedStateCode
                                ? "Select state first"
                                : citiesLoading
                                  ? "Loading cities..."
                                  : cities.length === 0
                                    ? "No cities available"
                                    : "Select city"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {citiesError && (
                        <p className="text-xs text-destructive">{citiesError}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode *</Label>
                      <div className="relative">
                        <Input
                          id="pincode"
                          placeholder="e.g., 400001"
                          value={formData.pincode}
                          onChange={(e) =>
                            handleInputChange(
                              "pincode",
                              e.target.value.replace(/\D/g, "").slice(0, 6)
                            )
                          }
                          inputMode="numeric"
                          maxLength={6}
                          required
                          className="rounded-lg pr-10"
                        />
                        {pincodeStatus === "checking" && (
                          <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
                        )}
                        {pincodeStatus === "valid" && (
                          <CheckCircle2 className="absolute right-3 top-2.5 h-4 w-4 text-green-600" />
                        )}
                      </div>
                      {pincodeMessage && (
                        <p
                          className={`text-xs ${pincodeStatus === "valid"
                            ? "text-green-600"
                            : pincodeStatus === "invalid"
                              ? "text-destructive"
                              : "text-muted-foreground"
                            }`}
                        >
                          {pincodeMessage}
                        </p>
                      )}
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
                  disabled={submitting || pincodeStatus === "checking"}
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  {editId ? "Update Branch" : "Create Branch"}
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
                disabled={!bulkUploadData.file || submitting}
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
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
