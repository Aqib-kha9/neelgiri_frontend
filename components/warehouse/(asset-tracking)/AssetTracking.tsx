"use client";

import { useState } from "react";
import { AssetHeader } from "./AssetHeader";
import { AssetStats } from "./AssetStats";
import { AssetFilters } from "./AssetFilters";
import { AssetTable } from "./AssetTable";
import { assetData } from "./mockData";
import { ImportDialog } from "../(inventory)/ImportDialog";
import { ExportDialog } from "../(inventory)/ExportDialog";
import { AddAssetDialog } from "./AddAssetDialog";

const AssetTracking = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all-categories");
    const [statusFilter, setStatusFilter] = useState("all-status");
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);

    // Filter logic
    const filteredData = assetData.filter((asset) => {
        const matchesSearch =
            asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            asset.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            asset.location.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
            categoryFilter === "all-categories" || asset.category === categoryFilter;

        const matchesStatus =
            statusFilter === "all-status" || asset.status === statusFilter;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    const handleClearFilters = () => {
        setSearchQuery("");
        setCategoryFilter("all-categories");
        setStatusFilter("all-status");
    };

    return (
        <div className="space-y-7">
            <AssetHeader
                onImport={() => setIsImportOpen(true)}
                onExport={() => setIsExportOpen(true)}
                onAddAsset={() => setIsAddAssetOpen(true)}
            />
            <AssetStats />
            <AssetFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                onClearFilters={handleClearFilters}
            />
            <AssetTable data={filteredData} />

            <AddAssetDialog open={isAddAssetOpen} onOpenChange={setIsAddAssetOpen} />
            <ImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} />
            <ExportDialog open={isExportOpen} onOpenChange={setIsExportOpen} />
        </div>
    );
};

export default AssetTracking;
