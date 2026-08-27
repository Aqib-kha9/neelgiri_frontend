"use client";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Minus, ArrowUpRight } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

const TYPE_LABELS: Record<string, string> = {
    DAMAGED: "Package Damaged",
    LOST: "Lost Shipment",
    PILFERAGE: "Pilferage",
    SHORT_DELIVERY: "Short Delivery",
    WRONG_DELIVERY: "Wrong Delivery",
    ADDRESS_ISSUE: "Address Issue",
    WEIGHT_DISCREPANCY: "Weight Discrepancy",
    PAYMENT_ISSUE: "Payment Issue",
    DELAY: "Late Delivery",
    REFUSED: "Customer Refused",
    OTHER: "Other",
};

const CHART_COLORS = [
    "bg-blue-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-slate-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
];

const RootCauseAnalysis = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            const res = await axios.get(`${API_BASE}/api/exceptions/stats`, { headers });
            setStats(res.data);
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Failed to load root cause analysis.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const total = stats?.total || 0;
    const resolved = stats?.resolved || 0;
    const open = stats?.open || 0;
    const investigating = stats?.investigating || 0;
    const critical = stats?.critical || 0;
    const high = stats?.high || 0;
    const escalated = stats?.escalated || 0;

    const typeBreakdown = stats?.typeBreakdown || [];
    const maxCount = typeBreakdown.length > 0 ? Math.max(...typeBreakdown.map((t: any) => t.count)) : 1;

    // Build distribution data from typeBreakdown
    const distributionData = typeBreakdown.map((item: any, i: number) => ({
        name: TYPE_LABELS[item.type] || item.type,
        value: item.count,
        color: CHART_COLORS[i % CHART_COLORS.length],
        percentage: total > 0 ? Math.round((item.count / total) * 100) : 0,
    })).sort((a: any, b: any) => b.value - a.value);

    // Top failure reason
    const topFailure = distributionData[0] || { name: "N/A", percentage: 0 };

    // Build RCA table data from typeBreakdown
    const rcaTableData = typeBreakdown.map((item: any, i: number) => ({
        id: i,
        category: TYPE_LABELS[item.type] || item.type,
        issue: `${item.type} related incidents`,
        frequency: item.count,
        impact: item.count > 5 ? "High" : item.count > 2 ? "Medium" : "Low",
        trend: i < typeBreakdown.length / 2 ? "up" : "down",
    }));

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Root Cause Analysis</h1>
                    <p className="text-sm text-muted-foreground">Deep dive into delivery failure reasons and impact analysis.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchStats}>Refresh</Button>
                </div>
            </div>

            {/* Top Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="bg-gradient-to-br from-red-50 to-white dark:from-red-950/20 dark:to-background border-red-100 dark:border-red-900/20">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-red-600 dark:text-red-400 font-medium">Top Failure Reason</CardDescription>
                        <CardTitle className="text-2xl">{topFailure.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <ArrowUpRight className="h-4 w-4 text-red-500" />
                            <span className="font-medium text-foreground">{topFailure.percentage}%</span> of all failures
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Incidents</CardDescription>
                        <CardTitle className="text-2xl">{total.toLocaleString()}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-sm text-green-600">
                            <TrendingDown className="h-4 w-4" />
                            <span>{resolved} resolved</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Critical & High</CardDescription>
                        <CardTitle className="text-2xl">{critical + high}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-sm text-yellow-600">
                            <TrendingUp className="h-4 w-4" />
                            <span>{escalated} escalated</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Open Issues</CardDescription>
                        <CardTitle className="text-2xl">{open + investigating}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">Awaiting resolution</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Visual Chart - Distribution */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Failure Distribution (Pareto)</CardTitle>
                        <CardDescription>Primary contributors to delivery exceptions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] w-full flex items-end gap-6 p-4 border rounded-xl bg-muted/10">
                            {distributionData.length === 0 ? (
                                <div className="w-full text-center text-muted-foreground py-8">No data available</div>
                            ) : (
                                distributionData.map((item: any) => (
                                    <div key={item.name} className="flex-1 flex flex-col items-center gap-2 group">
                                        <div className="relative w-full flex justify-center">
                                            <div
                                                className={`w-full max-w-[60px] rounded-t-lg transition-all duration-300 group-hover:opacity-80 ${item.color}`}
                                                style={{ height: `${(item.value / maxCount) * 200}px` }}
                                            />
                                            <div className="absolute -top-8 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                {item.value} ({item.percentage}%)
                                            </div>
                                        </div>
                                        <span className="text-xs font-medium text-center text-muted-foreground line-clamp-1">{item.name}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Impact By Type */}
                <Card>
                    <CardHeader>
                        <CardTitle>Impact by Type</CardTitle>
                        <CardDescription>Exception count by category</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {distributionData.slice(0, 5).map((item: any, i: number) => (
                            <div key={i} className="space-y-1">
                                <div className="flex justify-between text-sm font-medium">
                                    <span>{item.name}</span>
                                    <span>{item.value} incidents</span>
                                </div>
                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                    <div className={`h-full ${item.color}`} style={{ width: `${(item.value / maxCount) * 100}%` }} />
                                </div>
                            </div>
                        ))}
                        {distributionData.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-4">No data available</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Table */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Detailed Causalty Report</CardTitle>
                        <CardDescription>Deep dive into specific failure categories.</CardDescription>
                    </div>
                    <Tabs defaultValue="all" className="w-[400px]">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="process">Process</TabsTrigger>
                            <TabsTrigger value="tech">Tech</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Category</TableHead>
                                <TableHead>Specific Issue</TableHead>
                                <TableHead className="text-right">Frequency</TableHead>
                                <TableHead className="text-center">Impact Level</TableHead>
                                <TableHead className="text-center">Trend</TableHead>
                                <TableHead className="text-right">Action Plan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rcaTableData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No root cause data available.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                rcaTableData.map((item: any) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.category}</TableCell>
                                        <TableCell>{item.issue}</TableCell>
                                        <TableCell className="text-right font-mono">{item.frequency}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={item.impact === 'High' ? 'destructive' : 'secondary'} className="w-20 justify-center">
                                                {item.impact}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center flex justify-center py-4">
                                            {item.trend === 'up' ? <TrendingUp className="text-red-500 h-4 w-4" /> :
                                                item.trend === 'down' ? <TrendingDown className="text-green-500 h-4 w-4" /> :
                                                    <Minus className="text-muted-foreground h-4 w-4" />}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="link" size="sm" className="h-auto p-0 text-primary">View Plan</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default RootCauseAnalysis;
