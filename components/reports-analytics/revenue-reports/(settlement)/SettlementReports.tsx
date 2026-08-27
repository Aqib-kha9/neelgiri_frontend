"use client";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertTriangle, ArrowUpRight, Loader2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

interface Settlement {
    id: string;
    partnerName: string;
    amount: number;
    status: string;
    transactionId: string;
    method: string;
    count: number;
}

const SettlementReports = () => {
    const [settlements, setSettlements] = useState<Settlement[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${API_BASE}/api/reports/settlement`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSettlements(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load settlement report", error);
            toast.error("Failed to load settlement report data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const settled = settlements.filter((s) => s.status?.toLowerCase() === "settled" || s.status?.toLowerCase() === "paid");
    const processing = settlements.filter((s) => s.status?.toLowerCase() === "processing" || s.status?.toLowerCase() === "pending");
    const failed = settlements.filter((s) => s.status?.toLowerCase() === "failed" || s.status?.toLowerCase() === "rejected");
    const totalOutflow = settlements.reduce((acc, s) => acc + (s.amount || 0), 0);

    const settledAmount = settled.reduce((acc, s) => acc + (s.amount || 0), 0);
    const processingAmount = processing.reduce((acc, s) => acc + (s.amount || 0), 0);

    const formatCurrency = (val: number) => {
        if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
        if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
        if (val >= 1000) return `₹${(val / 1000).toFixed(1)}k`;
        return `₹${val.toLocaleString()}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Settlement Reports</h1>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Settled</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-success" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(settledAmount)}</div>
                        <p className="text-xs text-muted-foreground">{settled.length} transactions</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Processing</CardTitle>
                        <Clock className="h-4 w-4 text-warning" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(processingAmount)}</div>
                        <p className="text-xs text-muted-foreground">{processing.length} transactions</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Failed</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-error" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{failed.length}</div>
                        <p className="text-xs text-muted-foreground">Action required</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Outflow</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalOutflow)}</div>
                        <p className="text-xs text-muted-foreground">{settlements.length} total settlements</p>
                    </CardContent>
                </Card>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Partner</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Transaction ID</TableHead>
                            <TableHead>Count</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {settlements.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                    No settlement data available
                                </TableCell>
                            </TableRow>
                        ) : (
                            settlements.map((item, idx) => (
                                <TableRow key={item.id || idx}>
                                    <TableCell className="font-medium">{item.partnerName || "—"}</TableCell>
                                    <TableCell>₹{(item.amount || 0).toLocaleString()}</TableCell>
                                    <TableCell>{item.method || "—"}</TableCell>
                                    <TableCell className="text-muted-foreground font-mono text-xs">{item.transactionId || "—"}</TableCell>
                                    <TableCell>{item.count || 0}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                item.status?.toLowerCase() === "settled" || item.status?.toLowerCase() === "paid"
                                                    ? "success"
                                                    : item.status?.toLowerCase() === "processing" || item.status?.toLowerCase() === "pending"
                                                        ? "warning"
                                                        : "destructive"
                                            }
                                        >
                                            {item.status || "unknown"}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default SettlementReports;
