"use client";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Loader2, IndianRupee, Clock, CalendarDays, AlertCircle, Search, X, MoreHorizontal, FileText, Download } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

const formatLakh = (amount: number) => {
    if (!amount) return "₹0";
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString("en-IN")}`;
};

interface PaymentRecord {
    id: string;
    transactionId: string;
    customerName: string;
    amount: number;
    paymentMode: string;
    status: string;
    date: string;
    collectedBy: string;
    referenceNo?: string;
}

interface PaymentStats {
    totalCollection: number;
    pendingAmount: number;
    todayCollection: number;
    failedTransactions: number;
}

const PaymentCollection = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all-status");
    const [loading, setLoading] = useState(true);
    const [payments, setPayments] = useState<PaymentRecord[]>([]);
    const [stats, setStats] = useState<PaymentStats>({ totalCollection: 0, pendingAmount: 0, todayCollection: 0, failedTransactions: 0 });

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            const res = await axios.get(`${API_BASE}/api/payments/collection`, { headers });
            const raw = res.data?.data || [];
            setPayments(raw);
            setStats(res.data?.stats || { totalCollection: 0, pendingAmount: 0, todayCollection: 0, failedTransactions: 0 });
        } catch (err: any) {
            console.error("Fetch payment collection error:", err);
            toast.error(err?.response?.data?.message || "Failed to load payment collections");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const filteredData = payments.filter((payment) => {
        const matchesSearch = payment.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (payment.referenceNo || "").toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all-status" || payment.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const statCards = [
        { title: "Total Collection", value: stats.totalCollection, icon: IndianRupee, color: "text-primary", bg: "bg-primary/10", isAmount: true },
        { title: "Pending Amount", value: stats.pendingAmount, icon: Clock, color: "text-warning", bg: "bg-warning/10", isAmount: true },
        { title: "Today's Collection", value: stats.todayCollection, icon: CalendarDays, color: "text-success", bg: "bg-success/10", isAmount: true },
        { title: "Failed Transactions", value: stats.failedTransactions, icon: AlertCircle, color: "text-error", bg: "bg-error/10", isAmount: false },
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
                            <p className="max-w-2xl text-body">Track all incoming payments from customers. View transaction history and payment status.</p>
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
                            placeholder="Search by customer, txn ID, or reference..."
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
                                <SelectItem value="failed">Failed</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
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
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Transaction ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Mode</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Collected By</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow><TableCell colSpan={8} className="h-24 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
                                ) : filteredData.length === 0 ? (
                                    <TableRow><TableCell colSpan={8} className="h-24 text-center text-muted-foreground">No payment records found.</TableCell></TableRow>
                                ) : (
                                    filteredData.map((payment) => (
                                        <TableRow key={payment.id} className="group hover:bg-muted/20">
                                            <TableCell><span className="font-mono text-xs">{payment.transactionId}</span></TableCell>
                                            <TableCell><p className="font-medium text-foreground">{payment.customerName}</p></TableCell>
                                            <TableCell><span className="font-semibold">{formatLakh(payment.amount)}</span></TableCell>
                                            <TableCell><Badge variant="outline" className="capitalize">{payment.paymentMode}</Badge></TableCell>
                                            <TableCell><span className="text-sm text-muted-foreground">{payment.date}</span></TableCell>
                                            <TableCell><span className="text-sm">{payment.collectedBy}</span></TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    payment.status === "received" ? "success" :
                                                        payment.status === "pending" ? "warning" :
                                                            payment.status === "failed" ? "destructive" : "secondary"
                                                } className="rounded-full capitalize">
                                                    {payment.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="rounded-lg"><MoreHorizontal className="h-4 w-4" /></Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-xl">
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg cursor-pointer">
                                                                <FileText className="h-4 w-4" /> View Receipt
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg cursor-pointer">
                                                                <Download className="h-4 w-4" /> Download
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
        </div>
    );
};

export default PaymentCollection;
