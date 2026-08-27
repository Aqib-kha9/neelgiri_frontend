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
import { FileText, Plus, Download, Upload, BarChart3, Search, X, MoreHorizontal, Eye, TrendingUp, TrendingDown, IndianRupee, Clock, Loader2, CheckCircle } from "lucide-react";
import { ImportDialog } from "../../../warehouse/(inventory)/ImportDialog";
import { ExportDialog } from "../../../warehouse/(inventory)/ExportDialog";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

const formatLakh = (amount: number) => {
    if (!amount) return "₹0";
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString("en-IN")}`;
};

const mapNote = (n: any) => {
    const customer = n.customerId && typeof n.customerId === "object" ? n.customerId : {};
    const invoice = n.invoiceId && typeof n.invoiceId === "object" ? n.invoiceId : {};
    const lineItems = n.lineItems || [];
    const subtotal = n.subtotal || lineItems.reduce((sum: number, li: any) => sum + (li.amount || 0), 0);
    return {
        id: n._id || n.noteNo,
        customer: n.customerName || customer.name || "Unknown",
        noteNo: n.noteNo || "",
        type: (n.noteType || "").toLowerCase(),
        reason: n.reason || (lineItems[0]?.reason) || "—",
        amount: subtotal,
        gstAmount: n.taxAmount || 0,
        totalAmount: n.totalAmount || subtotal,
        date: n.noteDate ? new Date(n.noteDate).toISOString().split("T")[0] : "",
        status: (n.status || "PENDING").toLowerCase(),
        invoiceRef: n.invoiceNo || invoice.invoiceNo || "—",
    };
};

const CreditDebitNotes = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all-types");
    const [statusFilter, setStatusFilter] = useState("all-status");
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [notes, setNotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [customers, setCustomers] = useState<any[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [createForm, setCreateForm] = useState({ noteType: "", customerId: "", invoiceRef: "", reason: "", amount: "", gstRate: "0", notes: "" });

    const fetchNotes = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            const res = await axios.get(`${API_BASE}/api/invoices/notes`, { headers });
            const raw = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setNotes(raw.map(mapNote));
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to fetch notes");
        } finally {
            setLoading(false);
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
        fetchNotes();
        fetchCustomers();
    }, [fetchNotes, fetchCustomers]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!createForm.noteType) { toast.error("Please select note type"); return; }
        if (!createForm.customerId) { toast.error("Please select a customer"); return; }
        if (!createForm.amount || parseFloat(createForm.amount) <= 0) { toast.error("Please enter a valid amount"); return; }
        try {
            setSubmitting(true);
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            const amount = parseFloat(createForm.amount) || 0;
            const gstRate = parseFloat(createForm.gstRate) || 0;
            const taxAmount = Math.round((amount * gstRate) / 100);
            const customer = customers.find((c) => c._id === createForm.customerId) || {};
            await axios.post(`${API_BASE}/api/invoices/notes`, {
                noteType: createForm.noteType.toUpperCase(),
                customerId: createForm.customerId,
                customerName: customer.name,
                customerCode: customer.code,
                invoiceNo: createForm.invoiceRef || undefined,
                reason: createForm.reason || "Adjustment",
                lineItems: [{
                    description: createForm.reason || "Adjustment",
                    amount,
                    reason: createForm.reason || "Adjustment",
                }],
                notes: createForm.notes,
            }, { headers });
            toast.success(`${createForm.noteType === "credit" ? "Credit" : "Debit"} note created successfully`);
            setIsCreateOpen(false);
            setCreateForm({ noteType: "", customerId: "", invoiceRef: "", reason: "", amount: "", gstRate: "0", notes: "" });
            fetchNotes();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to create note");
        } finally {
            setSubmitting(false);
        }
    };

    const handleApprove = async (id: string) => {
        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            await axios.put(`${API_BASE}/api/invoices/notes/${id}/approve`, {}, { headers });
            toast.success("Note approved successfully");
            fetchNotes();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to approve note");
        }
    };

    const filteredData = notes.filter((note) => {
        const matchesSearch = note.customer.toLowerCase().includes(searchQuery.toLowerCase()) || note.noteNo.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === "all-types" || note.type === typeFilter;
        const matchesStatus = statusFilter === "all-status" || note.status === statusFilter;
        return matchesSearch && matchesType && matchesStatus;
    });

    const totalNotes = notes.length;
    const creditCount = notes.filter((n) => n.type === "credit").length;
    const debitCount = notes.filter((n) => n.type === "debit").length;
    const totalValue = notes.reduce((sum, n) => sum + (n.totalAmount || 0), 0);

    const notesStats = [
        { title: "Total Notes", value: totalNotes.toString(), icon: FileText, description: "All time" },
        { title: "Credit Notes", value: creditCount.toString(), icon: TrendingUp, description: "Issued" },
        { title: "Debit Notes", value: debitCount.toString(), icon: TrendingDown, description: "Issued" },
        { title: "Total Value", value: formatLakh(totalValue), icon: IndianRupee, description: "This year" },
    ];

    return (
        <div className="space-y-7">
            <section className="rounded-3xl border border-border/70 bg-card/95 p-7 shadow-card">
                <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-5">
                    <div className="space-y-3">
                        <Badge className="rounded-full bg-primary/15 px-4 py-1 text-primary">Financial Management</Badge>
                        <div className="space-y-2">
                            <h1 className="text-display-1 leading-tight">Credit/Debit Notes</h1>
                            <p className="max-w-2xl text-body">Manage credit and debit notes. Issue adjustments, refunds, and additional charges with GST compliance.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1">
                                <FileText className="h-3.5 w-3.5 text-primary" />{totalNotes} notes
                            </span>
                            <span className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
                                <BarChart3 className="h-3.5 w-3.5 text-success" />{formatLakh(totalValue)} value
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                            <Button className="gap-2 rounded-lg bg-primary text-primary-foreground shadow-brand" onClick={() => setIsCreateOpen(true)}>
                                <Plus className="h-4 w-4" />Create Note
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
                {notesStats.map((stat, index) => (
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
                        <Input placeholder="Search notes..." className="h-10 w-full rounded-xl bg-background/50 pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="h-10 w-[160px] rounded-xl">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-types">All Types</SelectItem>
                                <SelectItem value="credit">Credit Note</SelectItem>
                                <SelectItem value="debit">Debit Note</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="h-10 w-[160px] rounded-xl">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-status">All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="applied">Applied</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                        {(searchQuery || typeFilter !== "all-types" || statusFilter !== "all-status") && (
                            <Button variant="ghost" size="icon" onClick={() => { setSearchQuery(""); setTypeFilter("all-types"); setStatusFilter("all-status"); }} className="h-10 w-10 rounded-xl">
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Credit/Debit Notes</CardTitle>
                    <p className="text-xs text-muted-foreground">Financial adjustment notes</p>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">Customer</TableHead>
                                    <TableHead>Note No</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow><TableCell colSpan={9} className="h-24 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
                                ) : filteredData.length === 0 ? (
                                    <TableRow><TableCell colSpan={9} className="h-24 text-center">No notes found.</TableCell></TableRow>
                                ) : (
                                    filteredData.map((note) => (
                                        <TableRow key={note.id} className="group hover:bg-muted/20">
                                            <TableCell><p className="font-semibold text-foreground">{note.customer}</p></TableCell>
                                            <TableCell><span className="text-sm text-muted-foreground">{note.noteNo}</span></TableCell>
                                            <TableCell>
                                                <Badge variant={note.type === "credit" ? "success" : "error"} className="rounded-full text-xs">
                                                    {note.type === "credit" ? "Credit" : "Debit"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell><span className="text-sm">{note.reason}</span></TableCell>
                                            <TableCell><span className="font-medium">₹{note.amount.toLocaleString("en-IN")}</span></TableCell>
                                            <TableCell><span className="font-semibold text-foreground">₹{note.totalAmount.toLocaleString("en-IN")}</span></TableCell>
                                            <TableCell><span className="text-sm">{note.date ? new Date(note.date).toLocaleDateString("en-IN") : "—"}</span></TableCell>
                                            <TableCell>
                                                <Badge variant={note.status === "approved" ? "success" : note.status === "applied" ? "default" : note.status === "rejected" ? "error" : "warning"} className="rounded-full">
                                                    {note.status === "approved" ? "Approved" : note.status === "applied" ? "Applied" : note.status === "rejected" ? "Rejected" : "Pending"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-lg"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-xl">
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg"><Eye className="h-4 w-4" />View Details</DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg"><Download className="h-4 w-4" />Download PDF</DropdownMenuItem>
                                                            {note.status === "pending" && <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-success" onClick={() => handleApprove(note.id)}><CheckCircle className="h-4 w-4" />Approve Note</DropdownMenuItem>}
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

            {/* Create Note Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Create Credit/Debit Note</DialogTitle>
                        <DialogDescription>Issue a new credit or debit note for invoice adjustments.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="noteType">Note Type *</Label>
                                <Select value={createForm.noteType} onValueChange={(v) => setCreateForm({ ...createForm, noteType: v })} required>
                                    <SelectTrigger id="noteType">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="credit">Credit Note</SelectItem>
                                        <SelectItem value="debit">Debit Note</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="customer">Customer *</Label>
                                <Select value={createForm.customerId} onValueChange={(v) => setCreateForm({ ...createForm, customerId: v })} required>
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
                            <div className="grid gap-2">
                                <Label htmlFor="invoiceRef">Invoice Reference</Label>
                                <Input id="invoiceRef" placeholder="e.g., INV-2024-001" value={createForm.invoiceRef} onChange={(e) => setCreateForm({ ...createForm, invoiceRef: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="reason">Reason *</Label>
                                <Select value={createForm.reason} onValueChange={(v) => setCreateForm({ ...createForm, reason: v })} required>
                                    <SelectTrigger id="reason">
                                        <SelectValue placeholder="Select reason" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Product Return">Product Return</SelectItem>
                                        <SelectItem value="Discount Adjustment">Discount Adjustment</SelectItem>
                                        <SelectItem value="Additional Charges">Additional Charges</SelectItem>
                                        <SelectItem value="Late Payment Fee">Late Payment Fee</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="amount">Amount (₹) *</Label>
                                    <Input id="amount" type="number" placeholder="10000" required value={createForm.amount} onChange={(e) => setCreateForm({ ...createForm, amount: e.target.value })} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="gstRate">GST Rate (%) *</Label>
                                    <Select value={createForm.gstRate} onValueChange={(v) => setCreateForm({ ...createForm, gstRate: v })} required>
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
                                <Label htmlFor="notes">Additional Notes</Label>
                                <Textarea id="notes" placeholder="Enter additional details..." rows={3} value={createForm.notes} onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={submitting}>{submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Note"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <ImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} />
            <ExportDialog open={isExportOpen} onOpenChange={setIsExportOpen} />
        </div>
    );
};

export default CreditDebitNotes;
