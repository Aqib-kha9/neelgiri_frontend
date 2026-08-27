// components/master/pincodes/PincodesManagement.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import PincodesHeader from "./PincodesHeader";
import PincodesFilters from "./PincodesFilters";
import PincodesList from "./PincodesList";
import PincodeForm from "./PincodeForm";
import PincodeBulkAction from "./PincodeBulkAction";
import BranchPincodeView from "./BranchPincodeView";
import { OperationalLocation, Pincode } from "./types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Roles that get the scoped branch view instead of the global admin view
const BRANCH_SCOPED_ROLES = ["branch_admin", "branch", "partner_admin", "partner"];

// ─────────────────────────────────────────────────────────
// Super Admin — Full Global Pincode Management View
// (Extracted into own component to avoid hooks-after-return)
// ─────────────────────────────────────────────────────────
const AdminPincodesView = () => {
  const { session } = useAuth();
  const [pincodes, setPincodes] = useState<Pincode[]>([]);
  const [loading, setLoading] = useState(true);
  const [bulkLoading, setBulkLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [mappingFilter, setMappingFilter] = useState("all");
  const [locationMappingFilter, setLocationMappingFilter] = useState("all");
  const [branchStatusFilter, setBranchStatusFilter] = useState("all");

  const [distinctStates, setDistinctStates] = useState<string[]>([]);
  const [distinctDistricts, setDistinctDistricts] = useState<string[]>([]);

  const [selectedPincodeIds, setSelectedPincodeIds] = useState<string[]>([]);
  const [selectedPincode, setSelectedPincode] = useState<Pincode | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [serviceLocations, setServiceLocations] = useState<OperationalLocation[]>([]);
  const [showLocationMapper, setShowLocationMapper] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState("__none__");
  const [mappingLocation, setMappingLocation] = useState(false);

  const fetchDistinctLocations = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("/api/pincodes/locations/distinct", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDistinctStates(data.states || []);
      setDistinctDistricts(data.districts || []);
    } catch (error) {
      console.error("Failed to fetch locations", error);
    }
  }, []);

  const fetchServiceLocations = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("/api/locations", {
        params: { status: "ACTIVE" },
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = Array.isArray(data) ? data : data.locations || [];
      setServiceLocations(list.filter((location: OperationalLocation) =>
        ["BRANCH", "DELIVERY_CENTER", "PICKUP_POINT"].includes(location.type)
      ));
    } catch (error) {
      console.error("Failed to fetch operational facilities", error);
    }
  }, []);

  const fetchPincodes = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = {
        page,
        limit: 50,
        search: searchTerm,
        state: stateFilter,
        district: districtFilter,
        isServiceable: statusFilter === "all" ? undefined : statusFilter === "true",
        mapping: mappingFilter === "all" ? undefined : mappingFilter,
        locationMapping: locationMappingFilter === "all" ? undefined : locationMappingFilter,
        isActiveForBranch: branchStatusFilter === "all" ? undefined : branchStatusFilter === "true"
      };

      const { data } = await axios.get("/api/pincodes", {
        params,
        headers: { Authorization: `Bearer ${token}` }
      });

      setPincodes(data.pincodes || []);
      setTotalPages(data.pages || 1);
      setTotalCount(data.total || 0);
    } catch (error) {
      toast.error("Failed to load pincodes");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, statusFilter, stateFilter, districtFilter, mappingFilter, locationMappingFilter, branchStatusFilter]);

  useEffect(() => { fetchPincodes(); }, [fetchPincodes]);
  useEffect(() => { fetchDistinctLocations(); }, [fetchDistinctLocations]);
  useEffect(() => { fetchServiceLocations(); }, [fetchServiceLocations]);

  const handleBulkUpdate = async (type: "state" | "district", value: string, isServiceable: boolean) => {
    setBulkLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/pincodes/bulk-update", {
        [type]: value,
        isServiceable,
        branchId: session?.user?.branchId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Bulk update successful for ${value}`);
      fetchPincodes();
    } catch {
      toast.error("Bulk update failed");
    } finally {
      setBulkLoading(false);
    }
  };

  const handleToggleStatus = async (id: string) => {
    const pincode = pincodes.find(p => p._id === id);
    if (!pincode) return;
    try {
      const token = localStorage.getItem("token");
      const newStatus = !pincode.isServiceable;
      await axios.put(`/api/pincodes/${id}`, {
        isServiceable: newStatus,
        // Only clear branch mapping if turning OFF. 
        // If turning ON, let it remain null (unmapped) by default unless it was already mapped.
        ...(newStatus === false ? { branchId: null } : {})
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPincodes();
    } catch {
      toast.error("Status update failed");
    }
  };

  const handleMapSelectedLocation = async () => {
    setMappingLocation(true);
    try {
      const token = localStorage.getItem("token");
      const locationId = selectedLocationId === "__none__" ? null : selectedLocationId;
      const { data } = await axios.post("/api/pincodes/bulk-map-location", {
        pincodeIds: selectedPincodeIds,
        locationId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(data.message || "Operational facility mapping updated");
      setSelectedPincodeIds([]);
      setShowLocationMapper(false);
      fetchPincodes();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to map operational facility");
    } finally {
      setMappingLocation(false);
    }
  };

  return (
    <div className="space-y-7 p-6">
      <PincodesHeader
        onAddPincode={() => setShowForm(true)}
        onBulkUpload={() => setShowBulkUpload(true)}
        pincodeCount={totalCount}
      />

      <PincodeBulkAction
        states={distinctStates}
        districts={distinctDistricts}
        onBulkUpdate={handleBulkUpdate}
        isLoading={bulkLoading}
      />

      <PincodesFilters
        searchTerm={searchTerm}
        onSearchChange={(val) => { setSearchTerm(val); setPage(1); }}
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => { setStatusFilter(val); setPage(1); }}
        stateFilter={stateFilter}
        onStateFilterChange={(val) => { setStateFilter(val); setPage(1); }}
        districtFilter={districtFilter}
        onDistrictFilterChange={(val) => { setDistrictFilter(val); setPage(1); }}
        mappingFilter={mappingFilter}
        onMappingFilterChange={(val) => { setMappingFilter(val); setPage(1); }}
        locationMappingFilter={locationMappingFilter}
        onLocationMappingFilterChange={(val) => { setLocationMappingFilter(val); setPage(1); }}
        branchStatusFilter={branchStatusFilter}
        onBranchStatusFilterChange={(val) => { setBranchStatusFilter(val); setPage(1); }}
        states={distinctStates}
        districts={distinctDistricts}
        onRefresh={fetchPincodes}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground animate-pulse">
          Fetching comprehensive pincode data...
        </div>
      ) : (
        <PincodesList
          pincodes={pincodes}
          selectedIds={selectedPincodeIds}
          onSelectId={(id) => setSelectedPincodeIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])}
          onSelectAll={(ids) => setSelectedPincodeIds(ids)}
          onEditPincode={(p) => { setSelectedPincode(p); setShowForm(true); }}
          onDeletePincode={async (id) => {
            if (confirm("Are you sure?")) {
              const token = localStorage.getItem("token");
              await axios.delete(`/api/pincodes/${id}`, { headers: { Authorization: `Bearer ${token}` } });
              fetchPincodes();
            }
          }}
          onToggleStatus={handleToggleStatus}
          onBulkDelete={() => { }}
          onMapSelectedLocation={() => setShowLocationMapper(true)}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalCount={totalCount}
        />
      )}

      {showForm && (
        <PincodeForm
          open={showForm}
          onOpenChange={(val) => {
            setShowForm(val);
            if (!val) setSelectedPincode(null);
          }}
          onSave={() => { fetchPincodes(); }}
          pincode={selectedPincode}
        />
      )}

      <Dialog open={showLocationMapper} onOpenChange={setShowLocationMapper}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Map Operational Facility</DialogTitle>
            <DialogDescription>
              Assign {selectedPincodeIds.length} selected pincode record(s) to the physical location responsible for pickup and delivery.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="bulkLocationId">Operational Facility</Label>
            <Select value={selectedLocationId} onValueChange={setSelectedLocationId}>
              <SelectTrigger id="bulkLocationId">
                <SelectValue placeholder="Select a facility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Remove Location Mapping</SelectItem>
                {serviceLocations.map((location) => (
                  <SelectItem key={location._id} value={location._id}>
                    {location.name} ({location.code}){location.address?.city ? ` · ${location.address.city}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {serviceLocations.length === 0 && (
              <p className="text-xs text-amber-600">Create an active Branch, Delivery Centre, or Pickup Point in Location Master first.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLocationMapper(false)} disabled={mappingLocation}>Cancel</Button>
            <Button onClick={handleMapSelectedLocation} disabled={mappingLocation || selectedPincodeIds.length === 0}>
              {mappingLocation ? "Mapping..." : selectedLocationId === "__none__" ? "Remove Mapping" : "Map Facility"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// PincodesManagement — Role Router
// Shows BranchPincodeView for branch/partner admins,
// AdminPincodesView for super_admin
// ─────────────────────────────────────────────────────────
const PincodesManagement = () => {
  const { session } = useAuth();

  // session.user.role is often just a string like "partner_admin" in this codebase
  // So we should check if it's a string, or fallback to checking .name if it's an object populated later
  const roleName = typeof session?.user?.role === 'string'
    ? session?.user?.role
    : (session?.user?.role as any)?.name || "";

  if (BRANCH_SCOPED_ROLES.includes(roleName)) {
    return <BranchPincodeView />;
  }

  return <AdminPincodesView />;
};

export default PincodesManagement;
