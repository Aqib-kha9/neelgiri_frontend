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
import { FileText, Plus, Download, Upload, BarChart3, Search, X, MoreHorizontal, Eye, Send, CheckCircle, Clock, IndianRupee, TrendingUp } from "lucide-react";
import { ImportDialog } from "../../../warehouse/(inventory)/ImportDialog";
import { ExportDialog } from "../../../warehouse/(inventory)/ExportDialog";

const invoiceStats = [
    { title: "Generated This Month", value: "142", change: "+18", trend: "up", icon: FileText, description: "Total invoices" },
    { title: "Pending Approval", value: "12", change: "+4", trend: "down", icon: Clock, description: "Awaiting review" },
    { title: "Sent Today", value: "8", change: "+3", trend: "up", icon: Send, description: "Delivered" },
    { title: "Total Value", value: "₹45.8L", change: "+22%", trend: "up", icon: IndianRupee, description: "This month" },
];

const GenerateInvoice = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all-status");
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [isGenerateOpen, setIsGenerateOpen] = useState(false);

    const recentInvoices = [
        { id: "INV-001", customer: "TechCorp Solutions", invoiceNo: "TC-INV-2024-001", amount: 125000, gstAmount: 22500, totalAmount: 147500, date: "2024-12-23", status: "draft" },
        { id: "INV-002", customer: "RetailHub India", invoiceNo: "RH-INV-2024-002", amount: 98000, gstAmount: 17640, totalAmount: 115640, date: "2024-12-22", status: "sent" },
        { id: "INV-003", customer: "FoodMart Chain", invoiceNo: "FM-INV-2024-003", amount: 156000, gstAmount: 28080, totalAmount: 184080, date: "2024-12-23", status: "draft" },
    ];

    const filteredData = recentInvoices.filter((inv) => {
        const matchesSearch = inv.customer.toLowerCase().includes(searchQuery.toLowerCase()) || inv.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all-status" || inv.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

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
                                <FileText className="h-3.5 w-3.5 text-primary" />142 this month
                            </span>
                            <span className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
                                <BarChart3 className="h-3.5 w-3.5 text-success" />₹45.8L value
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
                                <SelectItem value="sent">Sent</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
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
                                    <TableHead>GST (18%)</TableHead>
                                    <TableHead>Total Amount</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.length === 0 ? (
                                    <TableRow><TableCell colSpan={8} className="h-24 text-center">No invoices found.</TableCell></TableRow>
                                ) : (
                                    filteredData.map((inv) => (
                                        <TableRow key={inv.id} className="group hover:bg-muted/20">
                                            <TableCell><p className="font-semibold text-foreground">{inv.customer}</p></TableCell>
                                            <TableCell><span className="text-sm text-muted-foreground">{inv.invoiceNo}</span></TableCell>
                                            <TableCell><span className="font-medium">₹{inv.amount.toLocaleString("en-IN")}</span></TableCell>
                                            <TableCell><span className="text-sm">₹{inv.gstAmount.toLocaleString("en-IN")}</span></TableCell>
                                            <TableCell><span className="font-semibold text-foreground">₹{inv.totalAmount.toLocaleString("en-IN")}</span></TableCell>
                                            <TableCell><span className="text-sm">{new Date(inv.date).toLocaleDateString("en-IN")}</span></TableCell>
                                            <TableCell>
                                                <Badge variant={inv.status === "paid" ? "success" : inv.status === "sent" ? "warning" : "secondary"} className="rounded-full">
                                                    {inv.status === "paid" ? "Paid" : inv.status === "sent" ? "Sent" : "Draft"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-lg"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-xl">
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg"><Eye className="h-4 w-4" />View Invoice</DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg"><Download className="h-4 w-4" />Download PDF</DropdownMenuItem>
                                                            {inv.status === "draft" && <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-success"><Send className="h-4 w-4" />Send to Customer</DropdownMenuItem>}
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
                    <form onSubmit={(e) => { e.preventDefault(); setIsGenerateOpen(false); }}>
                        <div className="grid gap-4 py-4">
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
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="invoiceDate">Invoice Date *</Label>
                                    <Input id="invoiceDate" type="date" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="dueDate">Due Date *</Label>
                                    <Input id="dueDate" type="date" required />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="items">Items/Services *</Label>
                                <Textarea id="items" placeholder="Enter items or services..." rows={3} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="amount">Amount (₹) *</Label>
                                    <Input id="amount" type="number" placeholder="100000" required />
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
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea id="notes" placeholder="Additional notes..." rows={2} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsGenerateOpen(false)}>Cancel</Button>
                            <Button type="submit">Generate Invoice</Button>
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
