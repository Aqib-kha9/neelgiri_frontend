"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CheckCircle, Clock, XCircle, Search, X, MoreHorizontal, Eye, Download, Upload, Wallet, IndianRupee, CreditCard, AlertCircle } from "lucide-react";
import { mockPaymentCollections, mockPaymentStats } from "./mockData";
import { ImportDialog } from "../../../warehouse/(inventory)/ImportDialog";
import { ExportDialog } from "../../../warehouse/(inventory)/ExportDialog";

const PaymentCollection = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all-status");
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);

    const filteredData = mockPaymentCollections.filter((payment) => {
        const matchesSearch = payment.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all-status" || payment.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = [
        { title: "Total Collection", value: mockPaymentStats.totalCollection, icon: IndianRupee, color: "text-primary", bg: "bg-primary/10" },
        { title: "Today's Collection", value: mockPaymentStats.todayCollection, icon: Wallet, color: "text-success", bg: "bg-success/10" },
        { title: "Pending Amount", value: mockPaymentStats.pendingAmount, icon: Clock, color: "text-warning", bg: "bg-warning/10" },
        { title: "Failed Transactions", value: mockPaymentStats.failedTransactions, icon: XCircle, color: "text-error", bg: "bg-error/10", isCount: true },
    ];

    return (
        <div className="space-y-7">
            {/* Header Section */}
            <section className="rounded-3xl border border-border/70 bg-card/95 p-7 shadow-card">
                <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-5">
                    <div className="space-y-3">
                        <Badge className="rounded-full bg-primary/15 px-4 py-1 text-primary">Financial Management</Badge>
                        <div className="space-y-2">
                            <h1 className="text-display-1 leading-tight">Payment Collection</h1>
                            <p className="max-w-2xl text-body">Manage and track all payment collections, transactions, and status updates.</p>
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
                        <Button className="gap-2 rounded-lg shadow-lg shadow-primary/20">
                            <CreditCard className="h-4 w-4" /> Record New Payment
                        </Button>
                    </div>
                </div>
            </section>

            {/* Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index} className="relative overflow-hidden rounded-2xl border-border/70 bg-card/95 shadow-card">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                    <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                                        {stat.isCount ? stat.value : `₹${stat.value.toLocaleString('en-IN')}`}
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
                            placeholder="Search by customer or transaction ID..."
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
                                <SelectItem value="received">Received</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
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
                    <CardTitle className="text-base font-semibold">Transactions</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Transaction ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Payment Mode</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Collected By</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.length === 0 ? (
                                    <TableRow><TableCell colSpan={8} className="h-24 text-center">No transactions found.</TableCell></TableRow>
                                ) : (
                                    filteredData.map((payment) => (
                                        <TableRow key={payment.id} className="group hover:bg-muted/20">
                                            <TableCell><span className="font-mono text-xs">{payment.transactionId}</span></TableCell>
                                            <TableCell><p className="font-medium text-foreground">{payment.customerName}</p></TableCell>
                                            <TableCell><span className="font-semibold">₹{payment.amount.toLocaleString("en-IN")}</span></TableCell>
                                            <TableCell><Badge variant="outline">{payment.paymentMode}</Badge></TableCell>
                                            <TableCell><span className="text-sm">{new Date(payment.date).toLocaleDateString("en-IN")}</span></TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    payment.status === "received" ? "success" :
                                                        payment.status === "failed" ? "destructive" :
                                                            payment.status === "processing" ? "warning" : "secondary"
                                                } className="rounded-full capitalize">
                                                    {payment.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell><span className="text-sm text-muted-foreground">{payment.collectedBy}</span></TableCell>
                                            <TableCell>
                                                <div className="flex justify-end">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="rounded-lg"><MoreHorizontal className="h-4 w-4" /></Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-xl">
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg cursor-pointer">
                                                                <Eye className="h-4 w-4" /> View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg cursor-pointer">
                                                                <Download className="h-4 w-4" /> Download Receipt
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

            <ImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} />
            <ExportDialog open={isExportOpen} onOpenChange={setIsExportOpen} />
        </div>
    );
};

export default PaymentCollection;
