"use client";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    CheckCircle,
    XCircle,
    AlertTriangle,
    ShieldCheck,
    FileText,
    UserCheck,
    Thermometer,
    Award,
    History
} from "lucide-react";

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

const QualityControl = () => {
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
            const msg = error?.response?.data?.message || "Failed to load quality metrics.";
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
    const totalClaims = stats?.totalClaims || 0;
    const totalApproved = stats?.totalApproved || 0;
    const totalRecovered = stats?.totalRecovered || 0;

    // Derived metrics
    const resolutionRate = total > 0 ? ((resolved / total) * 100) : 100;
    const criticalRate = total > 0 ? ((critical / total) * 100) : 0;
    const escalationRate = total > 0 ? ((escalated / total) * 100) : 0;
    const recoveryRate = totalClaims > 0 ? ((totalRecovered / totalClaims) * 100) : 0;
    const safetyScore = total > 0 ? Math.max(0, 100 - (criticalRate * 2)) : 100;

    const kpiCards = [
        {
            id: "resolution",
            metric: "Exception Resolution Rate",
            score: Math.round(resolutionRate),
            target: 95,
            status: resolutionRate >= 95 ? "pass" : resolutionRate >= 80 ? "warning" : "fail",
            lastChecked: new Date().toLocaleDateString(),
        },
        {
            id: "critical",
            metric: "Critical Issue Rate",
            score: Math.round(100 - criticalRate),
            target: 98,
            status: criticalRate <= 2 ? "pass" : criticalRate <= 5 ? "warning" : "fail",
            lastChecked: new Date().toLocaleDateString(),
        },
        {
            id: "escalation",
            metric: "Escalation Rate",
            score: Math.round(100 - escalationRate),
            target: 90,
            status: escalationRate <= 10 ? "pass" : escalationRate <= 20 ? "warning" : "fail",
            lastChecked: new Date().toLocaleDateString(),
        },
        {
            id: "recovery",
            metric: "Financial Recovery Rate",
            score: Math.round(recoveryRate),
            target: 80,
            status: recoveryRate >= 80 ? "pass" : recoveryRate >= 60 ? "warning" : "fail",
            lastChecked: new Date().toLocaleDateString(),
        },
    ];

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
                    <h1 className="text-2xl font-bold tracking-tight">Quality Assurance & Control</h1>
                    <p className="text-sm text-muted-foreground">Monitor compliance, audit scores, and operational standards.</p>
                </div>
                <Button className="gap-2" onClick={fetchStats}>
                    <History className="h-4 w-4" /> Refresh
                </Button>
            </div>

            {/* Top Scorecard */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-success shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Overall Safety Score</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-success" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{safetyScore.toFixed(1)}%</div>
                        <p className="text-xs text-muted-foreground mt-1">{critical} critical issues out of {total}</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-warning shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
                        <FileText className="h-4 w-4 text-warning" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{resolutionRate.toFixed(1)}%</div>
                        <p className="text-xs text-muted-foreground mt-1">{resolved} resolved out of {total}</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-primary shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Open Exceptions</CardTitle>
                        <UserCheck className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{open + investigating}</div>
                        <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500 shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Recovery Rate</CardTitle>
                        <Award className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{recoveryRate.toFixed(1)}%</div>
                        <p className="text-xs text-muted-foreground mt-1">₹{totalRecovered?.toLocaleString() || 0} recovered</p>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Metric Cards */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Key Performance Indicators (KPIs)</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {kpiCards.map(item => (
                        <Card key={item.id} className="relative overflow-hidden group hover:border-primary/50 transition-colors">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <CardTitle className="text-base font-medium">{item.metric}</CardTitle>
                                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                                            Last checked: {item.lastChecked}
                                        </div>
                                    </div>
                                    {item.status === 'pass' ? <CheckCircle className="text-success h-5 w-5" /> :
                                        item.status === 'fail' ? <XCircle className="text-error h-5 w-5" /> :
                                            <AlertTriangle className="text-warning h-5 w-5" />}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-foreground">{item.score}% Current</span>
                                        <span className="text-muted-foreground">Target: {item.target}%</span>
                                    </div>
                                    <Progress value={item.score} className={item.score >= item.target ? "bg-success/20 [&>*]:bg-success" : "bg-warning/20 [&>*]:bg-warning"} />
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t">
                                    <Badge variant={item.status === 'pass' ? 'outline' : item.status === 'fail' ? 'destructive' : 'secondary'} className={item.status === 'pass' ? 'border-success text-success' : ''}>
                                        {item.status.toUpperCase()}
                                    </Badge>
                                    <Button variant="ghost" size="sm" className="h-7 text-xs">Details</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Bottom Section: Recent Audits & Alerts */}
            <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Recent Exception Alerts</CardTitle>
                        <CardDescription>Latest critical and high-severity issues</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {(stats?.typeBreakdown || []).slice(0, 3).map((item: any, i: number) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
                                    <div className="flex items-start gap-3">
                                        <div className={`mt-1 h-2 w-2 rounded-full ${item.count > 5 ? 'bg-error' : item.count > 2 ? 'bg-warning' : 'bg-blue-500'}`} />
                                        <div>
                                            <p className="font-medium text-sm">{TYPE_LABELS[item.type] || item.type}</p>
                                            <p className="text-xs text-muted-foreground">{item.count} incidents reported</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant="outline" className="mb-1">{item.count > 5 ? 'High' : item.count > 2 ? 'Medium' : 'Low'} Risk</Badge>
                                    </div>
                                </div>
                            ))}
                            {(!stats?.typeBreakdown || stats.typeBreakdown.length === 0) && (
                                <p className="text-sm text-muted-foreground text-center py-4">No recent alerts.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                        <CardTitle className="text-primary flex items-center gap-2">
                            <Thermometer className="h-5 w-5" />
                            Financial Impact
                        </CardTitle>
                        <CardDescription>Claims and recovery summary</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-6">
                            <div className="text-4xl font-bold text-foreground">₹{(totalClaims || 0).toLocaleString()}</div>
                            <p className="text-sm text-green-600 font-medium mt-2 flex items-center justify-center gap-1">
                                <CheckCircle className="h-3 w-3" /> Total Claims
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Approved: ₹{(totalApproved || 0).toLocaleString()}</span>
                                <span>Recovered: ₹{(totalRecovered || 0).toLocaleString()}</span>
                            </div>
                            <Progress value={totalClaims > 0 ? (totalRecovered / totalClaims) * 100 : 0} className="h-2" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default QualityControl;
