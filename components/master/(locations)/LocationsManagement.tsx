// components/master/locations/LocationsManagement.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import LocationsHeader from "./LocationsHeader";
import LocationsStats from "./LocationsStats";
import LocationsFilters from "./LocationsFilters";
import LocationsList from "./LocationsList";
import LocationForm from "./LocationForm";
import { Location, LocationFormData, mapBackendLocation, mapLocationToBackend } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

const LocationsManagement = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${API_BASE}/api/locations`, { headers });
      const list = Array.isArray(res.data) ? res.data : [];
      setLocations(list.map(mapBackendLocation));
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Failed to load locations.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const handleAddLocation = () => {
    setSelectedLocation(null);
    setShowForm(true);
  };

  const handleEditLocation = (location: Location) => {
    setSelectedLocation(location);
    setShowForm(true);
  };

  const handleSaveLocation = async (formData: LocationFormData) => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const payload = mapLocationToBackend(formData);

      if (selectedLocation) {
        await axios.put(`${API_BASE}/api/locations/${selectedLocation.id}`, payload, { headers });
        toast.success("Location updated successfully!");
      } else {
        await axios.post(`${API_BASE}/api/locations`, payload, { headers });
        toast.success("Location created successfully!");
      }
      setShowForm(false);
      setSelectedLocation(null);
      fetchLocations();
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Failed to save location.";
      toast.error(msg);
    }
  };

  const handleDeleteLocation = async (locationId: string) => {
    if (!confirm("Are you sure you want to delete this location?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/api/locations/${locationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Location deleted.");
      fetchLocations();
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Failed to delete location.";
      toast.error(msg);
    }
  };

  const handleToggleStatus = async (locationId: string) => {
    const loc = locations.find((l) => l.id === locationId);
    if (!loc) return;
    const newStatus = loc.status === "active" ? "INACTIVE" : "ACTIVE";
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE}/api/locations/${locationId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Location status updated.");
      fetchLocations();
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Failed to update status.";
      toast.error(msg);
    }
  };

  const filteredLocations = locations.filter((location) => {
    const matchesSearch =
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.pincode.includes(searchTerm);

    const matchesType = typeFilter === "all" || location.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || location.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-7 p-6">
      <LocationsHeader
        onAddLocation={handleAddLocation}
        locationCount={locations.length}
      />

      <LocationsStats locations={locations} />

      <LocationsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <LocationsList
        locations={filteredLocations}
        onEditLocation={handleEditLocation}
        onDeleteLocation={handleDeleteLocation}
        onToggleStatus={handleToggleStatus}
      />

      {showForm && (
        <LocationForm
          location={selectedLocation}
          onSave={handleSaveLocation}
          onCancel={() => {
            setShowForm(false);
            setSelectedLocation(null);
          }}
        />
      )}
    </div>
  );
};

export default LocationsManagement;
