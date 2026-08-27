"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import RoutesHeader from "./RoutesHeader";
import RoutesStats from "./RoutesStats";
import RoutesFilters from "./RoutesFilters";
import RoutesList from "./RoutesList";
import RouteForm from "./RouteForm";
import { Route, RouteFormData } from "./types";
import { Loader2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const mapRoute = (route: any): Route => {
    const sourceHub = typeof route.sourceHub === "object" ? route.sourceHub : null;
    const destinationHub = typeof route.destinationHub === "object" ? route.destinationHub : null;

    return {
        ...route,
        _id: route._id,
        id: route._id || route.id,
        code: route.code || "-",
        name: route.name || "",
        sourceCity: route.sourceCity || sourceHub?.name || "-",
        destinationCity: route.destinationCity || destinationHub?.name || "-",
        sourceHub: route.sourceHub?._id || route.sourceHub || "",
        sourceHubName: sourceHub?.name || route.sourceHubName || "",
        destinationHub: route.destinationHub?._id || route.destinationHub || "",
        destinationHubName: destinationHub?.name || route.destinationHubName || "",
        totalDistanceKm: route.totalDistanceKm || 0,
        totalTransitTimeHours: route.totalTransitTimeHours || 0,
        finalLegDistanceKm: route.finalLegDistanceKm || 0,
        finalLegTransitTimeMins: route.finalLegTransitTimeMins || 0,
        stops: (route.stops || []).map((s: any, idx: number) => ({
            ...s,
            id: s._id || s.id || `stop-${idx}`,
            hubId: typeof s.hubId === "object" ? s.hubId?._id : s.hubId,
            hubName: typeof s.hubId === "object" ? s.hubId?.name : s.hubName,
        })),
        schedule: route.schedule || [],
        departureTime: route.departureTime || "",
        status: route.status || "ACTIVE",
        type: route.type || "LINEHAUL",
        isReturnRoute: route.isReturnRoute || false,
        returnRouteId: route.returnRouteId || undefined,
        baseCost: route.baseCost || 0,
        vehicleTypeRequired: route.vehicleTypeRequired || undefined,
    };
};

const RoutesManagement = () => {
    const [routes, setRoutes] = useState<Route[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [typeFilter, setTypeFilter] = useState("ALL");

    // Form State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingRoute, setEditingRoute] = useState<Route | null>(null);

    const fetchRoutes = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const params: Record<string, string> = {};
            if (searchTerm) params.search = searchTerm;
            if (statusFilter !== "ALL") params.status = statusFilter;
            if (typeFilter !== "ALL") params.type = typeFilter;

            const { data } = await axios.get(`${API_BASE}/api/routes`, {
                params,
                headers: { Authorization: `Bearer ${token}` },
            });
            const mapped = (Array.isArray(data) ? data : data.data || data.routes || []).map(mapRoute);
            setRoutes(mapped);
        } catch (error) {
            console.error("Failed to load routes", error);
            toast.error("Failed to load routes");
        } finally {
            setLoading(false);
        }
    }, [searchTerm, statusFilter, typeFilter]);

    useEffect(() => {
        fetchRoutes();
    }, [fetchRoutes]);

    const handleAddRoute = () => {
        setEditingRoute(null);
        setIsFormOpen(true);
    };

    const handleEditRoute = (route: Route) => {
        setEditingRoute(route);
        setIsFormOpen(true);
    };

    const handleDeleteRoute = async (id: string) => {
        if (!confirm("Are you sure you want to delete this route?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_BASE}/api/routes/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Route deleted successfully");
            fetchRoutes();
        } catch (error) {
            console.error("Failed to delete route", error);
            toast.error("Failed to delete route");
        }
    };

    const handleFormSubmit = async (data: RouteFormData) => {
        const intermediateDistance = data.stops.reduce((acc, stop) => acc + (Number(stop.distanceFromPrevKm) || 0), 0);
        const intermediateMins = data.stops.reduce((acc, stop) => acc + (Number(stop.transitTimeFromPrevMins) || 0) + (Number(stop.haltTimeMins) || 0), 0);
        const totalDistanceKm = intermediateDistance + (Number(data.finalLegDistanceKm) || 0);
        const totalTransitTimeHours = Math.round(((intermediateMins + (Number(data.finalLegTransitTimeMins) || 0)) / 60) * 100) / 100;

        const payload = { ...data, totalDistanceKm, totalTransitTimeHours };

        try {
            const token = localStorage.getItem("token");
            if (editingRoute) {
                await axios.put(`${API_BASE}/api/routes/${editingRoute._id || editingRoute.id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success("Route updated successfully");
            } else {
                await axios.post(`${API_BASE}/api/routes`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success("Route created successfully");
            }
            setIsFormOpen(false);
            fetchRoutes();
        } catch (error: any) {
            console.error("Failed to save route", error);
            toast.error(error?.response?.data?.message || "Failed to save route");
            throw error;
        }
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

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <RoutesList
                    routes={routes}
                    onEdit={handleEditRoute}
                    onDelete={handleDeleteRoute}
                />
            )}

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
