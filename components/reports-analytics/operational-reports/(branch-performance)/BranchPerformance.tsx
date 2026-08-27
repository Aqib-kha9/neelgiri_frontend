"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, BarChart, TrendingUp, Loader2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

interface BranchMetric {
    _id: string;
    branchName: string;
    dailyOrders: number;
    delivered: number;
    revenue: number;
    codAmount: number;
    rto: number;
    efficiency: number;
}

const BranchPerformance = () => {
    const [metrics, setMetrics] = useState<BranchMetric[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${API_BASE}/api/reports/branch-performance`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMetrics(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load branch performance", error);
            toast.error("Failed to load branch performance data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const totalOrders = metrics.reduce((acc, m) => acc + m.dailyOrders, 0);
    const totalRevenue = metrics.reduce((acc, m) => acc + m.revenue, 0);
    const totalDelivered = metrics.reduce((acc, m) => acc + m.delivered, 0);
    const avgEfficiency = metrics.length > 0 ? (metrics.reduce((acc, m) => acc + (m.efficiency || 0), 0) / metrics.length).toFixed(1) : "0.0";

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Branch Performance</h1>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <BarChart className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalOrders.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Across all branches</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-success" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">From all branches</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Efficiency</CardTitle>
                        <TrendingUp className="h-4 w-4 text-warning" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgEfficiency}%</div>
                        <p className="text-xs text-muted-foreground">Delivery efficiency</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Delivered</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalDelivered.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Successfully delivered</p>
                    </CardContent>
                </Card>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Branch Name</TableHead>
                            <TableHead>Daily Orders</TableHead>
                            <TableHead>Delivered</TableHead>
                            <TableHead>Revenue</TableHead>
                            <TableHead>COD Amount</TableHead>
                            <TableHead>RTO</TableHead>
                            <TableHead>Efficiency</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {metrics.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                    No branch performance data available
                                </TableCell>
                            </TableRow>
                        ) : (
                            metrics.map((item, idx) => (
                                <TableRow key={item._id || idx}>
                                    <TableCell className="font-medium">{item.branchName || "Unknown"}</TableCell>
                                    <TableCell>{item.dailyOrders}</TableCell>
                                    <TableCell>{item.delivered}</TableCell>
                                    <TableCell>₹{(item.revenue || 0).toLocaleString()}</TableCell>
                                    <TableCell>₹{(item.codAmount || 0).toLocaleString()}</TableCell>
                                    <TableCell className="text-warning">{item.rto || 0}</TableCell>
                                    <TableCell>{item.efficiency || 0}%</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default BranchPerformance;
