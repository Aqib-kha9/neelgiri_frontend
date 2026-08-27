"use client";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { PartnerHeader } from "./PartnerHeader";
import { PartnerStats } from "./PartnerStats";
import { PartnerFilters } from "./PartnerFilters";
import { PartnerTable } from "./PartnerTable";
import { ImportDialog } from "../../warehouse/(inventory)/ImportDialog";
import { ExportDialog } from "../../warehouse/(inventory)/ExportDialog";
import { AddPartnerDialog } from "./AddPartnerDialog";
import { Partner, PartnerStat, mapBackendPartner } from "./types";

const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

const PartnerList = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all-types");
    const [statusFilter, setStatusFilter] = useState("all-status");
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [isAddPartnerOpen, setIsAddPartnerOpen] = useState(false);

    const [partners, setPartners] = useState<Partner[]>([]);
    const [stats, setStats] = useState<PartnerStat[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPartners = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            const [partnersRes, statsRes] = await Promise.all([
                axios.get(`${API_BASE}/api/partners`, { headers }),
                axios.get(`${API_BASE}/api/partners/stats`, { headers }),
            ]);

            const partnerList = Array.isArray(partnersRes.data)
                ? partnersRes.data
                : [];
            setPartners(partnerList.map(mapBackendPartner));

            // Build stats from the stats endpoint
            const s = statsRes.data || {};
            const computedStats: PartnerStat[] = [
                {
                    title: "Total Partners",
                    value: String(s.total ?? 0),
                    change: "",
                    trend: "neutral",
                    icon: (await import("lucide-react")).Users,
                    description: "All partners",
                },
                {
                    title: "Active Partners",
                    value: String(s.active ?? 0),
                    change: "",
                    trend: "up",
                    icon: (await import("lucide-react")).CheckCircle,
                    description: "Currently operating",
                },
                {
                    title: "Pending Approvals",
                    value: String(s.pending ?? 0),
                    change: "",
                    trend: "down",
                    icon: (await import("lucide-react")).Clock,
                    description: "Awaiting review",
                },
                {
                    title: "Total Revenue",
                    value: `₹${Number(s.totalRevenue ?? 0).toLocaleString("en-IN")}`,
                    change: "",
                    trend: "up",
                    icon: (await import("lucide-react")).IndianRupee,
                    description: "Cumulative revenue",
                },
            ];
            setStats(computedStats);
        } catch (error) {
            console.error("Failed to load partners", error);
            toast.error("Failed to load partners. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPartners();
    }, [fetchPartners]);

    // Filter logic
    const filteredData = partners.filter((partner) => {
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

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">
                    Loading partners...
                </span>
            </div>
        );
    }

    return (
        <div className="space-y-7">
            <PartnerHeader
                onImport={() => setIsImportOpen(true)}
                onExport={() => setIsExportOpen(true)}
                onAddPartner={() => setIsAddPartnerOpen(true)}
            />
            <PartnerStats stats={stats} />
            <PartnerFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                onClearFilters={handleClearFilters}
            />
            {filteredData.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    No partners found. Try adjusting your filters or add a new partner.
                </div>
            ) : (
                <PartnerTable data={filteredData} />
            )}

            <AddPartnerDialog
                open={isAddPartnerOpen}
                onOpenChange={setIsAddPartnerOpen}
                onPartnerAdded={fetchPartners}
            />
            <ImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} />
            <ExportDialog open={isExportOpen} onOpenChange={setIsExportOpen} />
        </div>
    );
};

export default PartnerList;
