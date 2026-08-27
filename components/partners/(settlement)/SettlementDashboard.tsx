"use client";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IndianRupee, Clock, CheckCircle, TrendingUp, BarChart3, Search, X, MoreHorizontal, Eye, Download, Upload, CreditCard, Loader2, RefreshCw } from "lucide-react";
import { ImportDialog } from "../../warehouse/(inventory)/ImportDialog";
import { ExportDialog } from "../../warehouse/(inventory)/ExportDialog";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

interface Settlement {
    id: string;
    invoiceNo: string;
    partnerName: string;
    period: string;
    amountDue: number;
    amountPaid: number;
    balanceDue: number;
    status: string;
    dueDate: string;
    paymentMethod: string;
}

interface SettlementStat {
    title: string;
    value: string;
    change: string;
    trend: "up" | "down";
    icon: any;
    description: string;
}

const mapInvoiceToSettlement = (inv: any): Settlement => {
    const periodStart = inv.billingPeriodStart ? new Date(inv.billingPeriodStart).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "";
    const periodEnd = inv.billingPeriodEnd ? new Date(inv.billingPeriodEnd).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";
    const period = periodStart || periodEnd ? `${periodStart} - ${periodEnd}` : new Date(inv.invoiceDate).toLocaleDateString("en-IN");

    const lastPayment = inv.payments && inv.payments.length > 0 ? inv.payments[inv.payments.length - 1] : null;
    const paymentMethod = lastPayment ? lastPayment.method?.replace(/_/g, " ") : "Bank Transfer";

    const statusMap: Record<string, string> = {
        DRAFT: "pending",
        ISSUED: "pending",
        PARTIALLY_PAID: "processing",
        PAID: "processed",
        OVERDUE: "pending",
        CANCELLED: "pending",
    };

    return {
        id: inv._id || inv.id || "",
        invoiceNo: inv.invoiceNo || "N/A",
        partnerName: inv.customerName || inv.customerId?.name || "Unknown",
        period,
        amountDue: inv.grandTotal || 0,
        amountPaid: inv.amountPaid || 0,
        balanceDue: inv.balanceDue || 0,
        status: statusMap[inv.status] || "pending",
        dueDate: inv.dueDate || inv.invoiceDate || new Date().toISOString(),
        paymentMethod,
    };
};

