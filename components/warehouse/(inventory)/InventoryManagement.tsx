"use client";

import { useState } from "react";
import { InventoryHeader } from "./InventoryHeader";
import { InventoryStats } from "./InventoryStats";
import { InventoryFilters } from "./InventoryFilters";
import { InventoryTable } from "./InventoryTable";
import { inventoryData } from "./mockData";
import { ImportDialog } from "./ImportDialog";
import { ExportDialog } from "./ExportDialog";
import { AddItemDialog } from "./AddItemDialog";

const InventoryManagement = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all-categories");
    const [statusFilter, setStatusFilter] = useState("all-status");
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [isAddItemOpen, setIsAddItemOpen] = useState(false);

    // Filter logic
    const filteredData = inventoryData.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.location.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
            categoryFilter === "all-categories" || item.category === categoryFilter;

        const matchesStatus =
            statusFilter === "all-status" || item.status === statusFilter;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    const handleClearFilters = () => {
        setSearchQuery("");
        setCategoryFilter("all-categories");
        setStatusFilter("all-status");
    };

    return (
        <div className="space-y-7">
            <InventoryHeader
                onImport={() => setIsImportOpen(true)}
                onExport={() => setIsExportOpen(true)}
                onAddItem={() => setIsAddItemOpen(true)}
            />
            <InventoryStats />
            <InventoryFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                onClearFilters={handleClearFilters}
            />
            <InventoryTable data={filteredData} />

            <AddItemDialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen} />
            <ImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} />
            <ExportDialog open={isExportOpen} onOpenChange={setIsExportOpen} />
        </div>
    );
};

export default InventoryManagement;
