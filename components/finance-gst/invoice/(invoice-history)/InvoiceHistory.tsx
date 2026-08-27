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
import { FileText, Download, Upload, BarChart3, Search, X, MoreHorizontal, Eye, Send, CheckCircle, Clock, IndianRupee, TrendingUp, Loader2 } from "lucide-react";
import { ImportDialog } from "../../../warehouse/(inventory)/ImportDialog";
import { ExportDialog } from "../../../warehouse/(inventory)/ExportDialog";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

const STATUS_MAP: Record<string, string> = {
    DRAFT: "draft",
    ISSUED: "sent",
    PARTIALLY_PAID: "partial",
    PAID: "paid",
    OVERDUE: "overdue",
    CANCELLED: "cancelled",
};

const formatLakh = (amount: number) => {
    if (!amount) return "₹0";
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString("en-IN")}`;
};

const mapInvoice = (inv: any) => {
    const customer = inv.customerId && typeof inv.customerId === "object" ? inv.customerId : {};
    const lastPayment = inv.payments && inv.payments.length > 0 ? inv.payments[inv.payments.length - 1] : null;
    return {
        id: inv._id || inv.invoiceNo,
        customer: inv.customerName || customer.name || "Unknown",
        invoiceNo: inv.invoiceNo || "",
        amount: inv.subtotal || 0,
        gstAmount: inv.totalTax || 0,
        totalAmount: inv.grandTotal || 0,
        date: inv.invoiceDate ? new Date(inv.invoiceDate).toISOString().split("T")[0] : "",
        dueDate: inv.dueDate ? new Date(inv.dueDate).toISOString().split("T")[0] : "",
        status: STATUS_MAP[inv.status] || "draft",
        paymentDate: lastPayment?.paidDate ? new Date(lastPayment.paidDate).toISOString().split("T")[0] : null,
    };
};

const getStatusBadge = (status: string) => {
    switch (status) {
        case "paid": return <Badge variant="success" className="rounded-full">Paid</Badge>;
        case "sent": return <Badge variant="warning" className="rounded-full">Issued</Badge>;
        case "partial": return <Badge variant="warning" className="rounded-full">Partial</Badge>;
        case "overdue": return <Badge variant="error" className="rounded-full">Overdue</Badge>;
        case "cancelled": return <Badge variant="secondary" className="rounded-full">Cancelled</Badge>;
        default: return <Badge variant="secondary" className="rounded-full">Draft</Badge>;
    }
};

const InvoiceHistory = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all-status");
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchInvoices = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            const res = await axios.get(`${API_BASE}/api/invoices?limit=200`, { headers });
            const raw = res.data?.data || res.data || [];
            setInvoices(Array.isArray(raw) ? raw.map(mapInvoice) : []);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to fetch invoices");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchStats = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            const res = await axios.get(`${API_BASE}/api/invoices/stats`, { headers });
            setStats(res.data);
        } catch {
            // silent
        }
    }, []);

    useEffect(() => {
        fetchInvoices();
        fetchStats();
    }, [fetchInvoices, fetchStats]);

    const filteredData = invoices.filter((inv) => {
        const matchesSearch = inv.customer.toLowerCase().includes(searchQuery.toLowerCase()) || inv.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all-status" || inv.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const historyStats = [
        { title: "Total Invoices", value: stats?.total?.toString() || "0", icon: FileText, description: "All time" },
        { title: "Paid Invoices", value: stats?.paid?.toString() || "0", icon: CheckCircle, description: "Completed" },
        { title: "Pending Payment", value: ((stats?.issued || 0) + (stats?.partiallyPaid || 0) + (stats?.overdue || 0)).toString(), icon: Clock, description: "Awaiting" },
        { title: "Total Revenue", value: formatLakh(stats?.totalCollected || 0), icon: IndianRupee, description: "Collected" },
    ];

    return (
        <div className="space-y-7">
            <section className="rounded-3xl border border-border/70 bg-card/95 p-7 shadow-card">
                <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-5">
                    <div className="space-y-3">
                        <Badge className="rounded-full bg-primary/15 px-4 py-1 text-primary">Financial Management</Badge>
                        <div className="space-y-2">
                            <h1 className="text-display-1 leading-tight">Invoice History</h1>
                            <p className="max-w-2xl text-body">View complete invoice history. Track payments, pending invoices, and financial records.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1">
                                <FileText className="h-3.5 w-3.5 text-primary" />{stats?.total || 0} invoices
                            </span>
                            <span className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
                                <BarChart3 className="h-3.5 w-3.5 text-success" />{formatLakh(stats?.totalCollected || 0)} collected
                            </span>
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
                    </div>
                </div>
            </section>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {historyStats.map((stat, index) => (
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
                        <Input placeholder="Search invoices..." className="h-10 w-full rounded-xl bg-background/50 pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="h-10 w-[160px] rounded-xl">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-status">All Status</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="partial">Partially Paid</SelectItem>
                                <SelectItem value="sent">Issued</SelectItem>
                                <SelectItem value="overdue">Overdue</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
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
                    <CardTitle className="text-base font-semibold">Invoice History</CardTitle>
                    <p className="text-xs text-muted-foreground">Complete invoice records</p>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">Customer</TableHead>
                                    <TableHead>Invoice No</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>GST</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Invoice Date</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow><TableCell colSpan={9} className="h-24 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
                                ) : filteredData.length === 0 ? (
                                    <TableRow><TableCell colSpan={9} className="h-24 text-center">No invoices found.</TableCell></TableRow>
                                ) : (
                                    filteredData.map((inv) => (
                                        <TableRow key={inv.id} className="group hover:bg-muted/20">
                                            <TableCell><p className="font-semibold text-foreground">{inv.customer}</p></TableCell>
                                            <TableCell><span className="text-sm text-muted-foreground">{inv.invoiceNo}</span></TableCell>
                                            <TableCell><span className="font-medium">₹{inv.amount.toLocaleString("en-IN")}</span></TableCell>
                                            <TableCell><span className="text-sm">₹{inv.gstAmount.toLocaleString("en-IN")}</span></TableCell>
                                            <TableCell><span className="font-semibold text-foreground">₹{inv.totalAmount.toLocaleString("en-IN")}</span></TableCell>
                                            <TableCell><span className="text-sm">{inv.date ? new Date(inv.date).toLocaleDateString("en-IN") : "—"}</span></TableCell>
                                            <TableCell><span className="text-sm">{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString("en-IN") : "—"}</span></TableCell>
                                            <TableCell>{getStatusBadge(inv.status)}</TableCell>
                                            <TableCell>
                                                <div className="flex justify-end">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-lg"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-xl">
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg"><Eye className="h-4 w-4" />View Invoice</DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg"><Download className="h-4 w-4" />Download PDF</DropdownMenuItem>
                                                            {inv.status !== "paid" && inv.status !== "cancelled" && <DropdownMenuItem className="flex items-center gap-2 rounded-lg"><Send className="h-4 w-4" />Send Reminder</DropdownMenuItem>}
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

export default InvoiceHistory;
