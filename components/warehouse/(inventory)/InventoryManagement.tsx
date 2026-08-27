"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { InventoryHeader } from "./InventoryHeader";
import { InventoryStats } from "./InventoryStats";
import { InventoryFilters } from "./InventoryFilters";
import { InventoryTable } from "./InventoryTable";
import { ImportDialog } from "./ImportDialog";
import { ExportDialog } from "./ExportDialog";
import { AddItemDialog } from "./AddItemDialog";
import { InventoryItem, InventoryStatsResponse } from "./types";
import { Loader2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const mapInventoryItem = (item: any): InventoryItem => {
    const qty = item.quantity ?? item.currentStock ?? 0;
    const reorder = item.reorderLevel ?? item.minStock ?? 0;
    const max = item.maxLevel ?? item.maxStock ?? 0;
    const cost = item.unitCost ?? item.unitPrice ?? 0;

    let status: InventoryItem["status"] = "in-stock";
    const backendStatus = (item.status || "").toUpperCase();
    if (backendStatus === "LOW_STOCK" || (qty > 0 && qty <= reorder)) status = "low-stock";
    else if (backendStatus === "OUT_OF_STOCK" || qty <= 0) status = "out-of-stock";
    else if (backendStatus === "IN_STOCK") status = "in-stock";

    return {
        ...item,
        _id: item._id,
        id: item._id || item.id,
        sku: item.skuCode || item.sku || "-",
        currentStock: qty,
        minStock: reorder,
        maxStock: max,
        unitPrice: cost,
        totalValue: item.totalValue ?? Number((qty * cost).toFixed(2)),
        status,
        lastUpdated: item.updatedAt ? new Date(item.updatedAt).toLocaleDateString("en-IN") : (item.lastUpdated || "-"),
        supplier: item.vendor || item.supplier || "-",
        location: item.storageLocation || item.warehouseName || item.location || "-",
    };
};

const InventoryManagement = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all-categories");
    const [statusFilter, setStatusFilter] = useState("all-status");
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [isAddItemOpen, setIsAddItemOpen] = useState(false);

    const [items, setItems] = useState<InventoryItem[]>([]);
    const [stats, setStats] = useState<InventoryStatsResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchItems = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const params: Record<string, string> = {};
            if (searchQuery) params.search = searchQuery;
            if (categoryFilter !== "all-categories") params.category = categoryFilter.toUpperCase();
            if (statusFilter !== "all-status") {
                const statusMap: Record<string, string> = {
                    "in-stock": "IN_STOCK",
                    "low-stock": "LOW_STOCK",
                    "out-of-stock": "OUT_OF_STOCK",
                };
                params.status = statusMap[statusFilter] || statusFilter.toUpperCase();
            }

            const { data } = await axios.get(`${API_BASE}/api/inventory`, {
                params,
                headers: { Authorization: `Bearer ${token}` },
            });
            const mapped = (Array.isArray(data) ? data : data.data || data.items || []).map(mapInventoryItem);
            setItems(mapped);
        } catch (error) {
            console.error("Failed to load inventory", error);
            toast.error("Failed to load inventory items");
        } finally {
            setLoading(false);
        }
    }, [searchQuery, categoryFilter, statusFilter]);

    const fetchStats = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${API_BASE}/api/inventory/stats`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStats(data);
        } catch (error) {
            console.error("Failed to load inventory stats", error);
        }
    }, []);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const handleClearFilters = () => {
        setSearchQuery("");
        setCategoryFilter("all-categories");
        setStatusFilter("all-status");
    };

    const handleItemSaved = () => {
        fetchItems();
        fetchStats();
    };

    return (
        <div className="space-y-7">
            <InventoryHeader
                onImport={() => setIsImportOpen(true)}
                onExport={() => setIsExportOpen(true)}
                onAddItem={() => setIsAddItemOpen(true)}
            />
            <InventoryStats stats={stats} items={items} />
            <InventoryFilters
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
                <InventoryTable data={items} />
            )}

            <AddItemDialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen} onSaved={handleItemSaved} />
            <ImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} onImported={handleItemSaved} />
            <ExportDialog open={isExportOpen} onOpenChange={setIsExportOpen} items={items} />
        </div>
    );
};

export default InventoryManagement;
