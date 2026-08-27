"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, AlertTriangle, CheckCircle, RefreshCw, Zap, TrendingDown, Loader2 } from "lucide-react";
import { slaApi, type SLADashboard } from "@/lib/api-services";
import { toast } from "sonner";

const SLAMonitoring = () => {
    const [dashboard, setDashboard] = useState<SLADashboard | null>(null);
    const [approaching, setApproaching] = useState<any[]>([]);
    const [breached, setBreached] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [checking, setChecking] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [dashRes, apprRes, breachRes] = await Promise.all([
                slaApi.dashboard().catch(() => null),
                slaApi.approaching().catch(() => ({ data: [] })),
                slaApi.breached().catch(() => ({ data: [] })),
            ]);
            setDashboard(dashRes);
            setApproaching(apprRes.data || []);
            setBreached(breachRes.data || []);
        } catch (error) {
            console.error("Failed to fetch SLA data:", error);
            toast.error("Failed to load SLA data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleBreachCheck = async () => {
        setChecking(true);
        try {
            const result = await slaApi.triggerBreachCheck();
            toast.success(`Breach check complete: ${result.checked} checked, ${result.breached} newly breached`);
            fetchData();
        } catch (error: any) {
            toast.error(error.message || "Failed to run breach check");
        } finally {
            setChecking(false);
        }
    };

    const slaStats = [
        { title: "Total Shipments", value: String(dashboard?.total || 0), icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
        { title: "On Track", value: String(dashboard?.onTrack || 0), icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
        { title: "Approaching Deadline", value: String(dashboard?.approaching || 0), icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-50" },
        { title: "Breached", value: String(dashboard?.breached || 0), icon: TrendingDown, color: "text-red-600", bg: "bg-red-50" },
    ];

    return (
        <div className="space-y-7">
            <section className="rounded-3xl border border-border/70 bg-card/95 p-7 shadow-card">
                <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-5">
                    <div className="space-y-3">
                        <Badge className="rounded-full bg-primary/15 px-4 py-1 text-primary">SLA / TAT Monitoring</Badge>
                        <div className="space-y-2">
                            <h1 className="text-display-1 leading-tight">SLA Monitoring Dashboard</h1>
                            <p className="max-w-2xl text-body">Monitor Service Level Agreement compliance. Track shipments approaching deadline and those that have breached SLA.</p>
                        </div>
                        {dashboard && (
                            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1">
                                    <TrendingDown className="h-3.5 w-3.5 text-error" />
                                    {dashboard.breachedPercentage?.toFixed(1) || 0}% breach rate
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button className="gap-2 rounded-lg bg-primary text-primary-foreground shadow-brand" onClick={handleBreachCheck} disabled={checking}>
                            {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                            Run Breach Check
                        </Button>
                        <Button variant="outline" className="gap-2 rounded-lg border-border/70" onClick={fetchData}>
                            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />Refresh
                        </Button>
                    </div>
                </div>
            </section>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {slaStats.map((stat, index) => (
                    <Card key={index} className="rounded-2xl border-border/70 bg-card/95 shadow-card">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                    <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">{stat.value}</div>
                                </div>
                                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
                                    <stat.icon className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Tabs defaultValue="approaching" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="approaching" className="gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Approaching ({approaching.length})
                    </TabsTrigger>
                    <TabsTrigger value="breached" className="gap-2">
                        <TrendingDown className="h-4 w-4" />
                        Breached ({breached.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="approaching" className="mt-6">
                    <Card>
                        <CardHeader className="bg-muted/50">
                            <CardTitle className="text-lg">Approaching SLA Deadline</CardTitle>
                            <p className="text-xs text-muted-foreground">Shipments within 4 hours of SLA breach</p>
                        </CardHeader>
                        <CardContent className="p-0">
                            {loading ? (
                                <div className="text-center py-20 text-muted-foreground animate-pulse">Loading...</div>
                            ) : approaching.length === 0 ? (
                                <div className="text-center py-20 text-muted-foreground">
                                    <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No shipments approaching deadline</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>AWB</TableHead>
                                            <TableHead>Service Type</TableHead>
                                            <TableHead>SLA Deadline</TableHead>
                                            <TableHead>Time Remaining</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {approaching.map((s, i) => (
                                            <TableRow key={s._id || i}>
                                                <TableCell className="font-mono font-medium text-primary">{s.awb}</TableCell>
                                                <TableCell><Badge variant="outline">{s.serviceType || "—"}</Badge></TableCell>
                                                <TableCell>{s.slaDeadline ? new Date(s.slaDeadline).toLocaleString("en-IN") : "—"}</TableCell>
                                                <TableCell><Badge variant="warning">Approaching</Badge></TableCell>
                                                <TableCell><Badge variant="secondary">{s.status}</Badge></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="breached" className="mt-6">
                    <Card>
                        <CardHeader className="bg-muted/50">
                            <CardTitle className="text-lg">SLA Breached Shipments</CardTitle>
                            <p className="text-xs text-muted-foreground">Shipments that have exceeded their SLA deadline</p>
                        </CardHeader>
                        <CardContent className="p-0">
                            {loading ? (
                                <div className="text-center py-20 text-muted-foreground animate-pulse">Loading...</div>
                            ) : breached.length === 0 ? (
                                <div className="text-center py-20 text-muted-foreground">
                                    <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No breached shipments</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>AWB</TableHead>
                                            <TableHead>Service Type</TableHead>
                                            <TableHead>SLA Deadline</TableHead>
                                            <TableHead>Breached At</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {breached.map((s, i) => (
                                            <TableRow key={s._id || i} className="bg-red-50/50">
                                                <TableCell className="font-mono font-medium text-primary">{s.awb}</TableCell>
                                                <TableCell><Badge variant="outline">{s.serviceType || "—"}</Badge></TableCell>
                                                <TableCell>{s.slaDeadline ? new Date(s.slaDeadline).toLocaleString("en-IN") : "—"}</TableCell>
                                                <TableCell>{s.slaBreachedAt ? new Date(s.slaBreachedAt).toLocaleString("en-IN") : "—"}</TableCell>
                                                <TableCell><Badge variant="error">Breached</Badge></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default SLAMonitoring;
