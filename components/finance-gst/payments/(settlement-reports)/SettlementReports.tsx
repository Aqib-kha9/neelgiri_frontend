"use client";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, ArrowUpRight, CheckCircle, Clock, AlertOctagon, Search, X, MoreHorizontal, FileText, Download, Upload, IndianRupee, Calendar } from "lucide-react";
import { ImportDialog } from "../../../warehouse/(inventory)/ImportDialog";
import { ExportDialog } from "../../../warehouse/(inventory)/ExportDialog";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

const formatLakh = (amount: number) => {
    if (!amount) return "₹0";
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString("en-IN")}`;
};

interface SettlementRecord {
    id: string;
    partnerName: string;
    partnerTechId: string;
    type: string;
    amount: number;
    period: string;
    status: string;
    processedDate: string;
    transactionRef: string;
}

interface SettlementStats {
    totalSettled: number;
    pendingSettlement: number;
    nextPayoutDate: string;
    processedThisMonth: number;
}

const SettlementReports = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all-status");
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [records, setRecords] = useState<SettlementRecord[]>([]);
    const [stats, setStats] = useState<SettlementStats>({ totalSettled: 0, pendingSettlement: 0, nextPayoutDate: "", processedThisMonth: 0 });
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [createForm, setCreateForm] = useState({ partnerName: "", partnerTechId: "", partnerType: "rider", amount: "", period: "", paymentMode: "BANK_TRANSFER", notes: "" });
    const [submitting, setSubmitting] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            const res = await axios.get(`${API_BASE}/api/payments/settlements`, { headers });
            const raw = res.data?.data || [];
            setRecords(raw);
            setStats(res.data?.stats || { totalSettled: 0, pendingSettlement: 0, nextPayoutDate: "", processedThisMonth: 0 });
        } catch (err: any) {
            console.error("Fetch settlements error:", err);
            toast.error(err?.response?.data?.message || "Failed to load settlement records");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!createForm.partnerName || !createForm.amount) {
            toast.error("Partner name and amount are required");
            return;
        }
        try {
            setSubmitting(true);
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            await axios.post(`${API_BASE}/api/payments/settlements`, {
                partnerName: createForm.partnerName,
                partnerTechId: createForm.partnerTechId,
                partnerType: createForm.partnerType,
                amount: parseFloat(createForm.amount),
                period: createForm.period,
                paymentMode: createForm.paymentMode,
                notes: createForm.notes
            }, { headers });
            toast.success("Settlement initiated successfully");
            setIsCreateOpen(false);
            setCreateForm({ partnerName: "", partnerTechId: "", partnerType: "rider", amount: "", period: "", paymentMode: "BANK_TRANSFER", notes: "" });
            fetchData();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to create settlement");
        } finally {
            setSubmitting(false);
        }
    };

    const handleProcess = async (id: string, status: string) => {
        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            await axios.put(`${API_BASE}/api/payments/settlements/${id}/process`, { status }, { headers });
            toast.success(`Settlement marked as ${status}`);
            fetchData();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to update settlement");
        }
    };

    const filteredData = records.filter((record) => {
        const matchesSearch = record.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.partnerTechId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all-status" || record.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const statCards = [
        { title: "Total Settled (YTD)", value: stats.totalSettled, icon: IndianRupee, color: "text-primary", bg: "bg-primary/10", isAmount: true },
        { title: "Pending Settlements", value: stats.pendingSettlement, icon: Clock, color: "text-warning", bg: "bg-warning/10", isAmount: true },
        { title: "Processed This Month", value: stats.processedThisMonth, icon: CheckCircle, color: "text-success", bg: "bg-success/10", isCount: true },
        { title: "Next Payout Date", value: stats.nextPayoutDate || "—", icon: Calendar, color: "text-info", bg: "bg-info/10", isCount: true },
    ];

    return (
        <div className="space-y-7">
            {/* Header Section */}
            <section className="rounded-3xl border border-border/70 bg-card/95 p-7 shadow-card">
                <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-5">
                    <div className="space-y-3">
                        <Badge className="rounded-full bg-primary/15 px-4 py-1 text-primary">Financial Management</Badge>
                        <div className="space-y-2">
                            <h1 className="text-display-1 leading-tight">Settlement Reports</h1>
                            <p className="max-w-2xl text-body">Manage payouts to riders, vendors, and partners. Track settlement history.</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                            <Button variant="outline" className="gap-2 rounded-lg border-border/70" onClick={() => setIsExportOpen(true)}>
                                <Download className="h-4 w-4" />Export
                            </Button>
                            <Button variant="outline" className="gap-2 rounded-lg border-border/70" onClick={() => setIsImportOpen(true)}>
                                <Upload className="h-4 w-4" />Import
                            </Button>
                        </div>
                        <Button className="gap-2 rounded-lg shadow-lg shadow-primary/20" onClick={() => setIsCreateOpen(true)}>
                            <ArrowUpRight className="h-4 w-4" /> Initiate Value Settlement
                        </Button>
                    </div>
                </div>
            </section>

            {/* Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, index) => (
                    <Card key={index} className="relative overflow-hidden rounded-2xl border-border/70 bg-card/95 shadow-card">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                    <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                                        {stat.isCount
                                            ? (typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value)
                                            : formatLakh(stat.value as number)
                                        }
                                    </div>
                                </div>
                                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
                                    <stat.icon className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <Card className="rounded-2xl border-border/70 bg-card/50 p-4 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by partner name or ID..."
                            className="h-10 w-full rounded-xl bg-background/50 pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="h-10 w-[160px] rounded-xl">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-status">All Status</SelectItem>
                                <SelectItem value="settled">Settled</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="hold">On Hold</SelectItem>
                            </SelectContent>
                        </Select>
                        {(searchQuery || statusFilter !== "all-status") && (
                            <Button variant="ghost" size="icon" onClick={() => { setSearchQuery(""); setStatusFilter("all-status"); }} className="h-10 w-10 rounded-xl">
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            {/* Collection Table */}
            <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Settlement History</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Partner ID</TableHead>
                                    <TableHead>Partner Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Period</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Processed Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow><TableCell colSpan={8} className="h-24 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
                                ) : filteredData.length === 0 ? (
                                    <TableRow><TableCell colSpan={8} className="h-24 text-center text-muted-foreground">No settlements found.</TableCell></TableRow>
                                ) : (
                                    filteredData.map((record) => (
                                        <TableRow key={record.id} className="group hover:bg-muted/20">
                                            <TableCell><span className="font-mono text-xs">{record.partnerTechId || "—"}</span></TableCell>
                                            <TableCell><p className="font-medium text-foreground">{record.partnerName}</p></TableCell>
                                            <TableCell><Badge variant="outline" className="capitalize">{record.type}</Badge></TableCell>
                                            <TableCell><span className="font-semibold">{formatLakh(record.amount)}</span></TableCell>
                                            <TableCell><span className="text-sm text-muted-foreground">{record.period || "—"}</span></TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    record.status === "settled" ? "success" :
                                                        record.status === "hold" ? "destructive" :
                                                            record.status === "processing" ? "warning" : "secondary"
                                                } className="rounded-full capitalize">
                                                    {record.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell><span className="text-sm">{record.processedDate || "—"}</span></TableCell>
                                            <TableCell>
                                                <div className="flex justify-end">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="rounded-lg"><MoreHorizontal className="h-4 w-4" /></Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-xl">
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg cursor-pointer">
                                                                <FileText className="h-4 w-4" /> View Statement
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg cursor-pointer">
                                                                <Download className="h-4 w-4" /> Download Receipt
                                                            </DropdownMenuItem>
                                                            {record.status === "pending" && (
                                                                <DropdownMenuItem className="flex items-center gap-2 rounded-lg cursor-pointer"
                                                                    onClick={() => handleProcess(record.id, "processing")}>
                                                                    <Clock className="h-4 w-4" /> Mark Processing
                                                                </DropdownMenuItem>
                                                            )}
                                                            {(record.status === "pending" || record.status === "processing") && (
                                                                <DropdownMenuItem className="flex items-center gap-2 rounded-lg cursor-pointer"
                                                                    onClick={() => handleProcess(record.id, "settled")}>
                                                                    <CheckCircle className="h-4 w-4" /> Mark Settled
                                                                </DropdownMenuItem>
                                                            )}
                                                            {(record.status === "pending" || record.status === "processing") && (
                                                                <DropdownMenuItem className="flex items-center gap-2 rounded-lg cursor-pointer"
                                                                    onClick={() => handleProcess(record.id, "hold")}>
                                                                    <AlertOctagon className="h-4 w-4" /> Put on Hold
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <ImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} />
            <ExportDialog open={isExportOpen} onOpenChange={setIsExportOpen} />

            {/* Create Settlement Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Initiate New Settlement</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="partnerName">Partner / Rider / Vendor Name *</Label>
                            <Input id="partnerName" placeholder="Enter name" value={createForm.partnerName}
                                onChange={(e) => setCreateForm({ ...createForm, partnerName: e.target.value })} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="partnerTechId">Partner ID</Label>
                                <Input id="partnerTechId" placeholder="e.g. R-101" value={createForm.partnerTechId}
                                    onChange={(e) => setCreateForm({ ...createForm, partnerTechId: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="partnerType">Type *</Label>
                                <Select value={createForm.partnerType} onValueChange={(v) => setCreateForm({ ...createForm, partnerType: v })}>
                                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="rider">Rider</SelectItem>
                                        <SelectItem value="vendor">Vendor</SelectItem>
                                        <SelectItem value="partner">Partner</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="amount">Amount (₹) *</Label>
                                <Input id="amount" type="number" step="0.01" placeholder="0.00" value={createForm.amount}
                                    onChange={(e) => setCreateForm({ ...createForm, amount: e.target.value })} required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="paymentMode">Payment Mode</Label>
                                <Select value={createForm.paymentMode} onValueChange={(v) => setCreateForm({ ...createForm, paymentMode: v })}>
                                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                                        <SelectItem value="UPI">UPI</SelectItem>
                                        <SelectItem value="CHEQUE">Cheque</SelectItem>
                                        <SelectItem value="CASH">Cash</SelectItem>
                                        <SelectItem value="ADJUSTMENT">Adjustment</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="period">Billing Period</Label>
                            <Input id="period" placeholder="e.g. Dec 1 - Dec 15" value={createForm.period}
                                onChange={(e) => setCreateForm({ ...createForm, period: e.target.value })} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Input id="notes" placeholder="Optional notes" value={createForm.notes}
                                onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })} />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Initiate Settlement
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SettlementReports;
