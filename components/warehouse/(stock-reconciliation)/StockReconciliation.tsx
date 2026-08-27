"use client";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { Loader2, AlertCircle, Package, CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { ReconciliationHeader } from "./ReconciliationHeader";
import { ReconciliationStats } from "./ReconciliationStats";
import { ReconciliationFilters } from "./ReconciliationFilters";
import { ReconciliationTable } from "./ReconciliationTable";
import { ImportDialog } from "../(inventory)/ImportDialog";
import { ExportDialog } from "../(inventory)/ExportDialog";
import { StartReconciliationDialog } from "./StartReconciliationDialog";
import { ReconciliationRecord, ReconciliationStat } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

const mapRecord = (r: any): ReconciliationRecord => ({
    id: r._id || r.reconciliationId,
    itemName: r.itemName || "",
    sku: r.sku || "",
    category: r.category || "GENERAL",
    expectedQty: r.expectedQty ?? 0,
    actualQty: r.actualQty ?? 0,
    variance: r.variance ?? 0,
    variancePercent: r.variancePercent ?? 0,
    status: r.status || "pending",
    reconciledBy: r.reconciledBy || "—",
    reconciledDate: r.reconciledDate ? new Date(r.reconciledDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—",
    location: r.location || "—",
    notes: r.notes || "",
});

const StockReconciliation = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all-status");
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [isStartReconciliationOpen, setIsStartReconciliationOpen] = useState(false);

    const [records, setRecords] = useState<ReconciliationRecord[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [listRes, statsRes] = await Promise.all([
                axios.get(`${API_BASE}/api/reconciliations`, { headers }),
                axios.get(`${API_BASE}/api/reconciliations/stats`, { headers }),
            ]);
            const raw = listRes.data?.data || [];
            setRecords(raw.map(mapRecord));
            setStats(statsRes.data);
        } catch (err: any) {
            const msg = err?.response?.data?.message || "Failed to load reconciliation data";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Compute stats cards dynamically
    const statCards: ReconciliationStat[] = stats ? [
        {
            title: "Total Reconciliations",
            value: String(stats.total || 0),
            change: `${stats.resolutionRate || 0}% resolved`,
            trend: "neutral" as const,
            icon: Package,
            description: "All-time records",
        },
        {
            title: "Pending",
            value: String(stats.pending || 0),
            change: "Awaiting count",
            trend: "neutral" as const,
            icon: AlertCircle,
            description: "Not yet started",
        },
        {
            title: "Discrepancies Found",
            value: String(stats.discrepancy || 0),
            change: `${stats.inProgress || 0} in progress`,
            trend: stats.discrepancy > 0 ? "up" as const : "neutral" as const,
            icon: AlertTriangle,
            description: "Variance detected",
        },
        {
            title: "Resolved",
            value: String(stats.resolved || 0),
            change: `${stats.totalVariance || 0} units variance`,
            trend: "up" as const,
            icon: CheckCircle2,
            description: "Successfully closed",
        },
    ] : [];

    // Filter logic
    const filteredData = records.filter((record) => {
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

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <AlertCircle className="h-10 w-10 text-destructive" />
                    <p className="text-destructive font-medium">{error}</p>
                    <button onClick={fetchData} className="text-sm text-primary hover:underline">Retry</button>
                </div>
            ) : (
                <>
                    {stats && (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {statCards.map((stat, index) => (
                                <div
                                    key={index}
                                    className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/95 shadow-card transition-all hover:shadow-lg p-6"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                            <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">{stat.value}</div>
                                        </div>
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.title === "Discrepancies Found" ? "bg-error/10 text-error" : stat.title === "Resolved" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"}`}>
                                            <stat.icon className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2">
                                        <span className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${stat.trend === "up" ? "bg-success/15 text-success" : stat.trend === "down" ? "bg-error/15 text-error" : "bg-muted text-muted-foreground"}`}>
                                            {stat.change}
                                        </span>
                                        <span className="text-xs text-muted-foreground">{stat.description}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <ReconciliationFilters
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        onClearFilters={handleClearFilters}
                    />
                    <ReconciliationTable data={filteredData} />
                </>
            )}

            <StartReconciliationDialog open={isStartReconciliationOpen} onOpenChange={setIsStartReconciliationOpen} onSuccess={fetchData} />
            <ImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} />
            <ExportDialog open={isExportOpen} onOpenChange={setIsExportOpen} />
        </div>
    );
};

export default StockReconciliation;
