"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { AssetHeader } from "./AssetHeader";
import { AssetStats } from "./AssetStats";
import { AssetFilters } from "./AssetFilters";
import { AssetTable } from "./AssetTable";
import { ImportDialog } from "../(inventory)/ImportDialog";
import { ExportDialog } from "../(inventory)/ExportDialog";
import { AddAssetDialog } from "./AddAssetDialog";
import { Asset, AssetStatsResponse } from "./types";
import { Loader2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const mapAsset = (asset: any): Asset => {
    const backendStatus = (asset.status || "").toUpperCase();
    let status: Asset["status"] = "active";
    if (backendStatus === "MAINTENANCE") status = "maintenance";
    else if (backendStatus === "RETIRED" || backendStatus === "LOST") status = "retired";

    return {
        ...asset,
        _id: asset._id,
        id: asset._id || asset.id,
        assetId: asset.assetCode || asset.assetId || "-",
        category: asset.type || asset.category || "OTHER",
        location: asset.warehouseName || asset.storageLocation || asset.location || "-",
        purchaseDate: asset.purchaseDate ? new Date(asset.purchaseDate).toLocaleDateString("en-IN") : (asset.purchaseDate || "-"),
        purchaseValue: asset.purchasePrice ?? asset.purchaseValue ?? 0,
        currentValue: asset.currentValue ?? asset.purchasePrice ?? 0,
        status,
        assignedTo: asset.assignedToName || asset.assignedTo || "-",
        lastMaintenance: asset.lastMaintenance || "-",
        nextMaintenance: asset.nextMaintenance || asset.warrantyExpiry || "-",
    };
};

const AssetTracking = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all-categories");
    const [statusFilter, setStatusFilter] = useState("all-status");
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);

    const [assets, setAssets] = useState<Asset[]>([]);
    const [stats, setStats] = useState<AssetStatsResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchAssets = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const params: Record<string, string> = {};
            if (searchQuery) params.search = searchQuery;
            if (categoryFilter !== "all-categories") params.type = categoryFilter.toUpperCase();
            if (statusFilter !== "all-status") {
                const statusMap: Record<string, string> = {
                    "active": "ACTIVE",
                    "maintenance": "MAINTENANCE",
                    "retired": "RETIRED",
                };
                params.status = statusMap[statusFilter] || statusFilter.toUpperCase();
            }

            const { data } = await axios.get(`${API_BASE}/api/assets`, {
                params,
                headers: { Authorization: `Bearer ${token}` },
            });
            const mapped = (Array.isArray(data) ? data : data.data || data.assets || []).map(mapAsset);
            setAssets(mapped);
        } catch (error) {
            console.error("Failed to load assets", error);
            toast.error("Failed to load assets");
        } finally {
            setLoading(false);
        }
    }, [searchQuery, categoryFilter, statusFilter]);

    const fetchStats = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${API_BASE}/api/assets/stats`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStats(data);
        } catch (error) {
            console.error("Failed to load asset stats", error);
        }
    }, []);

    useEffect(() => {
        fetchAssets();
    }, [fetchAssets]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const handleClearFilters = () => {
        setSearchQuery("");
        setCategoryFilter("all-categories");
        setStatusFilter("all-status");
    };

    const handleAssetSaved = () => {
        fetchAssets();
        fetchStats();
    };

    return (
        <div className="space-y-7">
            <AssetHeader
                onImport={() => setIsImportOpen(true)}
                onExport={() => setIsExportOpen(true)}
                onAddAsset={() => setIsAddAssetOpen(true)}
            />
            <AssetStats stats={stats} assets={assets} />
            <AssetFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                onClearFilters={handleClearFilters}
            />
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <AssetTable data={assets} />
            )}

            <AddAssetDialog open={isAddAssetOpen} onOpenChange={setIsAddAssetOpen} onSaved={handleAssetSaved} />
            <ImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} onImported={handleAssetSaved} />
            <ExportDialog open={isExportOpen} onOpenChange={setIsExportOpen} items={assets} />
        </div>
    );
};

export default AssetTracking;
