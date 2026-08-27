"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Bike, Navigation, Award, AlertTriangle, Loader2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

interface RiderMetric {
    _id: string;
    riderName: string;
    driverCode: string;
    ordersCompleted: number;
    codCollected: number;
    revenue: number;
    failedAttempts: number;
    rating: number;
    successRate: number;
    overallScore: number;
}

const RiderReports = () => {
    const [metrics, setMetrics] = useState<RiderMetric[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${API_BASE}/api/reports/rider-performance`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMetrics(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load rider performance", error);
            toast.error("Failed to load rider performance data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const totalOrders = metrics.reduce((acc, m) => acc + m.ordersCompleted, 0);
    const totalRevenue = metrics.reduce((acc, m) => acc + m.revenue, 0);
    const totalFailed = metrics.reduce((acc, m) => acc + m.failedAttempts, 0);
    const avgRating = metrics.length > 0 ? (metrics.reduce((acc, m) => acc + (m.rating || 0), 0) / metrics.length).toFixed(1) : "0.0";

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Rider Performance Reports</h1>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Riders</CardTitle>
                        <Navigation className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.length}</div>
                        <p className="text-xs text-muted-foreground">With deliveries</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <Bike className="h-4 w-4 text-success" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalOrders.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Delivered successfully</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <Award className="h-4 w-4 text-warning" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">From deliveries</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-error" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgRating}</div>
                        <p className="text-xs text-muted-foreground">{totalFailed} failed attempts</p>
                    </CardContent>
                </Card>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Rider Name</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Orders</TableHead>
                            <TableHead>Failed</TableHead>
                            <TableHead>COD Collected</TableHead>
                            <TableHead>Revenue</TableHead>
                            <TableHead>Success Rate</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Score</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {metrics.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                                    No rider performance data available
                                </TableCell>
                            </TableRow>
                        ) : (
                            metrics.map((item, idx) => (
                                <TableRow key={item._id || idx}>
                                    <TableCell className="font-medium">{item.riderName || "Unknown"}</TableCell>
                                    <TableCell className="text-muted-foreground">{item.driverCode || "-"}</TableCell>
                                    <TableCell>{item.ordersCompleted}</TableCell>
                                    <TableCell className={item.failedAttempts > 0 ? "text-error font-medium" : "text-muted-foreground"}>
                                        {item.failedAttempts}
                                    </TableCell>
                                    <TableCell>₹{(item.codCollected || 0).toLocaleString()}</TableCell>
                                    <TableCell>₹{(item.revenue || 0).toLocaleString()}</TableCell>
                                    <TableCell>{item.successRate}%</TableCell>
                                    <TableCell>{item.rating || 0}</TableCell>
                                    <TableCell>
                                        <Badge variant={item.overallScore >= 80 ? 'success' : item.overallScore >= 60 ? 'secondary' : 'destructive'}>
                                            {item.overallScore}
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

export default RiderReports;