const SettlementDashboard = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all-status");
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [settlements, setSettlements] = useState<Settlement[]>([]);
    const [stats, setStats] = useState<SettlementStat[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            const [invoicesRes, statsRes] = await Promise.all([
                axios.get(`${API_BASE}/api/invoices?limit=100`, { headers }),
                axios.get(`${API_BASE}/api/invoices/stats`, { headers }),
            ]);

            const invoiceList = invoicesRes.data?.data || invoicesRes.data || [];
            setSettlements(Array.isArray(invoiceList) ? invoiceList.map(mapInvoiceToSettlement) : []);

            const s = statsRes.data || {};
            const computedStats: SettlementStat[] = [
                { title: "Pending Settlements", value: String((s.issued || 0) + (s.overdue || 0) + (s.partiallyPaid || 0)), change: "+8", trend: "down", icon: Clock, description: "Awaiting processing" },
                { title: "Processed Today", value: String(s.paid || 0), change: "+6", trend: "up", icon: CheckCircle, description: "Completed" },
                { title: "Total Amount", value: `₹${Number(s.totalBilled || 0).toLocaleString("en-IN")}`, change: "+12.5%", trend: "up", icon: IndianRupee, description: "Total billed" },
                { title: "Outstanding", value: `₹${Number(s.totalOutstanding || 0).toLocaleString("en-IN")}`, change: "-0.3", trend: "up", icon: TrendingUp, description: "Balance due" },
            ];
            setStats(computedStats);
        } catch (error) {
            toast.error("Failed to load settlement data. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredData = settlements.filter((settlement) => {
        const matchesSearch = settlement.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            settlement.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all-status" || settlement.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const formatCurrency = (val: number) => {
        if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
        if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
        return `₹${val}`;
    };

    return (
        <div className="space-y-7">
            <section className="rounded-3xl border border-border/70 bg-card/95 p-7 shadow-card">
                <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-5">
                    <div className="space-y-3">
                        <Badge className="rounded-full bg-primary/15 px-4 py-1 text-primary">Financial Operations</Badge>
                        <div className="space-y-2">
                            <h1 className="text-display-1 leading-tight">Settlement Dashboard</h1>
                            <p className="max-w-2xl text-body">Manage partner settlements and payments. Track pending amounts, process payments, and maintain financial records.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1">
                                <IndianRupee className="h-3.5 w-3.5 text-primary" />{stats[2]?.value || "₹0"} billed
                            </span>
                            <span className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
                                <BarChart3 className="h-3.5 w-3.5 text-success" />{stats[0]?.value || 0} pending
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                            <Button variant="outline" className="gap-2 rounded-lg border-border/70" onClick={fetchData} disabled={loading}>
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}Refresh
                            </Button>
                            <Button variant="outline" className="gap-2 rounded-lg border-border/70" onClick={() => setIsExportOpen(true)}>
                                <Download className="h-4 w-4" />Export
                            </Button>
                            <Button variant="outline" className="gap-2 rounded-lg border-border/70" onClick={() => setIsImportOpen(true)}>
                                <Upload className="h-4 w-4" />Import
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index} className="relative overflow-hidden rounded-2xl border-border/70 bg-card/95 shadow-card">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                    <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">{stat.value}</div>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <stat.icon className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${stat.trend === "up" ? "bg-success/15 text-success" : "bg-error/15 text-error"}`}>
                                    {stat.change}
                                </span>
                                <span className="text-xs text-muted-foreground">{stat.description}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="rounded-2xl border-border/70 bg-card/50 p-4 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="Search settlements..." className="h-10 w-full rounded-xl bg-background/50 pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="h-10 w-[160px] rounded-xl">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-status">All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="processed">Processed</SelectItem>
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

            <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Settlements</CardTitle>
                    <p className="text-xs text-muted-foreground">Partner payment settlements</p>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[250px]">Partner Name</TableHead>
                                    <TableHead>Invoice No</TableHead>
                                    <TableHead>Period</TableHead>
                                    <TableHead>Amount Due</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Payment Method</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow><TableCell colSpan={8} className="h-24 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" /></TableCell></TableRow>
                                ) : filteredData.length === 0 ? (
                                    <TableRow><TableCell colSpan={8} className="h-24 text-center">No settlements found.</TableCell></TableRow>
                                ) : (
                                    filteredData.map((settlement) => (
                                        <TableRow key={settlement.id} className="group hover:bg-muted/20">
                                            <TableCell><p className="font-semibold text-foreground">{settlement.partnerName}</p></TableCell>
                                            <TableCell><span className="text-sm font-mono">{settlement.invoiceNo}</span></TableCell>
                                            <TableCell><span className="text-sm">{settlement.period}</span></TableCell>
                                            <TableCell><span className="font-semibold text-foreground">{formatCurrency(settlement.amountDue)}</span></TableCell>
                                            <TableCell>
                                                <Badge variant={settlement.status === "processed" ? "success" : settlement.status === "processing" ? "warning" : "secondary"} className="rounded-full">
                                                    {settlement.status === "processed" ? "Processed" : settlement.status === "processing" ? "Processing" : "Pending"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell><span className="text-sm">{new Date(settlement.dueDate).toLocaleDateString("en-IN")}</span></TableCell>
                                            <TableCell><span className="text-sm capitalize">{settlement.paymentMethod.toLowerCase()}</span></TableCell>
                                            <TableCell>
                                                <div className="flex justify-end">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-lg"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-xl">
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg"><Eye className="h-4 w-4" />View Details</DropdownMenuItem>
                                                            {settlement.status === "pending" && <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-success"><CreditCard className="h-4 w-4" />Process Payment</DropdownMenuItem>}
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
        </div>
    );
};

export default SettlementDashboard;
