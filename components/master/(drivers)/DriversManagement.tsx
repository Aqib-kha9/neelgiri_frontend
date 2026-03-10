"use client";

import { useState } from "react";
import DriversHeader from "./DriversHeader";
import DriversStats from "./DriversStats";
import DriversFilters from "./DriversFilters";
import DriversList from "./DriversList";
import DriverForm from "./DriverForm";
import { Driver, DriverFormData } from "./types";
import { mockDrivers } from "./mockData";

const DriversManagement = () => {
    const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    // Form State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

    const filteredDrivers = drivers.filter((d) => {
        const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.phone.includes(searchTerm);
        const matchesStatus = statusFilter === "ALL" || d.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleAddDriver = () => {
        setEditingDriver(null);
        setIsFormOpen(true);
    };

    const handleEditDriver = (driver: Driver) => {
        setEditingDriver(driver);
        setIsFormOpen(true);
    };

    const handleDeleteDriver = (id: string) => {
        if (confirm("Are you sure you want to delete this driver?")) {
            setDrivers(prev => prev.filter(d => d.id !== id));
        }
    };

    const handleFormSubmit = (data: DriverFormData) => {
        if (editingDriver) {
            // Update existing
            setDrivers(prev => prev.map(d => d.id === editingDriver.id ? { ...d, ...data } : d));
        } else {
            // Add new
            const newDriver: Driver = {
                id: `D${Date.now()}`,
                code: `DRV-${Math.floor(Math.random() * 1000)}`, // Simple code generation
                ...data
            } as Driver;
            setDrivers(prev => [newDriver, ...prev]);
        }
        setIsFormOpen(false);
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

            <DriversList
                drivers={filteredDrivers}
                onEdit={handleEditDriver}
                onDelete={handleDeleteDriver}
            />

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
