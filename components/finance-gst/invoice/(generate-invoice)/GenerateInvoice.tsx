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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FileText, Plus, Download, Upload, BarChart3, Search, X, MoreHorizontal, Eye, Send, CheckCircle, Clock, IndianRupee, TrendingUp, Loader2 } from "lucide-react";
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
    return {
        id: inv._id || inv.invoiceNo,
        customer: inv.customerName || customer.name || "Unknown",
        invoiceNo: inv.invoiceNo || "",
        amount: inv.subtotal || 0,
        gstAmount: inv.totalTax || 0,
        totalAmount: inv.grandTotal || 0,
        date: inv.invoiceDate ? new Date(inv.invoiceDate).toISOString().split("T")[0] : "",
        status: STATUS_MAP[inv.status] || "draft",
        rawStatus: inv.status || "DRAFT",
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

const GenerateInvoice = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all-status");
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [isGenerateOpen, setIsGenerateOpen] = useState(false);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [customers, setCustomers] = useState<any[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [genForm, setGenForm] = useState({ customerId: "", invoiceDate: "", dueDate: "", items: "", amount: "", gstRate: "18", notes: "" });

    const fetchInvoices = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            const res = await axios.get(`${API_BASE}/api/invoices?limit=50`, { headers });
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
            // silent fail for stats
        }
    }, []);

    const fetchCustomers = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            const res = await axios.get(`${API_BASE}/api/customers`, { headers });
            const raw = res.data?.data || res.data || [];
            setCustomers(Array.isArray(raw) ? raw : []);
        } catch {
            // silent
        }
    }, []);

    useEffect(() => {
        fetchInvoices();
        fetchStats();
        fetchCustomers();
    }, [fetchInvoices, fetchStats, fetchCustomers]);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!genForm.customerId) { toast.error("Please select a customer"); return; }
        if (!genForm.amount || parseFloat(genForm.amount) <= 0) { toast.error("Please enter a valid amount"); return; }
        try {
            setSubmitting(true);
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            const amount = parseFloat(genForm.amount) || 0;
            const gstRate = parseFloat(genForm.gstRate) || 0;
            const taxAmount = Math.round((amount * gstRate) / 100);
            const customer = customers.find((c) => c._id === genForm.customerId) || {};
            await axios.post(`${API_BASE}/api/invoices`, {
                customerId: genForm.customerId,
                customerName: customer.name,
                customerCode: customer.code,
                invoiceDate: genForm.invoiceDate || new Date().toISOString().split("T")[0],
                dueDate: genForm.dueDate,
                lineItems: [{
                    description: genForm.items || "Freight charges",
                    baseFreight: amount,
                    taxAmount,
                    totalAmount: amount + taxAmount,
                }],
                taxBreakup: gstRate > 0 ? [{ taxName: "GST", rate: gstRate, amount: taxAmount }] : [],
                notes: genForm.notes,
            }, { headers });
            toast.success("Invoice generated successfully");
            setIsGenerateOpen(false);
            setGenForm({ customerId: "", invoiceDate: "", dueDate: "", items: "", amount: "", gstRate: "18", notes: "" });
            fetchInvoices();
            fetchStats();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to generate invoice");
        } finally {
            setSubmitting(false);
        }
    };

    const handleIssue = async (id: string) => {
        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            await axios.put(`${API_BASE}/api/invoices/${id}/issue`, {}, { headers });
            toast.success("Invoice issued successfully");
            fetchInvoices();
            fetchStats();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to issue invoice");
        }
    };

    const filteredData = invoices.filter((inv) => {
        const matchesSearch = inv.customer.toLowerCase().includes(searchQuery.toLowerCase()) || inv.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all-status" || inv.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const invoiceStats = [
        { title: "Total Invoices", value: stats?.total?.toString() || "0", change: "", trend: "up" as const, icon: FileText, description: "All invoices" },
        { title: "Draft", value: stats?.draft?.toString() || "0", change: "", trend: "down" as const, icon: Clock, description: "Awaiting issue" },
        { title: "Issued", value: stats?.issued?.toString() || "0", change: "", trend: "up" as const, icon: Send, description: "Sent to customer" },
        { title: "Total Billed", value: formatLakh(stats?.totalBilled || 0), change: "", trend: "up" as const, icon: IndianRupee, description: "Total value" },
    ];

    return (
        <div className="space-y-7">
            <section className="rounded-3xl border border-border/70 bg-card/95 p-7 shadow-card">
                <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-5">
                    <div className="space-y-3">
                        <Badge className="rounded-full bg-primary/15 px-4 py-1 text-primary">Financial Management</Badge>
                        <div className="space-y-2">
                            <h1 className="text-display-1 leading-tight">Generate Invoice</h1>
                            <p className="max-w-2xl text-body">Create and manage GST-compliant invoices. Generate professional invoices with automatic tax calculations.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1">
                                <FileText className="h-3.5 w-3.5 text-primary" />{stats?.total || 0} total
                            </span>
                            <span className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
                                <BarChart3 className="h-3.5 w-3.5 text-success" />{formatLakh(stats?.totalBilled || 0)} billed
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                            <Button className="gap-2 rounded-lg bg-primary text-primary-foreground shadow-brand" onClick={() => setIsGenerateOpen(true)}>
                                <Plus className="h-4 w-4" />Generate Invoice
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
                {invoiceStats.map((stat, index) => (
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
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="sent">Issued</SelectItem>
                                <SelectItem value="partial">Partially Paid</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="overdue">Overdue</SelectItem>
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
                    <CardTitle className="text-base font-semibold">Recent Invoices</CardTitle>
                    <p className="text-xs text-muted-foreground">Recently generated invoices</p>
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
                                    <TableHead>Total Amount</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow><TableCell colSpan={8} className="h-24 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
                                ) : filteredData.length === 0 ? (
                                    <TableRow><TableCell colSpan={8} className="h-24 text-center">No invoices found.</TableCell></TableRow>
                                ) : (
                                    filteredData.map((inv) => (
                                        <TableRow key={inv.id} className="group hover:bg-muted/20">
                                            <TableCell><p className="font-semibold text-foreground">{inv.customer}</p></TableCell>
                                            <TableCell><span className="text-sm text-muted-foreground">{inv.invoiceNo}</span></TableCell>
                                            <TableCell><span className="font-medium">₹{inv.amount.toLocaleString("en-IN")}</span></TableCell>
                                            <TableCell><span className="text-sm">₹{inv.gstAmount.toLocaleString("en-IN")}</span></TableCell>
                                            <TableCell><span className="font-semibold text-foreground">₹{inv.totalAmount.toLocaleString("en-IN")}</span></TableCell>
                                            <TableCell><span className="text-sm">{inv.date ? new Date(inv.date).toLocaleDateString("en-IN") : "—"}</span></TableCell>
                                            <TableCell>{getStatusBadge(inv.status)}</TableCell>
                                            <TableCell>
                                                <div className="flex justify-end">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-lg"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-xl">
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg"><Eye className="h-4 w-4" />View Invoice</DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg"><Download className="h-4 w-4" />Download PDF</DropdownMenuItem>
                                                            {inv.status === "draft" && <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-success" onClick={() => handleIssue(inv.id)}><Send className="h-4 w-4" />Issue to Customer</DropdownMenuItem>}
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

            {/* Generate Invoice Dialog */}
            <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Generate New Invoice</DialogTitle>
                        <DialogDescription>Create a new GST-compliant invoice for your customer.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleGenerate}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="customer">Customer *</Label>
                                <Select value={genForm.customerId} onValueChange={(v) => setGenForm({ ...genForm, customerId: v })} required>
                                    <SelectTrigger id="customer">
                                        <SelectValue placeholder="Select customer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {customers.map((c) => (
                                            <SelectItem key={c._id} value={c._id}>{c.name} {c.code ? `(${c.code})` : ""}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {customers.length === 0 && <p className="text-xs text-muted-foreground">No customers found. Please add customers first.</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="invoiceDate">Invoice Date *</Label>
                                    <Input id="invoiceDate" type="date" required value={genForm.invoiceDate} onChange={(e) => setGenForm({ ...genForm, invoiceDate: e.target.value })} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="dueDate">Due Date *</Label>
                                    <Input id="dueDate" type="date" required value={genForm.dueDate} onChange={(e) => setGenForm({ ...genForm, dueDate: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="items">Items/Services *</Label>
                                <Textarea id="items" placeholder="Enter items or services..." rows={3} required value={genForm.items} onChange={(e) => setGenForm({ ...genForm, items: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="amount">Amount (₹) *</Label>
                                    <Input id="amount" type="number" placeholder="100000" required value={genForm.amount} onChange={(e) => setGenForm({ ...genForm, amount: e.target.value })} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="gstRate">GST Rate (%) *</Label>
                                    <Select value={genForm.gstRate} onValueChange={(v) => setGenForm({ ...genForm, gstRate: v })} required>
                                        <SelectTrigger id="gstRate">
                                            <SelectValue placeholder="Select GST rate" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">0%</SelectItem>
                                            <SelectItem value="5">5%</SelectItem>
                                            <SelectItem value="12">12%</SelectItem>
                                            <SelectItem value="18">18%</SelectItem>
                                            <SelectItem value="28">28%</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea id="notes" placeholder="Additional notes..." rows={2} value={genForm.notes} onChange={(e) => setGenForm({ ...genForm, notes: e.target.value })} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsGenerateOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={submitting}>{submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate Invoice"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <ImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} />
            <ExportDialog open={isExportOpen} onOpenChange={setIsExportOpen} />
        </div>
    );
};

export default GenerateInvoice;
