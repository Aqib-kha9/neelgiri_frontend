// components/master/(pincodes)/PincodeForm.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Pincode } from "./types";
import {
  MapPin,
  Globe,
  Building2,
  AlertTriangle,
  Clock,
  Loader2,
} from "lucide-react";

interface Branch {
  _id: string;
  name: string;
  code: string;
}

interface PincodeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void; // Just refresh list after save
  pincode: Pincode | null;
}

const ZONES = ["NORTH", "SOUTH", "EAST", "WEST", "CENTRAL", "NORTHEAST", "OTHER"];

const defaultForm = {
  pincode: "",
  officeName: "",
  district: "",
  state: "",
  zone: "OTHER",
  branchId: "",
  isServiceable: false,
  isODA: false,
  transitDays: 3,
  latitude: "",
  longitude: "",
};

const PincodeForm = ({ open, onOpenChange, onSave, pincode }: PincodeFormProps) => {
  const [formData, setFormData] = useState(defaultForm);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch branches for dropdown
  useEffect(() => {
    const fetchBranches = async () => {
      setLoadingBranches(true);
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("/api/branches", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBranches(data.branches || data || []);
      } catch {
        toast.error("Could not load branches");
      } finally {
        setLoadingBranches(false);
      }
    };
    if (open) fetchBranches();
  }, [open]);

  // Populate form when editing
  useEffect(() => {
    if (pincode) {
      setFormData({
        pincode: pincode.pincode || "",
        officeName: pincode.officeName || "",
        district: pincode.district || "",
        state: pincode.state || "",
        zone: pincode.zone || "OTHER",
        branchId: pincode.branchId?._id || "",
        isServiceable: pincode.isServiceable ?? false,
        isODA: pincode.isODA ?? false,
        transitDays: pincode.transitDays ?? 3,
        latitude: pincode.latitude?.toString() || "",
        longitude: pincode.longitude?.toString() || "",
      });
    } else {
      setFormData(defaultForm);
    }
  }, [pincode, open]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.pincode.length !== 6 || !/^\d{6}$/.test(formData.pincode)) {
      toast.error("Pincode must be exactly 6 digits");
      return;
    }
    if (!formData.district.trim() || !formData.state.trim()) {
      toast.error("District and State are required");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const payload: Record<string, any> = {
        pincode: formData.pincode.trim(),
        officeName: formData.officeName.trim(),
        district: formData.district.trim(),
        state: formData.state.trim(),
        zone: formData.zone,
        isServiceable: formData.isServiceable,
        isODA: formData.isODA,
        transitDays: Number(formData.transitDays) || 3,
        branchId: formData.branchId || null,
        latitude: formData.latitude !== "" ? parseFloat(formData.latitude as string) : null,
        longitude: formData.longitude !== "" ? parseFloat(formData.longitude as string) : null,
      };

      if (pincode) {
        // Edit mode → PUT
        await axios.put(`/api/pincodes/${pincode._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(`Pincode ${formData.pincode} updated successfully`);
      } else {
        // Create mode → POST
        await axios.post("/api/pincodes", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(`Pincode ${formData.pincode} added successfully`);
      }

      onSave();
      onOpenChange(false);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to save pincode";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[560px] sm:w-[560px] sm:max-w-[560px] flex flex-col h-full">
        <SheetHeader className="flex-none">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle>
                {pincode ? `Edit — ${pincode.pincode}` : "Add New Pincode"}
              </SheetTitle>
              <SheetDescription>
                {pincode
                  ? `Update serviceability details for ${pincode.pincode}`
                  : "Add a new serviceable pincode to the network."}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6 pr-1">
          <form id="pincode-form" onSubmit={handleSubmit} className="space-y-6">

            {/* ── Pincode + Service Status ─────────────────────── */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode <span className="text-destructive">*</span></Label>
                <Input
                  id="pincode"
                  placeholder="6-digit pincode"
                  value={formData.pincode}
                  onChange={(e) => handleChange("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  className="font-mono text-lg tracking-widest"
                  required
                  disabled={!!pincode} // Don't allow changing pincode on edit
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transitDays" className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" /> Transit Days
                </Label>
                <Input
                  id="transitDays"
                  type="number"
                  min={1}
                  max={30}
                  value={formData.transitDays}
                  onChange={(e) => handleChange("transitDays", parseInt(e.target.value) || 3)}
                />
              </div>
            </div>

            <Separator />

            {/* ── Location Info ─────────────────────────────────── */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-500" /> Location Details
              </h4>
              <div className="space-y-2">
                <Label htmlFor="officeName">Area / Office Name</Label>
                <Input
                  id="officeName"
                  placeholder="e.g. Andheri East SO"
                  value={formData.officeName}
                  onChange={(e) => handleChange("officeName", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="district">District <span className="text-destructive">*</span></Label>
                  <Input
                    id="district"
                    placeholder="e.g. Mumbai Suburban"
                    value={formData.district}
                    onChange={(e) => handleChange("district", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State <span className="text-destructive">*</span></Label>
                  <Input
                    id="state"
                    placeholder="e.g. Maharashtra"
                    value={formData.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="zone">Delivery Zone</Label>
                <Select
                  value={formData.zone}
                  onValueChange={(val) => handleChange("zone", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {ZONES.map((z) => (
                      <SelectItem key={z} value={z}>{z}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* ── Branch Mapping ────────────────────────────────── */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" /> Branch Mapping
              </h4>
              <div className="space-y-2">
                <Label htmlFor="branchId">Controlling Branch</Label>
                {loadingBranches ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground border rounded-lg px-3 py-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading branches...
                  </div>
                ) : (
                  <Select
                    value={formData.branchId || "__none__"}
                    onValueChange={(val) => handleChange("branchId", val === "__none__" ? "" : val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">— Not Mapped —</SelectItem>
                      {branches.map((b) => (
                        <SelectItem key={b._id} value={b._id}>
                          {b.name} ({b.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <p className="text-[10px] text-muted-foreground">
                  The branch responsible for pickups &amp; deliveries at this pincode.
                </p>
              </div>
            </div>

            <Separator />

            {/* ── Service Flags ─────────────────────────────────── */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Service Flags</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-card">
                  <div>
                    <p className="text-sm font-medium">Serviceable</p>
                    <p className="text-xs text-muted-foreground">Enable delivery to this pincode</p>
                  </div>
                  <Switch
                    checked={formData.isServiceable}
                    onCheckedChange={(c) => handleChange("isServiceable", c)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl border border-orange-500/30 bg-orange-500/5">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-orange-700 dark:text-orange-400">ODA (Out of Delivery Area)</p>
                      <p className="text-xs text-muted-foreground">Extra charges / limited service</p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.isODA}
                    onCheckedChange={(c) => handleChange("isODA", c)}
                  />
                </div>
              </div>
            </div>

            {/* ── Optional Coordinates ──────────────────────────── */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground">GPS Coordinates (Optional)</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude" className="text-xs">Latitude</Label>
                  <Input
                    id="latitude"
                    placeholder="e.g. 19.0760"
                    value={formData.latitude}
                    onChange={(e) => handleChange("latitude", e.target.value)}
                    type="text"
                    inputMode="decimal"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude" className="text-xs">Longitude</Label>
                  <Input
                    id="longitude"
                    placeholder="e.g. 72.8777"
                    value={formData.longitude}
                    onChange={(e) => handleChange("longitude", e.target.value)}
                    type="text"
                    inputMode="decimal"
                  />
                </div>
              </div>
            </div>

          </form>
        </div>

        <SheetFooter className="flex-none border-t border-border/50 pt-4 bg-background">
          <div className="flex gap-2 w-full justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" form="pincode-form" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {pincode ? "Updating..." : "Adding..."}
                </>
              ) : (
                pincode ? "Update Pincode" : "Add Pincode"
              )}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default PincodeForm;
