"use client";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Star, Loader2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

interface PartnerMetric {
    _id: string;
    partnerName: string;
    partnerCode: string;
    totalOrders: number;
    delivered: number;
    failed: number;
    revenue: number;
    deliverySuccessRate: number;
    rating: number;
    status: string;
    location: string;
}

const PartnerPerformance = () => {
    const [metrics, setMetrics] = useState<PartnerMetric[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${API_BASE}/api/reports/partner-performance`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMetrics(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load partner performance", error);
            toast.error("Failed to load partner performance data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const activePartners = metrics.filter((m) => m.status === "active").length;
    const avgSuccessRate = metrics.length
        ? Math.round(metrics.reduce((acc, m) => acc + (m.deliverySuccessRate || 0), 0) / metrics.length)
        : 0;
    const avgRating = metrics.length
        ? (metrics.reduce((acc, m) => acc + (m.rating || 0), 0) / metrics.length).toFixed(1)
        : "0.0";
    const totalOrders = metrics.reduce((acc, m) => acc + (m.totalOrders || 0), 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Partner Performance</h1>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Partners</CardTitle>
                        <Users className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activePartners}</div>
                        <p className="text-xs text-muted-foreground">{metrics.length} total partners</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Success Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-success" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgSuccessRate}%</div>
                        <p className="text-xs text-muted-foreground">Across all partners</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalOrders.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">All time</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
                        <Star className="h-4 w-4 text-warning" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgRating}</div>
                        <p className="text-xs text-muted-foreground">Customer rated</p>
                    </CardContent>
                </Card>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Partner Name</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Total Orders</TableHead>
                            <TableHead>Delivered</TableHead>
                            <TableHead>Failed</TableHead>
                            <TableHead>Success Rate</TableHead>
                            <TableHead>Revenue</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {metrics.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                                    No partner performance data available
                                </TableCell>
                            </TableRow>
                        ) : (
                            metrics.map((item, idx) => (
                                <TableRow key={item._id || idx}>
                                    <TableCell className="font-medium">{item.partnerName || "—"}</TableCell>
                                    <TableCell className="text-muted-foreground">{item.partnerCode || "—"}</TableCell>
                                    <TableCell>{item.location || "—"}</TableCell>
                                    <TableCell>{item.totalOrders || 0}</TableCell>
                                    <TableCell className="text-success">{item.delivered || 0}</TableCell>
                                    <TableCell className="text-error">{item.failed || 0}</TableCell>
                                    <TableCell>
                                        <span className={item.deliverySuccessRate < 90 ? "text-error" : "text-success"}>
                                            {item.deliverySuccessRate || 0}%
                                        </span>
                                    </TableCell>
                                    <TableCell>₹{(item.revenue || 0).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Star className="h-3 w-3 fill-warning text-warning" />
                                            {item.rating?.toFixed(1) || "—"}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={item.status === "active" ? "success" : "secondary"}>
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

export default PartnerPerformance;
