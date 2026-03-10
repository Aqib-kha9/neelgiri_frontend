"use client";

import { useState } from "react";
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
import { FileText, Plus, Download, Upload, BarChart3, Search, X, MoreHorizontal, Eye, TrendingUp, TrendingDown, IndianRupee, Clock } from "lucide-react";
import { ImportDialog } from "../../../warehouse/(inventory)/ImportDialog";
import { ExportDialog } from "../../../warehouse/(inventory)/ExportDialog";

const notesStats = [
    { title: "Total Notes", value: "86", change: "+12", trend: "up", icon: FileText, description: "All time" },
    { title: "Credit Notes", value: "52", change: "+8", trend: "up", icon: TrendingUp, description: "Issued" },
    { title: "Debit Notes", value: "34", change: "+4", trend: "up", icon: TrendingDown, description: "Issued" },
    { title: "Total Value", value: "₹12.5L", change: "+15%", trend: "up", icon: IndianRupee, description: "This year" },
];

const notesData = [
    { id: "CN-001", customer: "TechCorp Solutions", noteNo: "TC-CN-2024-001", type: "credit", reason: "Product Return", amount: 25000, gstAmount: 4500, totalAmount: 29500, date: "2024-12-20", status: "approved", invoiceRef: "TC-INV-2024-001" },
    { id: "DN-001", customer: "RetailHub India", noteNo: "RH-DN-2024-001", type: "debit", reason: "Additional Charges", amount: 15000, gstAmount: 2700, totalAmount: 17700, date: "2024-12-18", status: "pending", invoiceRef: "RH-INV-2024-002" },
    { id: "CN-002", customer: "FoodMart Chain", noteNo: "FM-CN-2024-002", type: "credit", reason: "Discount Adjustment", amount: 18000, gstAmount: 3240, totalAmount: 21240, date: "2024-12-22", status: "approved", invoiceRef: "FM-INV-2024-003" },
    { id: "DN-002", customer: "Fashion Trends", noteNo: "FT-DN-2024-002", type: "debit", reason: "Late Payment Fee", amount: 5000, gstAmount: 900, totalAmount: 5900, date: "2024-12-21", status: "approved", invoiceRef: "FT-INV-2024-004" },
];

const CreditDebitNotes = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all-types");
    const [statusFilter, setStatusFilter] = useState("all-status");
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const filteredData = notesData.filter((note) => {
        const matchesSearch = note.customer.toLowerCase().includes(searchQuery.toLowerCase()) || note.noteNo.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === "all-types" || note.type === typeFilter;
        const matchesStatus = statusFilter === "all-status" || note.status === statusFilter;
        return matchesSearch && matchesType && matchesStatus;
    });

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
                                <FileText className="h-3.5 w-3.5 text-primary" />86 notes
                            </span>
                            <span className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
                                <BarChart3 className="h-3.5 w-3.5 text-success" />₹12.5L value
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
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
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
                                {filteredData.length === 0 ? (
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
                                            <TableCell><span className="text-sm">{new Date(note.date).toLocaleDateString("en-IN")}</span></TableCell>
                                            <TableCell>
                                                <Badge variant={note.status === "approved" ? "success" : "warning"} className="rounded-full">
                                                    {note.status === "approved" ? "Approved" : "Pending"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-lg"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-xl">
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg"><Eye className="h-4 w-4" />View Details</DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg"><Download className="h-4 w-4" />Download PDF</DropdownMenuItem>
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
                    <form onSubmit={(e) => { e.preventDefault(); setIsCreateOpen(false); }}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="noteType">Note Type *</Label>
                                <Select required>
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
                                <Select required>
                                    <SelectTrigger id="customer">
                                        <SelectValue placeholder="Select customer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="techcorp">TechCorp Solutions</SelectItem>
                                        <SelectItem value="retailhub">RetailHub India</SelectItem>
                                        <SelectItem value="foodmart">FoodMart Chain</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="invoiceRef">Invoice Reference *</Label>
                                <Input id="invoiceRef" placeholder="e.g., TC-INV-2024-001" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="reason">Reason *</Label>
                                <Select required>
                                    <SelectTrigger id="reason">
                                        <SelectValue placeholder="Select reason" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="return">Product Return</SelectItem>
                                        <SelectItem value="discount">Discount Adjustment</SelectItem>
                                        <SelectItem value="charges">Additional Charges</SelectItem>
                                        <SelectItem value="late-fee">Late Payment Fee</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="amount">Amount (₹) *</Label>
                                    <Input id="amount" type="number" placeholder="10000" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="gstRate">GST Rate (%) *</Label>
                                    <Select required>
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
                                <Textarea id="notes" placeholder="Enter additional details..." rows={3} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button type="submit">Create Note</Button>
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
