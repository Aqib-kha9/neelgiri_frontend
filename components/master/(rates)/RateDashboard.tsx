// components/master/rates/RateDashboard.tsx
"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  Calculator,
  Percent,
  Weight,
  Map,
  Tag,
  Building,
  Users,
  X,
  ChevronDown,
  ChevronUp,
  IndianRupee,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Package,
  Zap,
  BarChart3,
  Copy,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  Shield,
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import RateForm from "./RateForm";
import FreightCalculator from "./FreightCalculator";
import RateDetailsModal from "./RateDetailsModal";
import { RateRule } from "./types";
import { mockRateRules } from "./mockData";

const RateDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customerType, setCustomerType] = useState<
    "ALL" | "CUSTOMER" | "AGENT" | "VENDOR"
  >("ALL");
  const [serviceType, setServiceType] = useState<
    "ALL" | "SURFACE" | "AIR" | "EXPRESS"
  >("ALL");
  const [paymentMode, setPaymentMode] = useState<
    "ALL" | "PREPAID" | "COD" | "CREDIT"
  >("ALL");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "INACTIVE" | "EXPIRED"
  >("ALL");
  const [selectedRate, setSelectedRate] = useState<RateRule | null>(null);
  const [expandedRates, setExpandedRates] = useState<string[]>([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRateForDetails, setSelectedRateForDetails] =
    useState<RateRule | null>(null);

  // Mock data with more realistic rates
  const rateRules = mockRateRules;

  // Filter rates
  const filteredRates = useMemo(() => {
    return rateRules.filter((rate) => {
      // Search filter
      const searchMatch =
        searchTerm === "" ||
        rate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rate.id.toLowerCase().includes(searchTerm.toLowerCase());

      // Customer type filter
      const customerMatch =
        customerType === "ALL" || rate.customerType === customerType;

      // Service type filter
      const serviceMatch =
        serviceType === "ALL" || rate.serviceType === serviceType;

      // Payment mode filter
      const paymentMatch =
        paymentMode === "ALL" || rate.paymentMode === paymentMode;

      // Status filter
      const statusMatch =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" &&
          rate.isActive &&
          new Date(rate.validTo) >= new Date()) ||
        (statusFilter === "INACTIVE" && !rate.isActive) ||
        (statusFilter === "EXPIRED" && new Date(rate.validTo) < new Date());

      return (
        searchMatch &&
        customerMatch &&
        serviceMatch &&
        paymentMatch &&
        statusMatch
      );
    });
  }, [searchTerm, customerType, serviceType, paymentMode, statusFilter]);

  // Stats calculation
  const stats = {
    totalRates: rateRules.length,
    activeRates: rateRules.filter(
      (r) => r.isActive && new Date(r.validTo) >= new Date()
    ).length,
    expiringSoon: rateRules.filter((r) => {
      const daysToExpiry = Math.ceil(
        (new Date(r.validTo).getTime() - new Date().getTime()) /
        (1000 * 3600 * 24)
      );
      return daysToExpiry <= 30 && daysToExpiry > 0;
    }).length,
    expiredRates: rateRules.filter((r) => new Date(r.validTo) < new Date())
      .length,
    customerRates: rateRules.filter((r) => r.customerType === "CUSTOMER")
      .length,
    agentRates: rateRules.filter((r) => r.customerType === "AGENT").length,
    vendorRates: rateRules.filter((r) => r.customerType === "VENDOR").length,
  };

  const toggleExpand = (rateId: string) => {
    setExpandedRates((prev) =>
      prev.includes(rateId)
        ? prev.filter((id) => id !== rateId)
        : [...prev, rateId]
    );
  };

  const handleDelete = (rateId: string) => {
    if (confirm("Are you sure you want to delete this rate rule?")) {
      console.log("Delete rate:", rateId);
      // API call here
    }
  };
  const handleShowDetails = (rate: RateRule) => {
    setSelectedRateForDetails(rate);
    setShowDetailsModal(true);
  };

  const handleDuplicate = (rate: RateRule) => {
    const duplicated = {
      ...rate,
      id: `RATE-${Date.now()}`,
      name: `${rate.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    console.log("Duplicate rate:", duplicated);
    // API call here
  };

  const handleCalculateFreight = () => {
    setShowCalculator(true);
  };

  const getStatusBadge = (rate: RateRule) => {
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

  const getCustomerTypeBadge = (type: string) => {
    const config = {
      CUSTOMER: { label: "Customer", color: "bg-blue-100 text-blue-800" },
      AGENT: { label: "Agent", color: "bg-green-100 text-green-800" },
      VENDOR: { label: "Vendor", color: "bg-purple-100 text-purple-800" },
      ALL: { label: "All", color: "bg-gray-100 text-gray-800" },
    };

    const cfg = config[type as keyof typeof config] || config.ALL;
    return (
      <Badge className={`rounded-full ${cfg.color} border-0`}>
        {cfg.label}
      </Badge>
    );
  };

  const getServiceTypeBadge = (type: string) => {
    const config = {
      SURFACE: { label: "Surface", color: "bg-green-100 text-green-800" },
      AIR: { label: "Air", color: "bg-blue-100 text-blue-800" },
      EXPRESS: { label: "Express", color: "bg-purple-100 text-purple-800" },
      ALL: { label: "All", color: "bg-gray-100 text-gray-800" },
    };

    const cfg = config[type as keyof typeof config] || config.ALL;
    return (
      <Badge variant="outline" className={cfg.color.replace("bg-", "")}>
        {cfg.label}
      </Badge>
    );
  };

  if (showForm) {
    return (
      <RateForm
        onClose={() => setShowForm(false)}
        initialData={selectedRate || undefined}
      />
    );
  }

  if (showCalculator) {
    return (
      <FreightCalculator
        onClose={() => setShowCalculator(false)}
        rates={rateRules}
      />
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Rate Management</h1>
          <p className="text-muted-foreground">
            Define and manage pricing rules for shipments
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleCalculateFreight}
          >
            <Calculator className="h-4 w-4" />
            Calculate Freight
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            onClick={() => {
              setSelectedRate(null);
              setShowForm(true);
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            New Rate Rule
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Rules</p>
                <p className="text-2xl font-bold">{stats.totalRates}</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-2">
                <Tag className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Rules</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.activeRates}
                </p>
              </div>
              <div className="rounded-lg bg-green-100 p-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.expiringSoon}
                </p>
              </div>
              <div className="rounded-lg bg-orange-100 p-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expired</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.expiredRates}
                </p>
              </div>
              <div className="rounded-lg bg-red-100 p-2">
                <Clock className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, ID..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <Select
                  value={customerType}
                  onValueChange={(v: any) => setCustomerType(v)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Customer Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    <SelectItem value="CUSTOMER">Customer</SelectItem>
                    <SelectItem value="AGENT">Agent</SelectItem>
                    <SelectItem value="VENDOR">Vendor</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={serviceType}
                  onValueChange={(v: any) => setServiceType(v)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Service Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Services</SelectItem>
                    <SelectItem value="SURFACE">Surface</SelectItem>
                    <SelectItem value="AIR">Air</SelectItem>
                    <SelectItem value="EXPRESS">Express</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={paymentMode}
                  onValueChange={(v: any) => setPaymentMode(v)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Payment Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Modes</SelectItem>
                    <SelectItem value="PREPAID">Prepaid</SelectItem>
                    <SelectItem value="COD">COD</SelectItem>
                    <SelectItem value="CREDIT">Credit</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={statusFilter}
                  onValueChange={(v: any) => setStatusFilter(v)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="EXPIRED">Expired</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setSearchTerm("");
                    setCustomerType("ALL");
                    setServiceType("ALL");
                    setPaymentMode("ALL");
                    setStatusFilter("ALL");
                  }}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="gap-1">
                <Building className="h-3 w-3" />
                Customers: {stats.customerRates}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Users className="h-3 w-3" />
                Agents: {stats.agentRates}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Package className="h-3 w-3" />
                Vendors: {stats.vendorRates}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <BarChart3 className="h-3 w-3" />
                Showing: {filteredRates.length}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rate Rules List */}
      <div className="space-y-4">
        {filteredRates.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">
                No rate rules found
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || customerType !== "ALL" || serviceType !== "ALL"
                  ? "No rules match your current filters. Try adjusting your search criteria."
                  : "Get started by creating your first rate rule."}
              </p>
              <Button
                onClick={() => {
                  setSelectedRate(null);
                  setShowForm(true);
                }}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Rate Rule
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredRates.map((rate) => (
            <Card
              key={rate.id}
              className="border-border/50 hover:border-primary/50 transition-colors"
            >
              <CardContent className="p-0">
                {/* Rate Header */}
                <div className="p-4 border-b">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <Tag className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">
                              {rate.name}
                            </h3>
                            {getStatusBadge(rate)}
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {getCustomerTypeBadge(rate.customerType)}
                            {getServiceTypeBadge(rate.serviceType)}
                            <Badge variant="outline">
                              {rate.paymentMode === "ALL"
                                ? "All Payments"
                                : rate.paymentMode}
                            </Badge>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Valid:{" "}
                              {new Date(rate.validFrom).toLocaleDateString(
                                "en-IN"
                              )}{" "}
                              -{" "}
                              {new Date(rate.validTo).toLocaleDateString(
                                "en-IN"
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Action Buttons */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleShowDetails(rate)} // <-- YEH CHANGE KARO
                        title="Show Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {/* Main return statement ke end me, just before closing div: */}
                      {showDetailsModal && selectedRateForDetails && (
                        <RateDetailsModal
                          rate={selectedRateForDetails}
                          onClose={() => {
                            setShowDetailsModal(false);
                            setSelectedRateForDetails(null);
                          }}
                        />
                      )}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedRate(rate);
                            setShowForm(true);
                          }}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {/* <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDuplicate(rate)}
                          title="Duplicate"
                        >
                          <Copy className="h-4 w-4" />
                        </Button> */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(rate.id)}
                          title="Delete"
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedRates.includes(rate.id) && (
                  <div className="p-4 space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm flex items-center gap-2">
                          <Package className="h-4 w-4 text-blue-500" />
                          Weight Slabs
                        </h4>
                        <div className="space-y-2">
                          {rate.slabs.map((slab) => (
                            <div
                              key={slab.id}
                              className="flex justify-between text-sm"
                            >
                              <span className="text-muted-foreground">
                                {slab.slabName}:
                              </span>
                              <span className="font-medium">
                                ₹{slab.rate}{" "}
                                {slab.rateType === "PER_KG" ? "/kg" : ""}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-sm flex items-center gap-2">
                          <Map className="h-4 w-4 text-green-500" />
                          Zone Rates
                        </h4>
                        <div className="space-y-2">
                          {rate.zones.slice(0, 3).map((zone) => (
                            <div
                              key={zone.id}
                              className="flex justify-between text-sm"
                            >
                              <span className="text-muted-foreground">
                                {zone.fromZone} → {zone.toZone}:
                              </span>
                              <span className="font-medium">
                                ₹{zone.rate} ({zone.transitDays} days)
                              </span>
                            </div>
                          ))}
                          {rate.zones.length > 3 && (
                            <div className="text-xs text-muted-foreground">
                              +{rate.zones.length - 3} more zones...
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-sm flex items-center gap-2">
                          <Percent className="h-4 w-4 text-purple-500" />
                          Charges
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Fuel Surcharge:
                            </span>
                            <span className="font-medium">
                              {rate.fuelSurcharge.percentage}%
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              FOV Charge:
                            </span>
                            <span className="font-medium">
                              {rate.fovCharge.percentage}%
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              COD Charges:
                            </span>
                            <span className="font-medium">
                              {rate.codCharges.percentage}%
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Minimum Charge:
                            </span>
                            <span className="font-medium">
                              ₹{rate.minCharge.amount}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Charges */}
                    {rate.additionalCharges.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm mb-3">
                          Additional Charges
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {rate.additionalCharges.map((charge) => (
                            <div
                              key={charge.id}
                              className="border rounded-lg p-3"
                            >
                              <div className="flex justify-between items-start">
                                <span className="font-medium text-sm">
                                  {charge.name}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {charge.type === "FIXED" ? "₹" : ""}
                                  {charge.value}
                                  {charge.type === "PERCENTAGE" ? "%" : ""}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {charge.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Restrictions & Auto Calculation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                          <Shield className="h-4 w-4 text-orange-500" />
                          Restrictions
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Weight Range:
                            </span>
                            <span>
                              {rate.restrictions.minWeight} -{" "}
                              {rate.restrictions.maxWeight} kg
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Allowed Packaging:
                            </span>
                            <span>
                              {rate.restrictions.allowedPackaging.join(", ")}
                            </span>
                          </div>
                          {rate.restrictions.specialInstructions && (
                            <div>
                              <span className="text-muted-foreground">
                                Instructions:
                              </span>
                              <p className="text-sm mt-1">
                                {rate.restrictions.specialInstructions}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                          <Zap className="h-4 w-4 text-green-500" />
                          Auto Calculation
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Enabled:
                            </span>
                            <Switch
                              checked={rate.autoCalculate.enabled}
                              disabled
                            />
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Base Calculation On:
                            </span>
                            <span>{rate.autoCalculate.baseOn}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Rounding:
                            </span>
                            <span>
                              {rate.autoCalculate.rounding} (Factor:{" "}
                              {rate.autoCalculate.roundingFactor})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="text-xs text-muted-foreground flex flex-wrap gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Created:{" "}
                        {new Date(rate.createdAt).toLocaleDateString("en-IN")}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Updated:{" "}
                        {new Date(rate.updatedAt).toLocaleDateString("en-IN")}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        By: {rate.createdBy}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDuplicate(rate)}
                        className="gap-1"
                      >
                        <Copy className="h-3 w-3" />
                        Duplicate
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedRate(rate);
                          setShowForm(true);
                        }}
                        className="gap-1"
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCalculateFreight()}
                        className="gap-1"
                      >
                        <Calculator className="h-3 w-3" />
                        Test Calculation
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(rate.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default RateDashboard;
