"use client";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, Wallet, CreditCard, TrendingUp, Loader2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

interface RevenueMetric {
    period: string;
    totalRevenue: number;
    codCollected: number;
    onlinePayments: number;
    pendingCod: number;
    totalShipments: number;
    growth: number;
}

const RevenueReports = () => {
    const [metrics, setMetrics] = useState<RevenueMetric[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${API_BASE}/api/reports/revenue`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMetrics(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load revenue report", error);
            toast.error("Failed to load revenue report data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const totalRevenue = metrics.reduce((acc, m) => acc + (m.totalRevenue || 0), 0);
    const totalCod = metrics.reduce((acc, m) => acc + (m.codCollected || 0), 0);
    const totalOnline = metrics.reduce((acc, m) => acc + (m.onlinePayments || 0), 0);
    const totalPending = metrics.reduce((acc, m) => acc + (m.pendingCod || 0), 0);
    const avgGrowth = metrics.length
        ? (metrics.reduce((acc, m) => acc + (m.growth || 0), 0) / metrics.length).toFixed(1)
        : "0.0";

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
            <h1 className="text-2xl font-bold">Revenue Reports</h1>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                        <p className="text-xs text-muted-foreground">{metrics.length} periods</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">COD Collected</CardTitle>
                        <Wallet className="h-4 w-4 text-success" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalCod)}</div>
                        <p className="text-xs text-muted-foreground">Cash handling</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Online Payments</CardTitle>
                        <CreditCard className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalOnline)}</div>
                        <p className="text-xs text-muted-foreground">Digital transfers</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Growth</CardTitle>
                        <TrendingUp className="h-4 w-4 text-warning" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{avgGrowth}%</div>
                        <p className="text-xs text-muted-foreground">Period over period</p>
                    </CardContent>
                </Card>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Period</TableHead>
                            <TableHead>Total Revenue</TableHead>
                            <TableHead>COD Collected</TableHead>
                            <TableHead>Online Payments</TableHead>
                            <TableHead>Pending COD</TableHead>
                            <TableHead>Shipments</TableHead>
                            <TableHead>Growth %</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {metrics.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                    No revenue data available
                                </TableCell>
                            </TableRow>
                        ) : (
                            metrics.map((item, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="font-medium">{item.period || "—"}</TableCell>
                                    <TableCell>₹{(item.totalRevenue || 0).toLocaleString()}</TableCell>
                                    <TableCell>₹{(item.codCollected || 0).toLocaleString()}</TableCell>
                                    <TableCell>₹{(item.onlinePayments || 0).toLocaleString()}</TableCell>
                                    <TableCell className="text-error">₹{(item.pendingCod || 0).toLocaleString()}</TableCell>
                                    <TableCell>{item.totalShipments || 0}</TableCell>
                                    <TableCell className={item.growth >= 0 ? "text-success" : "text-error"}>
                                        {item.growth >= 0 ? "+" : ""}{item.growth || 0}%
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

export default RevenueReports;
