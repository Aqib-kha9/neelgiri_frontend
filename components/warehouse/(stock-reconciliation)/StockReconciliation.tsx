"use client";

import { useState } from "react";
import { ReconciliationHeader } from "./ReconciliationHeader";
import { ReconciliationStats } from "./ReconciliationStats";
import { ReconciliationFilters } from "./ReconciliationFilters";
import { ReconciliationTable } from "./ReconciliationTable";
import { reconciliationData } from "./mockData";
import { ImportDialog } from "../(inventory)/ImportDialog";
import { ExportDialog } from "../(inventory)/ExportDialog";
import { StartReconciliationDialog } from "./StartReconciliationDialog";

const StockReconciliation = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all-status");
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [isStartReconciliationOpen, setIsStartReconciliationOpen] = useState(false);

    // Filter logic
    const filteredData = reconciliationData.filter((record) => {
        const matchesSearch =
            record.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.sku.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
            statusFilter === "all-status" || record.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleClearFilters = () => {
        setSearchQuery("");
        setStatusFilter("all-status");
    };

    return (
        <div className="space-y-7">
            <ReconciliationHeader
                onImport={() => setIsImportOpen(true)}
                onExport={() => setIsExportOpen(true)}
                onStartReconciliation={() => setIsStartReconciliationOpen(true)}
            />
            <ReconciliationStats />
            <ReconciliationFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                onClearFilters={handleClearFilters}
            />
            <ReconciliationTable data={filteredData} />

            <StartReconciliationDialog open={isStartReconciliationOpen} onOpenChange={setIsStartReconciliationOpen} />
            <ImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} />
            <ExportDialog open={isExportOpen} onOpenChange={setIsExportOpen} />
        </div>
    );
};

export default StockReconciliation;
