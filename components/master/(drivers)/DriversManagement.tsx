"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import DriversHeader from "./DriversHeader";
import DriversStats from "./DriversStats";
import DriversFilters from "./DriversFilters";
import DriversList from "./DriversList";
import DriverForm from "./DriverForm";
import { Driver, DriverFormData } from "./types";

const DriversManagement = () => {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    // Form State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchDrivers = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const params: Record<string, string> = {};
            if (searchTerm) params.search = searchTerm;
            if (statusFilter !== "ALL") params.status = statusFilter;

            const { data } = await axios.get("/api/drivers", {
                params,
                headers: { Authorization: `Bearer ${token}` }
            });

            // Map MongoDB _id to id for frontend compatibility
            const mapped = (Array.isArray(data) ? data : data.data || []).map((d: any) => ({
                ...d,
                id: d._id || d.id,
            }));
            setDrivers(mapped);
        } catch (error) {
            console.error("Failed to load drivers", error);
            toast.error("Failed to load drivers");
        } finally {
            setLoading(false);
        }
    }, [searchTerm, statusFilter]);

    useEffect(() => {
        fetchDrivers();
    }, [fetchDrivers]);

    const handleAddDriver = () => {
        setEditingDriver(null);
        setIsFormOpen(true);
    };

    const handleEditDriver = (driver: Driver) => {
        setEditingDriver(driver);
        setIsFormOpen(true);
    };

    const handleDeleteDriver = async (id: string) => {
        if (!confirm("Are you sure you want to delete this driver?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`/api/drivers/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Driver deleted successfully");
            fetchDrivers();
        } catch (error) {
            console.error("Delete failed", error);
            toast.error("Failed to delete driver");
        }
    };

    const handleFormSubmit = async (formData: DriverFormData) => {
        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            const payload = { ...formData };

            if (editingDriver) {
                await axios.put(`/api/drivers/${editingDriver.id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("Driver updated successfully");
            } else {
                await axios.post("/api/drivers", payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("Driver created successfully");
            }
            setIsFormOpen(false);
            fetchDrivers();
        } catch (error: any) {
            console.error("Form submit failed", error);
            toast.error(error?.response?.data?.message || "Failed to save driver");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-7 p-6">
            <DriversHeader
                count={drivers.length}
                onAdd={handleAddDriver}
            />

            <DriversStats drivers={drivers} />

            <DriversFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
            />

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : (
                <DriversList
                    drivers={drivers}
                    onEdit={handleEditDriver}
                    onDelete={handleDeleteDriver}
                />
            )}

            <DriverForm
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                onSubmit={handleFormSubmit}
                initialData={editingDriver}
            />
        </div>
    );
};

export default DriversManagement;
