"use client";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingUp, AlertTriangle, Target, Loader2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

interface DashboardData {
    shipments?: {
        total?: number;
        delivered?: number;
        pending?: number;
        cancelled?: number;
        rto?: number;
        inTransit?: number;
    };
    revenue?: {
        totalRevenue?: number;
        codCollected?: number;
        onlinePayments?: number;
        pendingCod?: number;
    };
    exceptions?: {
        total?: number;
        open?: number;
        resolved?: number;
    };
    pod?: {
        total?: number;
        received?: number;
        pending?: number;
    };
}

interface BIInsight {
    id: string;
    category: string;
    impact: string;
    insight: string;
    recommendation: string;
}

const BIReports = () => {
    const [insights, setInsights] = useState<BIInsight[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${API_BASE}/api/reports/dashboard`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const generatedInsights = generateInsights(data as DashboardData);
            setInsights(generatedInsights);
        } catch (error) {
            console.error("Failed to load BI insights", error);
            toast.error("Failed to load business intelligence data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Business Intelligence</h1>
            <p className="text-muted-foreground">AI-driven insights and strategic recommendations.</p>

            {insights.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        No insights available. Generate more shipment data to unlock BI recommendations.
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    {insights.map((item) => (
                        <Card key={item.id} className="relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-1 h-full ${item.impact === "High" ? "bg-error" : item.impact === "Medium" ? "bg-warning" : "bg-primary"}`} />
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        {item.category === "Growth" ? <TrendingUp className="h-5 w-5 text-success" /> :
                                            item.category === "Efficiency" ? <Target className="h-5 w-5 text-primary" /> :
                                                item.category === "Risk" ? <AlertTriangle className="h-5 w-5 text-error" /> :
                                                    <Lightbulb className="h-5 w-5 text-warning" />}
                                        <CardTitle className="text-lg">{item.category} Insight</CardTitle>
                                    </div>
                                    <Badge variant={item.impact === "High" ? "destructive" : "secondary"}>{item.impact} Impact</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="font-medium text-lg mb-2">{item.insight}</p>
                                <div className="bg-muted p-3 rounded-lg mt-4">
                                    <p className="text-sm text-foreground font-semibold mb-1">Recommendation:</p>
                                    <p className="text-sm text-muted-foreground">{item.recommendation}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

function generateInsights(data: DashboardData): BIInsight[] {
    const insights: BIInsight[] = [];

    const shipments = data.shipments || {};
    const revenue = data.revenue || {};
    const exceptions = data.exceptions || {};
    const pod = data.pod || {};

    const totalShipments = shipments.total || 0;
    const delivered = shipments.delivered || 0;
    const rto = shipments.rto || 0;
    const pending = shipments.pending || 0;
    const inTransit = shipments.inTransit || 0;

    const deliveryRate = totalShipments > 0 ? (delivered / totalShipments) * 100 : 0;
    const rtoRate = totalShipments > 0 ? (rto / totalShipments) * 100 : 0;

    // Delivery efficiency insight
    if (totalShipments > 0) {
        if (deliveryRate >= 90) {
            insights.push({
                id: "delivery-eff",
                category: "Efficiency",
                impact: "Low",
                insight: `Delivery success rate is strong at ${deliveryRate.toFixed(1)}% across ${totalShipments} shipments.`,
                recommendation: "Maintain current operational standards. Consider scaling capacity to handle increased volume.",
            });
        } else if (deliveryRate >= 70) {
            insights.push({
                id: "delivery-eff",
                category: "Efficiency",
                impact: "Medium",
                insight: `Delivery success rate is ${deliveryRate.toFixed(1)}%, below the 90% industry benchmark.`,
                recommendation: "Investigate bottleneck branches and riders. Implement route optimization and rider performance reviews.",
            });
        } else {
            insights.push({
                id: "delivery-eff",
                category: "Efficiency",
                impact: "High",
                insight: `Critical: Delivery success rate is only ${deliveryRate.toFixed(1)}%. Immediate intervention required.`,
                recommendation: "Conduct emergency review of failed deliveries. Check rider allocation, address quality, and exception handling processes.",
            });
        }
    }

    // RTO risk insight
    if (rtoRate > 10) {
        insights.push({
            id: "rto-risk",
            category: "Risk",
            impact: rtoRate > 20 ? "High" : "Medium",
            insight: `RTO rate is ${rtoRate.toFixed(1)}%, indicating ${rto} returned shipments out of ${totalShipments}.`,
            recommendation: "Implement address verification at booking. Add customer confirmation calls for high-value COD shipments.",
        });
    }

    // Revenue insight
    const totalRevenue = revenue.totalRevenue || 0;
    const pendingCod = revenue.pendingCod || 0;
    if (totalRevenue > 0 && pendingCod > 0) {
        const pendingPct = (pendingCod / totalRevenue) * 100;
        if (pendingPct > 30) {
            insights.push({
                id: "revenue-risk",
                category: "Risk",
                impact: "High",
                insight: `₹${pendingCod.toLocaleString()} in pending COD represents ${pendingPct.toFixed(1)}% of total revenue.`,
                recommendation: "Accelerate COD collection cycles. Deploy additional riders for COD-heavy zones and implement daily settlement tracking.",
            });
        }
    }

    // Exception handling insight
    const totalExceptions = exceptions.total || 0;
    const openExceptions = exceptions.open || 0;
    if (totalExceptions > 0) {
        const openPct = (openExceptions / totalExceptions) * 100;
        if (openPct > 50) {
            insights.push({
                id: "exception-risk",
                category: "Risk",
                impact: "Medium",
                insight: `${openExceptions} out of ${totalExceptions} exceptions are unresolved (${openPct.toFixed(1)}% open).`,
                recommendation: "Assign dedicated exception resolution team. Set SLA of 24 hours for exception closure.",
            });
        }
    }

    // POD compliance insight
    const totalPod = pod.total || 0;
    const pendingPod = pod.pending || 0;
    if (totalPod > 0 && pendingPod > 0) {
        const podPendingPct = (pendingPod / totalPod) * 100;
        if (podPendingPct > 20) {
            insights.push({
                id: "pod-risk",
                category: "Efficiency",
                impact: "Medium",
                insight: `${pendingPod} PODs pending out of ${totalPod} (${podPendingPct.toFixed(1)}% pending).`,
                recommendation: "Implement digital POD collection via rider app. Set daily POD submission targets for riders.",
            });
        }
    }

    // Growth insight
    if (totalShipments > 0 && delivered > 0) {
        insights.push({
            id: "growth-insight",
            category: "Growth",
            impact: "Low",
            insight: `${delivered} shipments successfully delivered with ${inTransit} currently in transit.`,
            recommendation: "Leverage delivery data to identify high-demand zones for capacity expansion and partner onboarding.",
        });
    }

    return insights;
}

export default BIReports;
