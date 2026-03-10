"use client";

import { useState } from "react";
import { PerformanceHeader } from "./PerformanceHeader";
import { PerformanceStats } from "./PerformanceStats";
import { PerformanceFilters } from "./PerformanceFilters";
import { PerformanceTable } from "./PerformanceTable";
import { performanceData } from "./mockData";
import { ImportDialog } from "./ImportDialog";
import { ExportDialog } from "./ExportDialog";

const BranchPerformance = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all-types");
    const [statusFilter, setStatusFilter] = useState("all-status");
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);

    // Filter logic
    const filteredData = performanceData.filter((branch) => {
        const matchesSearch =
            branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            branch.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            branch.location.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType =
            typeFilter === "all-types" || branch.type === typeFilter;

        const matchesStatus =
            statusFilter === "all-status" || branch.status === statusFilter;

        return matchesSearch && matchesType && matchesStatus;
    });

    const handleClearFilters = () => {
        setSearchQuery("");
        setTypeFilter("all-types");
        setStatusFilter("all-status");
    };

    return (
        <div className="space-y-7">
            <PerformanceHeader
                onImport={() => setIsImportOpen(true)}
                onExport={() => setIsExportOpen(true)}
            />
            <PerformanceStats />
            <PerformanceFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                onClearFilters={handleClearFilters}
            />
            <PerformanceTable data={filteredData} />

            <ImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} />
            <ExportDialog open={isExportOpen} onOpenChange={setIsExportOpen} />
        </div>
    );
};

export default BranchPerformance;
