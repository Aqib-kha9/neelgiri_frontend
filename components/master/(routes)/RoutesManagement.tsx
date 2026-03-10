"use client";

import { useState } from "react";
import RoutesHeader from "./RoutesHeader";
import RoutesStats from "./RoutesStats";
import RoutesFilters from "./RoutesFilters";
import RoutesList from "./RoutesList";
import RouteForm from "./RouteForm";
import { Route, RouteFormData } from "./types";
import { mockRoutes } from "./mockData";

const RoutesManagement = () => {
    const [routes, setRoutes] = useState<Route[]>(mockRoutes);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [typeFilter, setTypeFilter] = useState("ALL");

    // Form State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingRoute, setEditingRoute] = useState<Route | null>(null);

    const filteredRoutes = routes.filter((r) => {
        const matchesSearch = r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.sourceCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.destinationCity.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
        const matchesType = typeFilter === "ALL" || r.type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
    });

    const handleAddRoute = () => {
        setEditingRoute(null);
        setIsFormOpen(true);
    };

    const handleEditRoute = (route: Route) => {
        setEditingRoute(route);
        setIsFormOpen(true);
    };

    const handleDeleteRoute = (id: string) => {
        if (confirm("Are you sure you want to delete this route?")) {
            setRoutes(prev => prev.filter(r => r.id !== id));
        }
    };

    const handleFormSubmit = (data: RouteFormData) => {
        // Auto-calculate totals from stops
        const totalDistanceKm = data.stops.reduce((acc, stop) => acc + (Number(stop.distanceFromPrevKm) || 0), 0);
        const totalMins = data.stops.reduce((acc, stop) => acc + (Number(stop.transitTimeFromPrevMins) || 0) + (Number(stop.haltTimeMins) || 0), 0);
        const totalTransitTimeHours = Math.round(totalMins / 60);

        if (editingRoute) {
            setRoutes(prev => prev.map(r => r.id === editingRoute.id ? {
                ...r,
                ...data,
                totalDistanceKm,
                totalTransitTimeHours
            } : r));
        } else {
            const newRoute: Route = {
                id: `R${Date.now()}`,
                ...data,
                totalDistanceKm,
                totalTransitTimeHours
            } as Route;
            setRoutes(prev => [newRoute, ...prev]);
        }
        setIsFormOpen(false);
    };

    return (
        <div className="space-y-7 p-6">
            <RoutesHeader
                count={routes.length}
                onAdd={handleAddRoute}
            />

            <RoutesStats routes={routes} />

            <RoutesFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                typeFilter={typeFilter}
                onTypeChange={setTypeFilter}
            />

            <RoutesList
                routes={filteredRoutes}
                onEdit={handleEditRoute}
                onDelete={handleDeleteRoute}
            />

            <RouteForm
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                onSave={handleFormSubmit}
                route={editingRoute}
            />
        </div>
    );
};

export default RoutesManagement;
