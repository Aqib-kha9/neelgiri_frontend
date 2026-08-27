// components/master/locations/LocationForm.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import {
  X,
  MapPin,
  Building,
  Warehouse,
  Store,
  Settings,
  Clock,
  Users,
  Shield,
  Truck,
  Package,
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
import { FacilityCapability, Location, LocationFormData } from "./types";

interface LocationFormProps {
  location: Location | null;
  onSave: (data: LocationFormData) => void;
  onCancel: () => void;
}

const LocationForm = ({ location, onSave, onCancel }: LocationFormProps) => {
  const [formData, setFormData] = useState<LocationFormData>({
    name: "",
    code: "",
    type: "hub",
    category: "PRIMARY",
    address: "",
    city: "",
    state: "",
    pincode: "",
    contactPerson: "",
    phone: "",
    email: "",
    capacity: { shipments: 0, storage: 0, maxWeightKg: 0, vehicleBays: 0 },
    facilities: [],
    operatingHours: {
      open: "09:00",
      close: "18:00",
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    services: [],
    status: "active",
    manager: "",
    coordinates: { lat: null, lng: null },
    securityLevel: "medium",
    lastAudit: "",
    nextAudit: "",
    ownershipType: "COCO",
    parentHubId: "",
    gstin: "",
    serviceability: { autoMapAddressPincode: true, defaultTransitDays: 3 },
  });

  const [parentLocations, setParentLocations] = useState<Location[]>([]);
  const [newService, setNewService] = useState("");
  const facilityOptions: FacilityCapability[] = [
    "Loading Dock",
    "CCTV",
    "Fire Safety",
    "Cold Storage",
    "Weighbridge",
    "Backup Power",
    "Security Staff",
    "24x7 Operations",
  ];
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

  useEffect(() => {
    const loadParentLocations = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE}/api/locations`, {
          params: { status: "ACTIVE" },
          headers: { Authorization: `Bearer ${token}` },
        });
        const list = Array.isArray(response.data) ? response.data : [];
        setParentLocations(list.map((item: any) => ({
          id: item._id || item.id,
          code: item.code || "",
          name: item.name || "Unnamed location",
          city: item.address?.city || "",
        })) as Location[]);
      } catch {
        setParentLocations([]);
      }
    };

    loadParentLocations();
  }, [API_BASE]);

  useEffect(() => {
    if (location) {
      setFormData({
        name: location.name,
        code: location.code,
        type: location.type,
        address: location.address,
        city: location.city,
        state: location.state,
        pincode: location.pincode,
        contactPerson: location.contactPerson,
        phone: location.phone,
        email: location.email,
        category: location.category || "PRIMARY",
        capacity: location.capacity,
        facilities: location.facilities,
        operatingHours: location.operatingHours,
        services: location.services,
        status: location.status,
        manager: location.manager,
        coordinates: location.coordinates,
        securityLevel: location.securityLevel,
        lastAudit: location.lastAudit,
        nextAudit: location.nextAudit,
        ownershipType: location.ownershipType || "COCO",
        parentHubId: location.parentHubId || "",
        gstin: location.gstin || "",
        serviceability: location.serviceability || { autoMapAddressPincode: false, defaultTransitDays: 3 },
      });
    }
  }, [location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const missingFields = [
      !formData.name.trim() && "location name",
      !formData.code.trim() && "location code",
      !formData.manager.trim() && "manager",
      !formData.contactPerson.trim() && "contact person",
      !formData.phone.trim() && "phone number",
      !formData.email.trim() && "email",
      !formData.address.trim() && "address",
      !formData.city.trim() && "city",
      !formData.state.trim() && "state",
      !/^\d{6}$/.test(formData.pincode.trim()) && "valid 6-digit pincode",
    ].filter(Boolean) as string[];

    if (missingFields.length > 0) {
      window.alert(`Please complete: ${missingFields.join(", ")}.`);
      return;
    }

    onSave({
      ...formData,
      code: formData.code.trim().toUpperCase(),
      pincode: formData.pincode.trim(),
    });
  };

  const handleInputChange = (field: keyof LocationFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleServiceabilityChange = (field: "autoMapAddressPincode" | "defaultTransitDays", value: boolean | number) => {
    setFormData((prev) => ({
      ...prev,
      serviceability: { ...prev.serviceability, [field]: value },
    }));
  };

  const handleCapacityChange = (
    field: keyof LocationFormData["capacity"],
    value: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      capacity: { ...prev.capacity, [field]: value },
    }));
  };

  const handleOperatingHoursChange = (
    field: keyof LocationFormData["operatingHours"],
    value: string | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      operatingHours: { ...prev.operatingHours, [field]: value },
    }));
  };

  const handleCoordinateChange = (
    field: keyof LocationFormData["coordinates"],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      coordinates: {
        ...prev.coordinates,
        [field]: value.trim() === "" ? null : parseFloat(value),
      },
    }));
  };

  const toggleFacility = (facility: FacilityCapability) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((item) => item !== facility)
        : [...prev.facilities, facility],
    }));
  };

  const removeFacility = (facility: string) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.filter((f) => f !== facility),
    }));
  };

  const addService = () => {
    if (newService.trim() && !formData.services.includes(newService.trim())) {
      setFormData((prev) => ({
        ...prev,
        services: [...prev.services, newService.trim()],
      }));
      setNewService("");
    }
  };

  const removeService = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s !== service),
    }));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "hub":
        return <Building className="h-5 w-5" />;
      case "warehouse":
        return <Warehouse className="h-5 w-5" />;
      case "counter":
        return <Store className="h-5 w-5" />;
      case "office":
        return <Settings className="h-5 w-5" />;
      case "processing_center":
        return <Package className="h-5 w-5" />;
      default:
        return <MapPin className="h-5 w-5" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border-border/70 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/70">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {location ? "Edit Location" : "Add New Location"}
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
            {/* Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground border-b pb-2">
                  Basic Information
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Location Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">Location Code *</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => handleInputChange("code", e.target.value)}
                      required
                      className="rounded-lg"
                      placeholder="e.g. HUB-DEL-01"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Location Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: any) =>
                      handleInputChange("type", value)
                    }
                  >
                    <SelectTrigger className="rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hub">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Hub
                        </div>
                      </SelectItem>
                      <SelectItem value="branch">Branch / Service Centre</SelectItem>
                      <SelectItem value="transit_hub">Transit Hub</SelectItem>
                      <SelectItem value="cross_dock">Cross-Dock</SelectItem>
                      <SelectItem value="delivery_center">Delivery Centre</SelectItem>
                      <SelectItem value="pickup_point">Pickup Point</SelectItem>
                      <SelectItem value="warehouse">
                        <div className="flex items-center gap-2">
                          <Warehouse className="h-4 w-4" />
                          Warehouse
                        </div>
                      </SelectItem>
                      <SelectItem value="counter">
                        <div className="flex items-center gap-2">
                          <Store className="h-4 w-4" />
                          Counter
                        </div>
                      </SelectItem>
                      <SelectItem value="office">
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          Office
                        </div>
                      </SelectItem>
                      <SelectItem value="processing_center">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          Processing Center
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ownershipType">Ownership Type</Label>
                    <Select
                      value={formData.ownershipType}
                      onValueChange={(value: any) =>
                        handleInputChange("ownershipType", value)
                      }
                    >
                      <SelectTrigger className="rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="COCO">COCO (Company Owned)</SelectItem>
                        <SelectItem value="FOFO">FOFO (Franchise Owned)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="parentHubId">Parent Hub (Optional)</Label>
                    <Select
                      value={formData.parentHubId || "none"}
                      onValueChange={(value) =>
                        handleInputChange("parentHubId", value === "none" ? "" : value)
                      }
                    >
                      <SelectTrigger className="rounded-lg"><SelectValue placeholder="Select a parent facility" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No parent facility</SelectItem>
                        {parentLocations.filter((item) => item.id !== location?.id).map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.code} — {item.name}{item.city ? ` (${item.city})` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gstin">GSTIN (Optional)</Label>
                  <Input
                    id="gstin"
                    value={formData.gstin}
                    onChange={(e) =>
                      handleInputChange("gstin", e.target.value)
                    }
                    className="rounded-lg"
                    placeholder="Goods and Services Tax Identification Number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manager">Manager *</Label>
                  <Input
                    id="manager"
                    value={formData.manager}
                    onChange={(e) =>
                      handleInputChange("manager", e.target.value)
                    }
                    required
                    className="rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person *</Label>
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
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground border-b pb-2">
                  Contact Information
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                    className="rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: any) =>
                        handleInputChange("status", value)
                      }
                    >
                      <SelectTrigger className="rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="securityLevel">Security Level</Label>
                    <Select
                      value={formData.securityLevel}
                      onValueChange={(value: any) =>
                        handleInputChange("securityLevel", value)
                      }
                    >
                      <SelectTrigger className="rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground border-b pb-2">
                Address Information
              </h3>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  required
                  className="rounded-lg min-h-[80px]"
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

                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    required
                    className="rounded-lg"
                  />
                </div>

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

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="lat">Latitude</Label>
                  <Input
                    id="lat"
                    type="number"
                    step="any"
                    value={formData.coordinates.lat ?? ""}
                    onChange={(e) =>
                      handleCoordinateChange("lat", e.target.value)
                    }
                    className="rounded-lg"
                    placeholder="e.g. 19.0760"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lng">Longitude</Label>
                  <Input
                    id="lng"
                    type="number"
                    step="any"
                    value={formData.coordinates.lng ?? ""}
                    onChange={(e) =>
                      handleCoordinateChange("lng", e.target.value)
                    }
                    className="rounded-lg"
                    placeholder="e.g. 72.8777"
                  />
                </div>
              </div>
            </div>

            {/* Capacity & Operating Hours */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground border-b pb-2">
                  Capacity
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="shipments">Daily Shipment Capacity</Label>
                  <Input
                    id="shipments"
                    type="number"
                    value={formData.capacity.shipments}
                    onChange={(e) =>
                      handleCapacityChange(
                        "shipments",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storage">Storage Capacity (sq ft)</Label>
                  <Input
                    id="storage"
                    type="number"
                    value={formData.capacity.storage}
                    onChange={(e) =>
                      handleCapacityChange(
                        "storage",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxWeightKg">Max Weight Throughput (kg)</Label>
                  <Input
                    id="maxWeightKg"
                    type="number"
                    min="0"
                    value={formData.capacity.maxWeightKg}
                    onChange={(e) => handleCapacityChange("maxWeightKg", parseInt(e.target.value) || 0)}
                    className="rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleBays">Vehicle / Docking Bays</Label>
                  <Input
                    id="vehicleBays"
                    type="number"
                    min="0"
                    value={formData.capacity.vehicleBays}
                    onChange={(e) => handleCapacityChange("vehicleBays", parseInt(e.target.value) || 0)}
                    className="rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground border-b pb-2">
                  Operating Hours
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="openTime">Open Time</Label>
                    <Input
                      id="openTime"
                      type="time"
                      value={formData.operatingHours.open}
                      onChange={(e) =>
                        handleOperatingHoursChange("open", e.target.value)
                      }
                      className="rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="closeTime">Close Time</Label>
                    <Input
                      id="closeTime"
                      type="time"
                      value={formData.operatingHours.close}
                      onChange={(e) =>
                        handleOperatingHoursChange("close", e.target.value)
                      }
                      className="rounded-lg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Working Days</Label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ].map((day) => (
                      <Badge
                        key={day}
                        variant={
                          formData.operatingHours.workingDays.includes(day)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer rounded-full"
                        onClick={() => {
                          const updatedDays =
                            formData.operatingHours.workingDays.includes(day)
                              ? formData.operatingHours.workingDays.filter(
                                (d) => d !== day
                              )
                              : [...formData.operatingHours.workingDays, day];
                          handleOperatingHoursChange(
                            "workingDays",
                            updatedDays
                          );
                        }}
                      >
                        {day.slice(0, 3)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Facilities & Services */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground border-b pb-2">Facility Capabilities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {facilityOptions.map((facility) => (
                    <Button key={facility} type="button" variant={formData.facilities.includes(facility) ? "default" : "outline"} className="justify-start rounded-lg text-xs" onClick={() => toggleFacility(facility)}>
                      {formData.facilities.includes(facility) ? "✓ " : ""}{facility}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground border-b pb-2">
                  Services
                </h3>

                <div className="flex gap-2">
                  <Input
                    placeholder="Add service..."
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    className="rounded-lg"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addService())
                    }
                  />
                  <Button
                    type="button"
                    onClick={addService}
                    className="rounded-lg"
                  >
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.services.map((service, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="rounded-full flex items-center gap-1"
                    >
                      {service}
                      <button
                        type="button"
                        onClick={() => removeService(service)}
                        className="hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Geographic Coverage */}
            <div className="space-y-4 rounded-xl border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900 dark:bg-blue-950/20">
              <h3 className="text-sm font-semibold text-foreground border-b pb-2">Geographic Coverage</h3>
              <p className="text-xs text-muted-foreground">
                Map this facility's address pincode to the operational serviceability master so it can be used for route planning.
              </p>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Label htmlFor="autoMapAddressPincode">Auto-map address pincode</Label>
                  <p className="text-xs text-muted-foreground">Enable serviceability for matching pincode records when this location is active.</p>
                </div>
                <Switch
                  id="autoMapAddressPincode"
                  checked={formData.serviceability.autoMapAddressPincode}
                  onCheckedChange={(checked) => handleServiceabilityChange("autoMapAddressPincode", checked)}
                />
              </div>
              <div className="space-y-2 max-w-xs">
                <Label htmlFor="defaultTransitDays">Default Transit Days</Label>
                <Input
                  id="defaultTransitDays"
                  type="number"
                  min={1}
                  max={30}
                  value={formData.serviceability.defaultTransitDays}
                  onChange={(e) => handleServiceabilityChange("defaultTransitDays", parseInt(e.target.value, 10) || 3)}
                  className="rounded-lg"
                />
              </div>
            </div>

            {/* Additional Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground border-b pb-2">
                Additional Settings
              </h3>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Operational availability is controlled by the Status field above. Active locations are available for route planning.
                  </p>

                  <div className="space-y-2">
                    <Label htmlFor="lastAudit">Last Audit Date</Label>
                    <Input
                      id="lastAudit"
                      type="date"
                      value={formData.lastAudit}
                      onChange={(e) =>
                        handleInputChange("lastAudit", e.target.value)
                      }
                      className="rounded-lg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nextAudit">Next Audit Date</Label>
                  <Input
                    id="nextAudit"
                    type="date"
                    value={formData.nextAudit}
                    onChange={(e) =>
                      handleInputChange("nextAudit", e.target.value)
                    }
                    className="rounded-lg"
                  />
                </div>
              </div>
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
                <MapPin className="h-4 w-4" />
                {location ? "Update Location" : "Create Location"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationForm;
