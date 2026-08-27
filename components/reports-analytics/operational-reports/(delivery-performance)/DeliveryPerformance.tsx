"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Clock, AlertTriangle, Loader2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

interface DeliveryMetric {
    zone: string;
    totalOrders: number;
    delivered: number;
    failed: number;
    rto: number;
    inTransit: number;
    codAmount: number;
    totalRevenue: number;
    deliveryRate: number;
    failureRate: number;
}

interface DeliveryTotals {
    totalOrders: number;
    delivered: number;
    failed: number;
    rto: number;
    codAmount: number;
    totalRevenue: number;
}

const DeliveryPerformance = () => {
    const [metrics, setMetrics] = useState<DeliveryMetric[]>([]);
    const [totals, setTotals] = useState<DeliveryTotals | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${API_BASE}/api/reports/delivery-performance`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMetrics(data.performance || []);
            setTotals(data.totals || null);
        } catch (error) {
            console.error("Failed to load delivery performance", error);
            toast.error("Failed to load delivery performance data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const totalDelivered = totals?.delivered ?? 0;
    const totalOrders = totals?.totalOrders ?? 0;
    const totalFailed = totals?.failed ?? 0;
    const successRate = totalOrders > 0 ? ((totalDelivered / totalOrders) * 100).toFixed(1) : "0.0";
    const failureRate = totalOrders > 0 ? ((totalFailed / totalOrders) * 100).toFixed(1) : "0.0";

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Delivery Performance</h1>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Delivered</CardTitle>
                        <BarChart3 className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalDelivered.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">{totalOrders.toLocaleString()} total orders</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Failed / RTO</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-warning" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{(totalFailed + (totals?.rto ?? 0)).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">{failureRate}% of orders</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Transit</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.reduce((acc, m) => acc + m.inTransit, 0).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Currently in transit</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-success" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{successRate}%</div>
                        <p className="text-xs text-muted-foreground">Target: 95%</p>
                    </CardContent>
                </Card>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Zone</TableHead>
                            <TableHead>Total Orders</TableHead>
                            <TableHead>Delivered</TableHead>
                            <TableHead>Failed</TableHead>
                            <TableHead>RTO</TableHead>
                            <TableHead>Delivery Rate</TableHead>
                            <TableHead>Score</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {metrics.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                    No delivery performance data available
                                </TableCell>
                            </TableRow>
                        ) : (
                            metrics.map((item, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="font-medium">{item.zone || "Unknown"}</TableCell>
                                    <TableCell>{item.totalOrders}</TableCell>
                                    <TableCell>{item.delivered}</TableCell>
                                    <TableCell className="text-error">{item.failed}</TableCell>
                                    <TableCell className="text-warning">{item.rto}</TableCell>
                                    <TableCell>{item.deliveryRate}%</TableCell>
                                    <TableCell>
                                        <Badge variant={item.deliveryRate >= 95 ? 'success' : item.deliveryRate >= 90 ? 'warning' : 'destructive'}>
                                            {item.deliveryRate}%
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

export default DeliveryPerformance;
