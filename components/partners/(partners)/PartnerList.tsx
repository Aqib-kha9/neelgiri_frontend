"use client";

import { useState } from "react";
import { PartnerHeader } from "./PartnerHeader";
import { PartnerStats } from "./PartnerStats";
import { PartnerFilters } from "./PartnerFilters";
import { PartnerTable } from "./PartnerTable";
import { partnerData } from "./mockData";
import { ImportDialog } from "../../warehouse/(inventory)/ImportDialog";
import { ExportDialog } from "../../warehouse/(inventory)/ExportDialog";
import { AddPartnerDialog } from "./AddPartnerDialog";

const PartnerList = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all-types");
    const [statusFilter, setStatusFilter] = useState("all-status");
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [isAddPartnerOpen, setIsAddPartnerOpen] = useState(false);

    // Filter logic
    const filteredData = partnerData.filter((partner) => {
        const matchesSearch =
            partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            partner.partnerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            partner.location.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType =
            typeFilter === "all-types" || partner.type === typeFilter;

        const matchesStatus =
            statusFilter === "all-status" || partner.status === statusFilter;

        return matchesSearch && matchesType && matchesStatus;
    });

    const handleClearFilters = () => {
        setSearchQuery("");
        setTypeFilter("all-types");
        setStatusFilter("all-status");
    };

    return (
        <div className="space-y-7">
            <PartnerHeader
                onImport={() => setIsImportOpen(true)}
                onExport={() => setIsExportOpen(true)}
                onAddPartner={() => setIsAddPartnerOpen(true)}
            />
            <PartnerStats />
            <PartnerFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                onClearFilters={handleClearFilters}
            />
            <PartnerTable data={filteredData} />

            <AddPartnerDialog open={isAddPartnerOpen} onOpenChange={setIsAddPartnerOpen} />
            <ImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} />
            <ExportDialog open={isExportOpen} onOpenChange={setIsExportOpen} />
        </div>
    );
};

export default PartnerList;
