"use client";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, IndianRupee, Wallet, TrendingDown, Users, Search, X, MoreHorizontal, Banknote } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

const formatLakh = (amount: number) => {
    if (!amount) return "₹0";
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString("en-IN")}`;
};

interface CODRecord {
    id: string;
    riderName: string;
    riderId: string;
    totalCODCollected: number;
    depositedAmount: number;
    pendingAmount: number;
    lastDepositDate: string;
    status: string;
    branch: string;
}

interface CODStats {
    totalCODCollected: number;
    totalDeposited: number;
    totalPending: number;
    activeRidersWithCash: number;
}

const CODManagement = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all-status");
    const [loading, setLoading] = useState(true);
    const [records, setRecords] = useState<CODRecord[]>([]);
    const [stats, setStats] = useState<CODStats>({ totalCODCollected: 0, totalDeposited: 0, totalPending: 0, activeRidersWithCash: 0 });
    const [depositTarget, setDepositTarget] = useState<CODRecord | null>(null);
    const [depositForm, setDepositForm] = useState({ amount: "", paymentMode: "CASH", referenceNo: "", notes: "" });
    const [submitting, setSubmitting] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            const res = await axios.get(`${API_BASE}/api/payments/cod`, { headers });
            const raw = res.data?.data || [];
            setRecords(raw);
            setStats(res.data?.stats || { totalCODCollected: 0, totalDeposited: 0, totalPending: 0, activeRidersWithCash: 0 });
        } catch (err: any) {
            console.error("Fetch COD error:", err);
            toast.error(err?.response?.data?.message || "Failed to load COD records");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!depositTarget) return;
        if (!depositForm.amount || parseFloat(depositForm.amount) <= 0) {
            toast.error("Please enter a valid deposit amount");
            return;
        }
        try {
            setSubmitting(true);
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            await axios.post(`${API_BASE}/api/payments/cod/${depositTarget.id}/deposit`, {
                amount: parseFloat(depositForm.amount),
                paymentMode: depositForm.paymentMode,
                referenceNo: depositForm.referenceNo,
                notes: depositForm.notes
            }, { headers });
            toast.success("COD deposit recorded successfully");
            setDepositTarget(null);
            setDepositForm({ amount: "", paymentMode: "CASH", referenceNo: "", notes: "" });
            fetchData();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to record deposit");
        } finally {
            setSubmitting(false);
        }
    };

    const filteredData = records.filter((record) => {
        const matchesSearch = record.riderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.riderId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all-status" || record.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const statCards = [
        { title: "Total COD Collected", value: stats.totalCODCollected, icon: IndianRupee, color: "text-primary", bg: "bg-primary/10", isAmount: true },
        { title: "Total Deposited", value: stats.totalDeposited, icon: Banknote, color: "text-success", bg: "bg-success/10", isAmount: true },
        { title: "Pending Deposit", value: stats.totalPending, icon: TrendingDown, color: "text-warning", bg: "bg-warning/10", isAmount: true },
        { title: "Riders With Cash", value: stats.activeRidersWithCash, icon: Users, color: "text-info", bg: "bg-info/10", isAmount: false },
    ];

    return (
        <div className="space-y-7">
            {/* Header Section */}
            <section className="rounded-3xl border border-border/70 bg-card/95 p-7 shadow-card">
                <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-5">
                    <div className="space-y-3">
                        <Badge className="rounded-full bg-primary/15 px-4 py-1 text-primary">Financial Management</Badge>
                        <div className="space-y-2">
                            <h1 className="text-display-1 leading-tight">COD Management</h1>
                            <p className="max-w-2xl text-body">Track Cash-on-Delivery amounts collected by riders and manage cash deposits.</p>
                        </div>
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
                                        {stat.isAmount ? formatLakh(stat.value) : (stat.value || 0).toLocaleString()}
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
                            placeholder="Search by rider name or ID..."
                            className="h-10 w-full rounded-xl bg-background/50 pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="h-10 w-[180px] rounded-xl">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-status">All Status</SelectItem>
                                <SelectItem value="fully_deposited">Fully Deposited</SelectItem>
                                <SelectItem value="partially_deposited">Partially Deposited</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
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

            {/* COD Table */}
            <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Rider ID</TableHead>
                                    <TableHead>Rider Name</TableHead>
                                    <TableHead>Branch</TableHead>
                                    <TableHead>Total COD</TableHead>
                                    <TableHead>Deposited</TableHead>
                                    <TableHead>Pending</TableHead>
                                    <TableHead>Last Deposit</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow><TableCell colSpan={9} className="h-24 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
                                ) : filteredData.length === 0 ? (
                                    <TableRow><TableCell colSpan={9} className="h-24 text-center text-muted-foreground">No COD records found.</TableCell></TableRow>
                                ) : (
                                    filteredData.map((record) => (
                                        <TableRow key={record.id} className="group hover:bg-muted/20">
                                            <TableCell><span className="font-mono text-xs">{record.riderId}</span></TableCell>
                                            <TableCell><p className="font-medium text-foreground">{record.riderName}</p></TableCell>
                                            <TableCell><span className="text-sm text-muted-foreground">{record.branch}</span></TableCell>
                                            <TableCell><span className="font-semibold">{formatLakh(record.totalCODCollected)}</span></TableCell>
                                            <TableCell><span className="text-success font-medium">{formatLakh(record.depositedAmount)}</span></TableCell>
                                            <TableCell><span className="text-warning font-medium">{formatLakh(record.pendingAmount)}</span></TableCell>
                                            <TableCell><span className="text-sm text-muted-foreground">{record.lastDepositDate || "—"}</span></TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    record.status === "fully_deposited" ? "success" :
                                                        record.status === "partially_deposited" ? "warning" : "secondary"
                                                } className="rounded-full capitalize">
                                                    {record.status.replace(/_/g, " ")}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="rounded-lg"><MoreHorizontal className="h-4 w-4" /></Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-xl">
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg cursor-pointer"
                                                                onClick={() => {
                                                                    setDepositTarget(record);
                                                                    setDepositForm({ ...depositForm, amount: String(record.pendingAmount || "") });
                                                                }}>
                                                                <Wallet className="h-4 w-4" /> Deposit Cash
                                                            </DropdownMenuItem>
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

            {/* Deposit Dialog */}
            <Dialog open={!!depositTarget} onOpenChange={(open) => { if (!open) setDepositTarget(null); }}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle>Deposit COD Cash</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleDeposit} className="space-y-4">
                        <div className="rounded-lg bg-muted/50 p-3 text-sm">
                            <p><span className="text-muted-foreground">Rider:</span> <span className="font-medium">{depositTarget?.riderName}</span></p>
                            <p><span className="text-muted-foreground">Pending Amount:</span> <span className="font-semibold text-warning">{formatLakh(depositTarget?.pendingAmount || 0)}</span></p>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="amount">Deposit Amount (₹)</Label>
                            <Input id="amount" type="number" step="0.01" placeholder="Enter amount" value={depositForm.amount}
                                onChange={(e) => setDepositForm({ ...depositForm, amount: e.target.value })} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="paymentMode">Payment Mode</Label>
                            <Select value={depositForm.paymentMode} onValueChange={(v) => setDepositForm({ ...depositForm, paymentMode: v })}>
                                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CASH">Cash</SelectItem>
                                    <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                                    <SelectItem value="UPI">UPI</SelectItem>
                                    <SelectItem value="CHEQUE">Cheque</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="referenceNo">Reference No.</Label>
                            <Input id="referenceNo" placeholder="UTR / Cheque No." value={depositForm.referenceNo}
                                onChange={(e) => setDepositForm({ ...depositForm, referenceNo: e.target.value })} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Input id="notes" placeholder="Optional notes" value={depositForm.notes}
                                onChange={(e) => setDepositForm({ ...depositForm, notes: e.target.value })} />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setDepositTarget(null)}>Cancel</Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Record Deposit
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CODManagement;
