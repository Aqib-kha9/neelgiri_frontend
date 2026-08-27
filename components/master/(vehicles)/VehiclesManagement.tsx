"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import VehiclesHeader from "./VehiclesHeader";
import VehiclesStats from "./VehiclesStats";
import VehiclesFilters from "./VehiclesFilters";
import VehiclesList from "./VehiclesList";
import VehicleForm from "./VehicleForm";
import { Vehicle, VehicleFormData } from "./types";

const VehiclesManagement = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [typeFilter, setTypeFilter] = useState("ALL");

    // Form State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchVehicles = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const params: Record<string, string> = {};
            if (searchTerm) params.search = searchTerm;
            if (statusFilter !== "ALL") params.status = statusFilter;
            if (typeFilter !== "ALL") params.type = typeFilter;

            const { data } = await axios.get("/api/vehicles", {
                params,
                headers: { Authorization: `Bearer ${token}` }
            });

            // Map MongoDB _id to id for frontend compatibility
            const mapped = (Array.isArray(data) ? data : data.data || []).map((v: any) => ({
                ...v,
                id: v._id || v.id,
            }));
            setVehicles(mapped);
        } catch (error) {
            console.error("Failed to load vehicles", error);
            toast.error("Failed to load vehicles");
        } finally {
            setLoading(false);
        }
    }, [searchTerm, statusFilter, typeFilter]);

    useEffect(() => {
        fetchVehicles();
    }, [fetchVehicles]);

    const handleAddVehicle = () => {
        setEditingVehicle(null);
        setIsFormOpen(true);
    };

    const handleEditVehicle = (vehicle: Vehicle) => {
        setEditingVehicle(vehicle);
        setIsFormOpen(true);
    };

    const handleDeleteVehicle = async (id: string) => {
        if (!confirm("Are you sure you want to delete this vehicle?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`/api/vehicles/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Vehicle deleted successfully");
            fetchVehicles();
        } catch (error) {
            console.error("Delete failed", error);
            toast.error("Failed to delete vehicle");
        }
    };

    const handleFormSubmit = async (formData: VehicleFormData) => {
        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            const payload = { ...formData };

            if (editingVehicle) {
                await axios.put(`/api/vehicles/${editingVehicle.id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("Vehicle updated successfully");
            } else {
                await axios.post("/api/vehicles", payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("Vehicle created successfully");
            }
            setIsFormOpen(false);
            fetchVehicles();
        } catch (error: any) {
            console.error("Form submit failed", error);
            toast.error(error?.response?.data?.message || "Failed to save vehicle");
        } finally {
            setSubmitting(false);
        }
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

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : (
                <VehiclesList
                    vehicles={vehicles}
                    onEdit={handleEditVehicle}
                    onDelete={handleDeleteVehicle}
                />
            )}

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
