// components/master/locations/LocationsManagement.tsx
"use client";

import { useState } from "react";
import LocationsHeader from "./LocationsHeader";
import LocationsStats from "./LocationsStats";
import LocationsFilters from "./LocationsFilters";
import LocationsList from "./LocationsList";
import LocationForm from "./LocationForm";
import { Location, LocationFormData } from "./types";
import { mockLocations } from "./mockData";

const LocationsManagement = () => {
  const [locations, setLocations] = useState<Location[]>(mockLocations);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleAddLocation = () => {
    setSelectedLocation(null);
    setShowForm(true);
  };

  const handleEditLocation = (location: Location) => {
    setSelectedLocation(location);
    setShowForm(true);
  };

  const handleSaveLocation = (formData: LocationFormData) => {
    if (selectedLocation) {
      // Update existing location
      setLocations(
        locations.map((l) =>
          l.id === selectedLocation.id ? { ...l, ...formData } : l
        )
      );
    } else {
      // Add new location
      const newLocation: Location = {
        id: `LOC-${Date.now()}`,
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setLocations([...locations, newLocation]);
    }
    setShowForm(false);
    setSelectedLocation(null);
  };

  const handleDeleteLocation = (locationId: string) => {
    setLocations(locations.filter((l) => l.id !== locationId));
  };

  const handleToggleStatus = (locationId: string) => {
    setLocations(
      locations.map((location) =>
        location.id === locationId
          ? {
            ...location,
            status: location.status === "active" ? "inactive" : "active",
          }
          : location
      )
    );
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
