"use client";

import { useState } from "react";
import VehiclesHeader from "./VehiclesHeader";
import VehiclesStats from "./VehiclesStats";
import VehiclesFilters from "./VehiclesFilters";
import VehiclesList from "./VehiclesList";
import VehicleForm from "./VehicleForm"; // Import the form
import { Vehicle, VehicleFormData } from "./types";
import { mockVehicles } from "./mockData";

const VehiclesManagement = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [typeFilter, setTypeFilter] = useState("ALL");

    // Form State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

    const filteredVehicles = vehicles.filter((v) => {
        const matchesSearch = v.regNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.driverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.make.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || v.status === statusFilter;
        const matchesType = typeFilter === "ALL" || v.type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
    });

    const handleAddVehicle = () => {
        setEditingVehicle(null);
        setIsFormOpen(true);
    };

    const handleEditVehicle = (vehicle: Vehicle) => {
        setEditingVehicle(vehicle);
        setIsFormOpen(true);
    };

    const handleDeleteVehicle = (id: string) => {
        if (confirm("Are you sure you want to delete this vehicle?")) {
            setVehicles(prev => prev.filter(v => v.id !== id));
        }
    };

    const handleFormSubmit = (data: VehicleFormData) => {
        if (editingVehicle) {
            // Update existing
            setVehicles(prev => prev.map(v => v.id === editingVehicle.id ? { ...v, ...data } : v));
        } else {
            // Add new
            const newVehicle: Vehicle = {
                id: `V${Date.now()}`, // Simple ID generation
                ...data
            } as Vehicle; // Type assertion since form data matches
            setVehicles(prev => [newVehicle, ...prev]);
        }
        setIsFormOpen(false);
    };

    return (
        <div className="space-y-7 p-6">
            <VehiclesHeader
                count={vehicles.length}
                onAdd={handleAddVehicle}
            />

            <VehiclesStats vehicles={vehicles} />

            <VehiclesFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                typeFilter={typeFilter}
                onTypeChange={setTypeFilter}
            />

            <VehiclesList
                vehicles={filteredVehicles}
                onEdit={handleEditVehicle}
                onDelete={handleDeleteVehicle}
            />

            <VehicleForm
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                onSubmit={handleFormSubmit}
                initialData={editingVehicle}
            />
        </div>
    );
};

export default VehiclesManagement;
