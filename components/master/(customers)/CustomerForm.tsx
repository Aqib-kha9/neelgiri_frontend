// components/master/customers/CustomerForm.tsx
import { useState, useEffect } from "react";
import {
  X,
  Building,
  Search,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  CreditCard,
  FileText,
  MapPin,
  User,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Customer, CustomerFormData, Receiver, PickupLocation } from "./types";

interface CustomerFormProps {
  customer: Customer | null;
  onSave: (data: CustomerFormData) => void;
  onCancel: () => void;
}

interface GstApiResponse {
  taxpayerInfo: {
    lgnm: string;
    tradeNam: string;
    pradr: {
      addr: {
        bno: string;
        st: string;
        loc: string;
        bnm: string;
        city: string;
        stcd: string;
        pncd: string;
      };
    };
    stj: string;
    sts: string;
    ctb: string;
    gstin: string;
  };
  error: boolean;
  message: string;
}

const CustomerForm = ({ customer, onSave, onCancel }: CustomerFormProps) => {
  const [formData, setFormData] = useState<CustomerFormData>({
    // Existing fields
    name: "",
    contactPerson: "",
    address1: "",
    address2: "",
    city: "",
    station: "",
    pincode: "",
    gstin: "",
    mobileNo: "",
    phoneO: "",
    phoneR: "",
    email: "",
    hasReceiver: false,
    receivers: [],
    usePickupLocation: false,
    pickupLocations: [],
    status: "active",
    fuelCharges: 0,
    fovCharges: 0,
    quotationType: "Standard",
    awt: 0,
    category: "CUSTOMER",
    paymentMode: "Cash",
    accountGroup: "General",
    isInterStateDealer: false,
    documentNo: "",
    bookedBy: "ADMIN",
    bookedDate: new Date().toLocaleString("en-IN"),
    remark: "",
    // New fields - SIRF JARURI CHIZE
    billingType: "PREPAID",
    creditLimit: 0,
    creditDays: 0,
    defaultPaymentMode: "CASH",
    // KYC Fields (optional but useful)
    kycStatus: "NOT_VERIFIED",
    kycDocumentType: "",
    kycDocumentNumber: "",
    paymentTerms: "Net 30",
    contractId: "",
    customerType: "REGULAR",
    registrationSource: "ADMIN",
    // Portal & Logistics
    portalAccess: false,
    portalEmail: "",
    portalPassword: "",
    allowedServices: [],
    serviceableZones: [],
    apiAccess: false,
    apiKey: "",
    webhookUrl: "",
  });

  const [gstSearch, setGstSearch] = useState("");
  const [gstLoading, setGstLoading] = useState(false);
  const [gstData, setGstData] = useState<any>(null);
  const [gstError, setGstError] = useState<string>("");
  const [pincodeSuggestions, setPincodeSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (customer) {
      setFormData({
        // Existing fields
        name: customer.name,
        contactPerson: customer.contactPerson,
        address1: customer.address1,
        address2: customer.address2,
        city: customer.city,
        station: customer.station,
        pincode: customer.pincode,
        gstin: customer.gstin,
        mobileNo: customer.mobileNo,
        phoneO: customer.phoneO,
        phoneR: customer.phoneR,
        email: customer.email,
        hasReceiver: customer.hasReceiver,
        receivers: customer.receivers || [],
        usePickupLocation: customer.usePickupLocation,
        pickupLocations: customer.pickupLocations || [],
        status: customer.status,
        fuelCharges: customer.fuelCharges,
        fovCharges: customer.fovCharges,
        quotationType: customer.quotationType,
        awt: customer.awt,
        category: customer.category,
        paymentMode: customer.paymentMode,
        accountGroup: customer.accountGroup,
        isInterStateDealer: customer.isInterStateDealer,
        documentNo: customer.documentNo,
        bookedBy: customer.bookedBy,
        bookedDate: customer.bookedDate,
        remark: customer.remark,
        // New fields
        billingType: customer.billingType || "PREPAID",
        creditLimit: customer.creditLimit || 0,
        creditDays: customer.creditDays || 0,
        defaultPaymentMode: customer.defaultPaymentMode || "CASH",
        kycStatus: customer.kycStatus || "NOT_VERIFIED",
        kycDocumentType: customer.kycDocumentType || "",
        kycDocumentNumber: customer.kycDocumentNumber || "",
        paymentTerms: customer.paymentTerms || "Net 30",
        contractId: customer.contractId || "",
        customerType: customer.customerType || "REGULAR",
        registrationSource: customer.registrationSource || "ADMIN",
        // Portal & Logistics
        portalAccess: customer.portalAccess || false,
        portalEmail: customer.portalEmail || customer.email || "",
        allowedServices: customer.allowedServices || [],
        serviceableZones: customer.serviceableZones || [],
        apiAccess: customer.apiAccess || false,
        apiKey: customer.apiKey || "",
        webhookUrl: customer.webhookUrl || "",
        portalPassword: "", // Reset password on edit
      });
      if (customer.gstin) {
        setGstSearch(customer.gstin);
      }
    }
  }, [customer]);

  const handleGstSearch = async () => {
    if (!gstSearch.trim()) return;

    setGstLoading(true);
    setGstError("");
    setGstData(null);

    try {
      const response = await fetch(
        `https://appyflow.in/api/verifyGST?gstNo=${gstSearch}&key_secret=vbPkxifWraP8OTLlb1lNF84llxW2`
      );

      const data: GstApiResponse = await response.json();

      if (data.error) {
        setGstError(data.message || "Invalid GSTIN or API error");
        return;
      }

      if (data.taxpayerInfo) {
        const taxpayer = data.taxpayerInfo;
        const address = taxpayer.pradr.addr;

        const addressLine1 = [address.bno, address.st]
          .filter(Boolean)
          .join(", ");
        const addressLine2 = [address.loc, address.bnm]
          .filter(Boolean)
          .join(", ");

        setGstData({
          legalName: taxpayer.lgnm,
          tradeName: taxpayer.tradeNam,
          address: addressLine1 + (addressLine2 ? `, ${addressLine2}` : ""),
          city: address.city || "",
          state: address.stcd || "",
          pincode: address.pncd || "",
          status: taxpayer.sts,
          businessType: taxpayer.ctb,
          jurisdiction: taxpayer.stj,
        });

        setFormData((prev) => ({
          ...prev,
          name: taxpayer.lgnm || prev.name,
          address1: addressLine1 || prev.address1,
          address2: addressLine2 || prev.address2,
          city: address.city || prev.city,
          station: taxpayer.stj || prev.station,
          pincode: address.pncd || prev.pincode,
          gstin: gstSearch,
        }));
      }
    } catch (error) {
      console.error("GST API error:", error);
      setGstError("Failed to verify GSTIN. Please try again.");
    } finally {
      setGstLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field: keyof CustomerFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addReceiver = () => {
    const newReceiver: Receiver = {
      id: `rec-${Date.now()}`,
      name: "",
      address: "",
      city: "",
      pincode: "",
      mobileNo: "",
      email: "",
    };
    setFormData((prev) => ({
      ...prev,
      receivers: [...prev.receivers, newReceiver],
    }));
  };

  const updateReceiver = (
    index: number,
    field: keyof Receiver,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      receivers: prev.receivers.map((receiver, i) =>
        i === index ? { ...receiver, [field]: value } : receiver
      ),
    }));
  };

  const removeReceiver = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      receivers: prev.receivers.filter((_, i) => i !== index),
    }));
  };

  const addPickupLocation = () => {
    const newPickupLocation: PickupLocation = {
      id: `pickup-${Date.now()}`,
      name: "",
      address: "",
      city: "",
      pincode: "",
      contactPerson: "",
      mobileNo: "",
    };
    setFormData((prev) => ({
      ...prev,
      pickupLocations: [...prev.pickupLocations, newPickupLocation],
    }));
  };

  const updatePickupLocation = (
    index: number,
    field: keyof PickupLocation,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      pickupLocations: prev.pickupLocations.map((location, i) =>
        i === index ? { ...location, [field]: value } : location
      ),
    }));
  };

  const removePickupLocation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      pickupLocations: prev.pickupLocations.filter((_, i) => i !== index),
    }));
  };

  const handlePincodeInput = (
    pincode: string,
    type: "receiver" | "pickup",
    index: number
  ) => {
    if (pincode.length >= 3) {
      setPincodeSuggestions(["500070", "500071", "500072", "302022", "110017"]);
    } else {
      setPincodeSuggestions([]);
    }

    if (type === "receiver") {
      updateReceiver(index, "pincode", pincode);
    } else {
      updatePickupLocation(index, "pincode", pincode);
    }
  };

  const selectPincodeSuggestion = (
    pincode: string,
    type: "receiver" | "pickup",
    index: number
  ) => {
    if (type === "receiver") {
      updateReceiver(index, "pincode", pincode);
    } else {
      updatePickupLocation(index, "pincode", pincode);
    }
    setPincodeSuggestions([]);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl border-border/70 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/70">
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            {customer ? "Edit Customer" : "Add New Customer"}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="rounded-lg"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* GST Search Section */}
            <div className="rounded-xl border border-border/60 p-4 bg-muted/30">
              <Label className="text-sm font-medium mb-3 block">
                GSTIN Lookup
              </Label>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Enter GSTIN number"
                    value={gstSearch}
                    onChange={(e) => setGstSearch(e.target.value)}
                    className="pr-20 rounded-lg"
                  />
                  {gstData && (
                    <Badge
                      variant="success"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full text-xs"
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <Button
                  type="button"
                  onClick={handleGstSearch}
                  disabled={gstLoading || !gstSearch.trim()}
                  className="gap-2 rounded-lg"
                >
                  <Search className="h-4 w-4" />
                  {gstLoading ? "Searching..." : "Search GST"}
                </Button>
              </div>

              {gstError && (
                <div className="mt-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                  <div className="flex items-center gap-2 text-sm text-destructive mb-2">
                    <AlertCircle className="h-4 w-4" />
                    GSTIN Verification Failed
                  </div>
                  <div className="text-xs text-destructive">{gstError}</div>
                </div>
              )}

              {gstData && (
                <div className="mt-3 p-3 bg-success/10 rounded-lg border border-success/20">
                  <div className="flex items-center gap-2 text-sm text-success mb-2">
                    <CheckCircle2 className="h-4 w-4" />
                    GSTIN Verified Successfully
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <strong>Legal Name:</strong> {gstData.legalName}
                    </div>
                    <div>
                      <strong>Trade Name:</strong> {gstData.tradeName}
                    </div>
                    <div>
                      <strong>Business Type:</strong> {gstData.businessType}
                    </div>
                    <div>
                      <strong>Status:</strong> {gstData.status}
                    </div>
                    <div>
                      <strong>State:</strong> {gstData.state}
                    </div>
                    <div>
                      <strong>Jurisdiction:</strong> {gstData.jurisdiction}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground border-b pb-2">
                  Basic Information
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="name">
                    Company/Individual Name *
                    <span className="text-xs text-muted-foreground ml-2">
                      (who will send the courier)
                    </span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    className="rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPerson">
                    Contact Person *
                    <span className="text-xs text-muted-foreground ml-2">
                      (contact for booking)
                    </span>
                  </Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) =>
                      handleInputChange("contactPerson", e.target.value)
                    }
                    required
                    className="rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gstin">
                    GSTIN
                    <span className="text-xs text-muted-foreground ml-2">
                      (For Invoice)
                    </span>
                  </Label>
                  <Input
                    id="gstin"
                    value={formData.gstin}
                    onChange={(e) => handleInputChange("gstin", e.target.value)}
                    className="rounded-lg"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground border-b pb-2">
                  Contact Information
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="mobileNo">
                    Mobile Number *
                    <span className="text-xs text-muted-foreground ml-2">
                      (for OTP and updates)
                    </span>
                  </Label>
                  <Input
                    id="mobileNo"
                    value={formData.mobileNo}
                    onChange={(e) =>
                      handleInputChange("mobileNo", e.target.value)
                    }
                    required
                    className="rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phoneO">Phone (Office)</Label>
                    <Input
                      id="phoneO"
                      value={formData.phoneO}
                      onChange={(e) =>
                        handleInputChange("phoneO", e.target.value)
                      }
                      className="rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneR">Phone (Residence)</Label>
                    <Input
                      id="phoneR"
                      value={formData.phoneR}
                      onChange={(e) =>
                        handleInputChange("phoneR", e.target.value)
                      }
                      className="rounded-lg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email
                    <span className="text-xs text-muted-foreground ml-2">
                      (for Invoice and receipts)
                    </span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Billing & Payment Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground border-b pb-2 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Billing & Payment
                  <span className="text-xs text-muted-foreground ml-2">
                    (money transactions)
                  </span>
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="billingType">
                    Billing Type *
                    <span className="text-xs text-muted-foreground ml-2">
                      (payment before/after delivery)
                    </span>
                  </Label>
                  <Select
                    value={formData.billingType}
                    onValueChange={(value) =>
                      handleInputChange("billingType", value)
                    }
                  >
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Select billing type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PREPAID">
                        🟢 Prepaid (payment in advance)
                      </SelectItem>
                      <SelectItem value="CREDIT">
                        🔵 Credit (payment after delivery)
                      </SelectItem>
                      <SelectItem value="COD">
                        🟡 Cash on Delivery (receiver will pay)
                      </SelectItem>
                      <SelectItem value="HYBRID">
                        🟣 Hybrid (mixed payment)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.billingType === "CREDIT" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="creditLimit">
                        Credit Limit (₹)
                        <span className="text-xs text-muted-foreground ml-2">
                          (how much credit can be given)
                        </span>
                      </Label>
                      <Input
                        id="creditLimit"
                        type="number"
                        min="0"
                        value={formData.creditLimit}
                        onChange={(e) =>
                          handleInputChange(
                            "creditLimit",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="creditDays">
                        Credit Days
                        <span className="text-xs text-muted-foreground ml-2">
                          (in how many days payment should be made)
                        </span>
                      </Label>
                      <Input
                        id="creditDays"
                        type="number"
                        min="0"
                        value={formData.creditDays}
                        onChange={(e) =>
                          handleInputChange(
                            "creditDays",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="rounded-lg"
                      />
                    </div>
                  </>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentTerms">Payment Terms</Label>
                    <Select
                      value={formData.paymentTerms}
                      onValueChange={(value: any) =>
                        handleInputChange("paymentTerms", value)
                      }
                    >
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder="Select terms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Immediate">Immediate</SelectItem>
                        <SelectItem value="Net 15">Net 15 Days</SelectItem>
                        <SelectItem value="Net 30">Net 30 Days</SelectItem>
                        <SelectItem value="Net 45">Net 45 Days</SelectItem>
                        <SelectItem value="Net 60">Net 60 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contractId">Contract ID</Label>
                    <Input
                      id="contractId"
                      value={formData.contractId}
                      onChange={(e) =>
                        handleInputChange("contractId", e.target.value)
                      }
                      className="rounded-lg"
                      placeholder="e.g. CTR-2024-001"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultPaymentMode">
                    Default Payment Mode
                    <span className="text-xs text-muted-foreground ml-2">
                      (how payment will be made)
                    </span>
                  </Label>
                  <Select
                    value={formData.defaultPaymentMode}
                    onValueChange={(value) =>
                      handleInputChange("defaultPaymentMode", value)
                    }
                  >
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Select payment mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CASH">💵 Cash</SelectItem>
                      <SelectItem value="ONLINE">🏦 Online Banking</SelectItem>
                      <SelectItem value="UPI">📱 UPI</SelectItem>
                      <SelectItem value="CHEQUE">📄 Cheque</SelectItem>
                      <SelectItem value="CARD">💳 Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* KYC Information (Optional) */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground border-b pb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  KYC Information
                  <span className="text-xs text-muted-foreground ml-2">
                    (Verification - optional)
                  </span>
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="kycStatus">KYC Status</Label>
                  <Select
                    value={formData.kycStatus}
                    onValueChange={(value) =>
                      handleInputChange("kycStatus", value)
                    }
                  >
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Select KYC status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NOT_VERIFIED">
                        ⭕ Not Verified
                      </SelectItem>
                      <SelectItem value="PENDING">🟡 Pending</SelectItem>
                      <SelectItem value="VERIFIED">🟢 Verified</SelectItem>
                      <SelectItem value="REJECTED">🔴 Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kycDocumentType">Document Type</Label>
                  <Select
                    value={formData.kycDocumentType}
                    onValueChange={(value) =>
                      handleInputChange("kycDocumentType", value)
                    }
                  >
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Select document" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PAN">PAN Card</SelectItem>
                      <SelectItem value="AADHAAR">Aadhaar Card</SelectItem>
                      <SelectItem value="PASSPORT">Passport</SelectItem>
                      <SelectItem value="DRIVING_LICENSE">
                        Driving License
                      </SelectItem>
                      <SelectItem value="VOTER_ID">Voter ID</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.kycDocumentType && (
                  <div className="space-y-2">
                    <Label htmlFor="kycDocumentNumber">
                      {formData.kycDocumentType === "PAN" && "PAN Number"}
                      {formData.kycDocumentType === "AADHAAR" &&
                        "Aadhaar Number"}
                      {formData.kycDocumentType === "PASSPORT" &&
                        "Passport Number"}
                      {formData.kycDocumentType === "DRIVING_LICENSE" &&
                        "DL Number"}
                      {formData.kycDocumentType === "VOTER_ID" &&
                        "Voter ID Number"}
                    </Label>
                    <Input
                      id="kycDocumentNumber"
                      value={formData.kycDocumentNumber}
                      onChange={(e) =>
                        handleInputChange("kycDocumentNumber", e.target.value)
                      }
                      className="rounded-lg"
                      placeholder={
                        formData.kycDocumentType === "PAN"
                          ? "e.g., ABCDE1234F"
                          : formData.kycDocumentType === "AADHAAR"
                            ? "e.g., 1234 5678 9012"
                            : "Enter document number"
                      }
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Portal & Logistics Configuration */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground border-b pb-2 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Portal Access
                  <span className="text-xs text-muted-foreground ml-2">
                    (Self-service)
                  </span>
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-border p-3 bg-muted/30">
                    <div className="space-y-0.5">
                      <Label className="text-base">Enable Portal Access</Label>
                      <div className="text-xs text-muted-foreground">
                        Allow customer to login and book shipments
                      </div>
                    </div>
                    <Switch
                      checked={formData.portalAccess}
                      onCheckedChange={(checked) =>
                        handleInputChange("portalAccess", checked)
                      }
                    />
                  </div>

                  {formData.portalAccess && (
                    <div className="space-y-4 p-4 border border-border rounded-lg bg-card/50 animate-in fade-in slide-in-from-top-2">
                      <div className="space-y-2">
                        <Label htmlFor="portalEmail">Portal Email (Username)</Label>
                        <Input
                          id="portalEmail"
                          value={formData.portalEmail}
                          onChange={(e) =>
                            handleInputChange("portalEmail", e.target.value)
                          }
                          placeholder="e.g. customer@example.com"
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="portalPassword">
                          Set Password
                          <span className="text-xs text-muted-foreground ml-2">
                            (Leave empty to keep existing)
                          </span>
                        </Label>
                        <Input
                          id="portalPassword"
                          type="password"
                          value={formData.portalPassword || ""}
                          onChange={(e) =>
                            handleInputChange("portalPassword", e.target.value)
                          }
                          className="rounded-lg"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground border-b pb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Logistics Configuration
                  <span className="text-xs text-muted-foreground ml-2">
                    (Service controls)
                  </span>
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Allowed Services</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Air Express", "Surface Standard", "Hyperlocal", "International"].map((service) => (
                        <div
                          key={service}
                          className={`
                            cursor-pointer rounded-lg border p-3 flex items-center justify-between transition-all
                            ${formData.allowedServices?.includes(service)
                              ? "bg-primary/10 border-primary text-primary"
                              : "bg-background border-border hover:bg-muted"
                            }
                          `}
                          onClick={() => {
                            const current = formData.allowedServices || [];
                            const updated = current.includes(service)
                              ? current.filter(s => s !== service)
                              : [...current, service];
                            handleInputChange("allowedServices", updated);
                          }}
                        >
                          <span className="text-sm font-medium">{service}</span>
                          {formData.allowedServices?.includes(service) && (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Serviceable Zones</Label>
                    <Select
                      value={""}
                      onValueChange={(value) => {
                        const current = formData.serviceableZones || [];
                        if (!current.includes(value)) {
                          handleInputChange("serviceableZones", [...current, value]);
                        }
                      }}
                    >
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder="Add Zones..." />
                      </SelectTrigger>
                      <SelectContent>
                        {["North", "South", "East", "West", "Central", "North-East"].map(zone => (
                          <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.serviceableZones?.map((zone) => (
                        <Badge key={zone} variant="secondary" className="rounded-full pl-2 pr-1 py-1 flex items-center gap-1">
                          {zone}
                          <button
                            type="button"
                            onClick={() => {
                              handleInputChange(
                                "serviceableZones",
                                formData.serviceableZones.filter((z) => z !== zone)
                              );
                            }}
                            className="hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground border-b pb-2">
                Billing Address
                <span className="text-xs text-muted-foreground ml-2">
                  (address to send the invoice)
                </span>
              </h3>

              <div className="space-y-2">
                <Label htmlFor="address1">Address Line 1 *</Label>
                <Input
                  id="address1"
                  value={formData.address1}
                  onChange={(e) =>
                    handleInputChange("address1", e.target.value)
                  }
                  required
                  className="rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address2">Address Line 2</Label>
                <Input
                  id="address2"
                  value={formData.address2}
                  onChange={(e) =>
                    handleInputChange("address2", e.target.value)
                  }
                  className="rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    required
                    className="rounded-lg"
                  />
                </div>

                {/* <div className="space-y-2">
                  <Label htmlFor="station">
                    Station
                    <span className="text-xs text-muted-foreground ml-2">
                      (Nearest delivery station)
                    </span>
                  </Label>
                  <Input
                    id="station"
                    value={formData.station}
                    onChange={(e) =>
                      handleInputChange("station", e.target.value)
                    }
                    className="rounded-lg"
                  />
                </div> */}

                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) =>
                      handleInputChange("pincode", e.target.value)
                    }
                    required
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Receiver Details - IMPORTANT FOR DELIVERY */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  Receiver Details
                  <span className="text-xs text-muted-foreground ml-2">
                    (who will receive the courier)
                  </span>
                </h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="hasReceiver" className="text-sm">
                      Multiple Receivers?
                    </Label>
                    <Switch
                      id="hasReceiver"
                      checked={formData.hasReceiver}
                      onCheckedChange={(checked) =>
                        handleInputChange("hasReceiver", checked)
                      }
                    />
                  </div>
                  {formData.hasReceiver && (
                    <Button
                      type="button"
                      onClick={addReceiver}
                      className="gap-2 rounded-lg"
                      size="sm"
                    >
                      <Plus className="h-4 w-4" />
                      Add Receiver
                    </Button>
                  )}
                </div>
              </div>

              {!formData.hasReceiver && (
                <div className="rounded-xl border border-border/60 p-4 bg-muted/30">
                  <div className="text-sm text-muted-foreground mb-4">
                    📝 <strong>Note:</strong> By default, customer himself is
                    the receiver. Enable "Multiple Receivers" if customer sends
                    to different people.
                  </div>
                </div>
              )}

              {formData.hasReceiver && formData.receivers.length > 0 && (
                <div className="space-y-4">
                  {formData.receivers.map((receiver, index) => (
                    <div
                      key={receiver.id}
                      className="rounded-xl border border-border/60 p-4 bg-muted/30"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium">
                          Receiver {index + 1}
                        </h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeReceiver(index)}
                          className="h-8 w-8 p-0 text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Name *</Label>
                          <Input
                            value={receiver.name}
                            onChange={(e) =>
                              updateReceiver(index, "name", e.target.value)
                            }
                            required
                            className="rounded-lg"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Mobile Number *</Label>
                          <Input
                            value={receiver.mobileNo}
                            onChange={(e) =>
                              updateReceiver(index, "mobileNo", e.target.value)
                            }
                            required
                            className="rounded-lg"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={receiver.email}
                            onChange={(e) =>
                              updateReceiver(index, "email", e.target.value)
                            }
                            className="rounded-lg"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Pincode *</Label>
                          <div className="relative">
                            <Input
                              value={receiver.pincode}
                              onChange={(e) =>
                                handlePincodeInput(
                                  e.target.value,
                                  "receiver",
                                  index
                                )
                              }
                              required
                              className="rounded-lg"
                            />
                            {pincodeSuggestions.length > 0 && (
                              <div className="absolute z-10 w-full mt-1 bg-white border border-border rounded-lg shadow-lg">
                                {pincodeSuggestions.map((pincode) => (
                                  <div
                                    key={pincode}
                                    className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                                    onClick={() =>
                                      selectPincodeSuggestion(
                                        pincode,
                                        "receiver",
                                        index
                                      )
                                    }
                                  >
                                    {pincode}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Address *</Label>
                          <Input
                            value={receiver.address}
                            onChange={(e) =>
                              updateReceiver(index, "address", e.target.value)
                            }
                            required
                            disabled={!receiver.pincode}
                            className="rounded-lg"
                            placeholder={
                              !receiver.pincode
                                ? "Please enter pincode first"
                                : "Enter delivery address"
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>City *</Label>
                          <Input
                            value={receiver.city}
                            onChange={(e) =>
                              updateReceiver(index, "city", e.target.value)
                            }
                            required
                            className="rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pickup Locations - IMPORTANT FOR COURIER PICKUP */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  Pickup Locations
                  <span className="text-xs text-muted-foreground ml-2">
                    (pickup location of the courier)
                  </span>
                </h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="usePickupLocation" className="text-sm">
                      Multiple Pickup Locations?
                    </Label>
                    <Switch
                      id="usePickupLocation"
                      checked={formData.usePickupLocation}
                      onCheckedChange={(checked) =>
                        handleInputChange("usePickupLocation", checked)
                      }
                    />
                  </div>
                  {formData.usePickupLocation && (
                    <Button
                      type="button"
                      onClick={addPickupLocation}
                      className="gap-2 rounded-lg"
                      size="sm"
                    >
                      <Plus className="h-4 w-4" />
                      Add Location
                    </Button>
                  )}
                </div>
              </div>

              {!formData.usePickupLocation && (
                <div className="rounded-xl border border-border/60 p-4 bg-muted/30">
                  <div className="text-sm text-muted-foreground">
                    📦 <strong>Note:</strong> By default, billing address will
                    be used for pickup. Enable if customer has multiple pickup
                    locations.
                  </div>
                </div>
              )}

              {formData.usePickupLocation &&
                formData.pickupLocations.length > 0 && (
                  <div className="space-y-4">
                    {formData.pickupLocations.map((location, index) => (
                      <div
                        key={location.id}
                        className="rounded-xl border border-border/60 p-4 bg-muted/30"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-medium">
                            Pickup Location {index + 1}
                          </h4>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removePickupLocation(index)}
                            className="h-8 w-8 p-0 text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Location Name *</Label>
                            <Input
                              value={location.name}
                              onChange={(e) =>
                                updatePickupLocation(
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                              required
                              className="rounded-lg"
                              placeholder="e.g., Main Office, Warehouse, Branch"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Contact Person *</Label>
                            <Input
                              value={location.contactPerson}
                              onChange={(e) =>
                                updatePickupLocation(
                                  index,
                                  "contactPerson",
                                  e.target.value
                                )
                              }
                              required
                              className="rounded-lg"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Mobile Number *</Label>
                            <Input
                              value={location.mobileNo}
                              onChange={(e) =>
                                updatePickupLocation(
                                  index,
                                  "mobileNo",
                                  e.target.value
                                )
                              }
                              required
                              className="rounded-lg"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Pincode *</Label>
                            <div className="relative">
                              <Input
                                value={location.pincode}
                                onChange={(e) =>
                                  handlePincodeInput(
                                    e.target.value,
                                    "pickup",
                                    index
                                  )
                                }
                                required
                                className="rounded-lg"
                              />
                              {pincodeSuggestions.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-border rounded-lg shadow-lg">
                                  {pincodeSuggestions.map((pincode) => (
                                    <div
                                      key={pincode}
                                      className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                                      onClick={() =>
                                        selectPincodeSuggestion(
                                          pincode,
                                          "pickup",
                                          index
                                        )
                                      }
                                    >
                                      {pincode}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label>Address *</Label>
                            <Input
                              value={location.address}
                              onChange={(e) =>
                                updatePickupLocation(
                                  index,
                                  "address",
                                  e.target.value
                                )
                              }
                              required
                              disabled={!location.pincode}
                              className="rounded-lg"
                              placeholder={
                                !location.pincode
                                  ? "Please enter pincode first"
                                  : "Enter pickup address"
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>City *</Label>
                            <Input
                              value={location.city}
                              onChange={(e) =>
                                updatePickupLocation(
                                  index,
                                  "city",
                                  e.target.value
                                )
                              }
                              required
                              className="rounded-lg"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>

            {/* Category & Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground border-b pb-2">
                  Customer Type
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CUSTOMER">
                        👤 Regular Customer
                      </SelectItem>
                      <SelectItem value="CORPORATE">🏢 Corporate</SelectItem>
                      <SelectItem value="E_COMMERCE">
                        🛒 E-commerce Seller
                      </SelectItem>
                      <SelectItem value="RETAIL">🏪 Retail Shop</SelectItem>
                      <SelectItem value="INDIVIDUAL">👨‍💼 Individual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "active" | "inactive") =>
                      handleInputChange("status", value)
                    }
                  >
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">✅ Active</SelectItem>
                      <SelectItem value="inactive">⛔ Inactive</SelectItem>
                      <SelectItem value="BLOCKED">🚫 Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Document No (Optional - for internal reference) */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground border-b pb-2">
                  Internal Reference
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="documentNo">
                    Document No
                    <span className="text-xs text-muted-foreground ml-2">
                      (Optional - for your internal reference)
                    </span>
                  </Label>
                  <Input
                    id="documentNo"
                    value={formData.documentNo}
                    onChange={(e) =>
                      handleInputChange("documentNo", e.target.value)
                    }
                    className="rounded-lg"
                    placeholder="e.g., DOC-2024-001"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bookedBy">Registered By</Label>
                  <Input
                    id="bookedBy"
                    value={formData.bookedBy}
                    onChange={(e) =>
                      handleInputChange("bookedBy", e.target.value)
                    }
                    className="rounded-lg"
                    placeholder="Who registered this customer"
                  />
                </div>
              </div>
            </div>

            {/* Remarks */}
            <div className="space-y-2">
              <Label htmlFor="remark">
                Remarks / Notes
                <span className="text-xs text-muted-foreground ml-2">
                  (Any special instructions)
                </span>
              </Label>
              <Textarea
                id="remark"
                value={formData.remark}
                onChange={(e) => handleInputChange("remark", e.target.value)}
                className="rounded-lg min-h-[80px]"
                placeholder="e.g., Special delivery instructions, preferred time for pickup, etc."
              />
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4 border-t border-border/70">
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-lg"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 gap-2 rounded-lg bg-green-600 hover:bg-green-700"
              >
                <CheckCircle2 className="h-4 w-4" />
                {customer ? "Update Customer" : "Create Customer"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerForm;
