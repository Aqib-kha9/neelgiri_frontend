"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FileText, Download, Upload, BarChart3, Search, X, MoreHorizontal, Eye, Send, CheckCircle, Clock, IndianRupee, TrendingUp } from "lucide-react";
import { ImportDialog } from "../../../warehouse/(inventory)/ImportDialog";
import { ExportDialog } from "../../../warehouse/(inventory)/ExportDialog";

const historyStats = [
    { title: "Total Invoices", value: "1,248", change: "+142", trend: "up", icon: FileText, description: "All time" },
    { title: "Paid Invoices", value: "1,156", change: "+128", trend: "up", icon: CheckCircle, description: "Completed" },
    { title: "Pending Payment", value: "68", change: "+12", trend: "down", icon: Clock, description: "Awaiting" },
    { title: "Total Revenue", value: "₹185.5L", change: "+22%", trend: "up", icon: IndianRupee, description: "This year" },
];

const invoiceHistory = [
    { id: "INV-001", customer: "TechCorp Solutions", invoiceNo: "TC-INV-2024-001", amount: 125000, gstAmount: 22500, totalAmount: 147500, date: "2024-12-15", dueDate: "2024-12-30", status: "paid", paymentDate: "2024-12-20" },
    { id: "INV-002", customer: "RetailHub India", invoiceNo: "RH-INV-2024-002", amount: 98000, gstAmount: 17640, totalAmount: 115640, date: "2024-12-18", dueDate: "2025-01-02", status: "pending", paymentDate: null },
    { id: "INV-003", customer: "FoodMart Chain", invoiceNo: "FM-INV-2024-003", amount: 156000, gstAmount: 28080, totalAmount: 184080, date: "2024-12-10", dueDate: "2024-12-25", status: "paid", paymentDate: "2024-12-22" },
    { id: "INV-004", customer: "Fashion Trends", invoiceNo: "FT-INV-2024-004", amount: 85000, gstAmount: 15300, totalAmount: 100300, date: "2024-12-20", dueDate: "2025-01-05", status: "sent", paymentDate: null },
    { id: "INV-005", customer: "MediCare Pharma", invoiceNo: "MP-INV-2024-005", amount: 142000, gstAmount: 25560, totalAmount: 167560, date: "2024-12-12", dueDate: "2024-12-27", status: "overdue", paymentDate: null },
];

const InvoiceHistory = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all-status");
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);

    const filteredData = invoiceHistory.filter((inv) => {
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
                            <h1 className="text-display-1 leading-tight">Invoice History</h1>
                            <p className="max-w-2xl text-body">View complete invoice history. Track payments, pending invoices, and financial records.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1">
                                <FileText className="h-3.5 w-3.5 text-primary" />1,248 invoices
                            </span>
                            <span className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
                                <BarChart3 className="h-3.5 w-3.5 text-success" />92.6% paid
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
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="sent">Sent</SelectItem>
                                <SelectItem value="overdue">Overdue</SelectItem>
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
                                {filteredData.length === 0 ? (
                                    <TableRow><TableCell colSpan={9} className="h-24 text-center">No invoices found.</TableCell></TableRow>
                                ) : (
                                    filteredData.map((inv) => (
                                        <TableRow key={inv.id} className="group hover:bg-muted/20">
                                            <TableCell><p className="font-semibold text-foreground">{inv.customer}</p></TableCell>
                                            <TableCell><span className="text-sm text-muted-foreground">{inv.invoiceNo}</span></TableCell>
                                            <TableCell><span className="font-medium">₹{inv.amount.toLocaleString("en-IN")}</span></TableCell>
                                            <TableCell><span className="text-sm">₹{inv.gstAmount.toLocaleString("en-IN")}</span></TableCell>
                                            <TableCell><span className="font-semibold text-foreground">₹{inv.totalAmount.toLocaleString("en-IN")}</span></TableCell>
                                            <TableCell><span className="text-sm">{new Date(inv.date).toLocaleDateString("en-IN")}</span></TableCell>
                                            <TableCell><span className="text-sm">{new Date(inv.dueDate).toLocaleDateString("en-IN")}</span></TableCell>
                                            <TableCell>
                                                <Badge variant={inv.status === "paid" ? "success" : inv.status === "overdue" ? "error" : inv.status === "sent" ? "warning" : "secondary"} className="rounded-full">
                                                    {inv.status === "paid" ? "Paid" : inv.status === "overdue" ? "Overdue" : inv.status === "sent" ? "Sent" : "Pending"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-lg"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-xl">
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg"><Eye className="h-4 w-4" />View Invoice</DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg"><Download className="h-4 w-4" />Download PDF</DropdownMenuItem>
                                                            {inv.status !== "paid" && <DropdownMenuItem className="flex items-center gap-2 rounded-lg"><Send className="h-4 w-4" />Send Reminder</DropdownMenuItem>}
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
