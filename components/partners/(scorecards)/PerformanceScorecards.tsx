"use client";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Award, TrendingUp, AlertTriangle, CheckCircle, BarChart3, Search, X, MoreHorizontal, Eye, FileText, Download, Upload, TrendingDown, Loader2, RefreshCw } from "lucide-react";
import { ImportDialog } from "../../warehouse/(inventory)/ImportDialog";
import { ExportDialog } from "../../warehouse/(inventory)/ExportDialog";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

interface Scorecard {
    id: string;
    partnerCode: string;
    partnerName: string;
    overallScore: number;
    deliveryScore: number;
    qualityScore: number;
    customerRating: number;
    trend: "up" | "down" | "neutral";
    status: "excellent" | "good" | "poor";
}

interface ScorecardStat {
    title: string;
    value: string;
    change: string;
    trend: "up" | "down";
    icon: any;
    description: string;
}

const mapPartnerToScorecard = (p: any): Scorecard => {
    const rating = p.metrics?.rating ?? p.avgRating ?? 0;
    const totalShipments = p.metrics?.totalShipments ?? 0;
    const delivered = p.metrics?.deliveredShipments ?? 0;
    const deliveryRate = totalShipments > 0 ? Math.round((delivered / totalShipments) * 100) : 0;
    const overallScore = Math.round(rating * 20);
    const qualityScore = Math.min(100, Math.round(deliveryRate * 0.9 + rating * 2));

    let status: Scorecard["status"] = "poor";
    if (overallScore >= 90) status = "excellent";
    else if (overallScore >= 75) status = "good";

    return {
        id: p._id || p.id || "",
        partnerCode: p.partnerCode || "N/A",
        partnerName: p.companyName || p.name || "Unknown Partner",
        overallScore,
        deliveryScore: deliveryRate,
        qualityScore,
        customerRating: Math.round(rating * 10) / 10,
        trend: overallScore >= 80 ? "up" : overallScore < 60 ? "down" : "neutral",
        status,
    };
};

const PerformanceScorecards = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [scoreFilter, setScoreFilter] = useState("all-scores");
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [scorecards, setScorecards] = useState<Scorecard[]>([]);
    const [stats, setStats] = useState<ScorecardStat[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            const [partnersRes, statsRes] = await Promise.all([
                axios.get(`${API_BASE}/api/partners`, { headers }),
                axios.get(`${API_BASE}/api/partners/stats`, { headers }),
            ]);

            const partnerList = Array.isArray(partnersRes.data) ? partnersRes.data : [];
            const mapped = partnerList.map(mapPartnerToScorecard);
            setScorecards(mapped);

            const s = statsRes.data || {};
            const avgScore = mapped.length > 0 ? (mapped.reduce((sum, sc) => sum + sc.overallScore, 0) / mapped.length).toFixed(1) : "0";
            const topPerformers = mapped.filter((sc) => sc.overallScore >= 90).length;
            const needsImprovement = mapped.filter((sc) => sc.overallScore < 75).length;
            const complianceRate = mapped.length > 0 ? ((mapped.filter((sc) => sc.overallScore >= 75).length / mapped.length) * 100).toFixed(1) : "0";

            setStats([
                { title: "Avg Performance Score", value: String(avgScore), change: "+2.3", trend: "up", icon: Award, description: "Network average" },
                { title: "Top Performers", value: String(topPerformers), change: "+5", trend: "up", icon: TrendingUp, description: "Score ≥ 90" },
                { title: "Needs Improvement", value: String(needsImprovement), change: "-3", trend: "up", icon: AlertTriangle, description: "Score < 75" },
                { title: "Compliance Rate", value: `${complianceRate}%`, change: "+1.5%", trend: "up", icon: CheckCircle, description: "Meeting SLAs" },
            ]);
        } catch (error) {
            toast.error("Failed to load performance scorecards. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredData = scorecards.filter((sc) => {
        const matchesSearch = sc.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sc.partnerCode.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesScore = scoreFilter === "all-scores" ||
            (scoreFilter === "excellent" && sc.overallScore >= 90) ||
            (scoreFilter === "good" && sc.overallScore >= 75 && sc.overallScore < 90) ||
            (scoreFilter === "poor" && sc.overallScore < 75);
        return matchesSearch && matchesScore;
    });

    return (
        <div className="space-y-7">
            <section className="rounded-3xl border border-border/70 bg-card/95 p-7 shadow-card">
                <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-5">
                    <div className="space-y-3">
                        <Badge className="rounded-full bg-primary/15 px-4 py-1 text-primary">Performance Analytics</Badge>
                        <div className="space-y-2">
                            <h1 className="text-display-1 leading-tight">Performance Scorecards</h1>
                            <p className="max-w-2xl text-body">Track partner performance metrics. Monitor delivery quality, customer satisfaction, and compliance.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1">
                                <Award className="h-3.5 w-3.5 text-primary" />{stats[0]?.value || "0"} avg score
                            </span>
                            <span className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
                                <BarChart3 className="h-3.5 w-3.5 text-success" />{stats[3]?.value || "0%"} compliance
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                            <Button variant="outline" className="gap-2 rounded-lg border-border/70" onClick={fetchData} disabled={loading}>
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}Refresh
                            </Button>
                            <Button variant="outline" className="gap-2 rounded-lg border-border/70" onClick={() => setIsExportOpen(true)}>
                                <Download className="h-4 w-4" />Export Report
                            </Button>
                            <Button variant="outline" className="gap-2 rounded-lg border-border/70" onClick={() => setIsImportOpen(true)}>
                                <Upload className="h-4 w-4" />Import
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index} className="relative overflow-hidden rounded-2xl border-border/70 bg-card/95 shadow-card">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                    <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">{stat.value}</div>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <stat.icon className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${stat.trend === "up" ? "bg-success/15 text-success" : "bg-error/15 text-error"}`}>
                                    {stat.change}
                                </span>
                                <span className="text-xs text-muted-foreground">{stat.description}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="rounded-2xl border-border/70 bg-card/50 p-4 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="Search partners..." className="h-10 w-full rounded-xl bg-background/50 pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Select value={scoreFilter} onValueChange={setScoreFilter}>
                            <SelectTrigger className="h-10 w-[160px] rounded-xl">
                                <SelectValue placeholder="Score Range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-scores">All Scores</SelectItem>
                                <SelectItem value="excellent">Excellent (≥90)</SelectItem>
                                <SelectItem value="good">Good (75-89)</SelectItem>
                                <SelectItem value="poor">Poor (Below 75)</SelectItem>
                            </SelectContent>
                        </Select>
                        {(searchQuery || scoreFilter !== "all-scores") && (
                            <Button variant="ghost" size="icon" onClick={() => { setSearchQuery(""); setScoreFilter("all-scores"); }} className="h-10 w-10 rounded-xl">
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Performance Scorecards</CardTitle>
                    <p className="text-xs text-muted-foreground">Detailed performance metrics by partner</p>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[250px]">Partner Name</TableHead>
                                    <TableHead>Overall Score</TableHead>
                                    <TableHead>Delivery Score</TableHead>
                                    <TableHead>Quality Score</TableHead>
                                    <TableHead>Customer Rating</TableHead>
                                    <TableHead>Trend</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow><TableCell colSpan={7} className="h-24 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" /></TableCell></TableRow>
                                ) : filteredData.length === 0 ? (
                                    <TableRow><TableCell colSpan={7} className="h-24 text-center">No scorecards found.</TableCell></TableRow>
                                ) : (
                                    filteredData.map((sc) => (
                                        <TableRow key={sc.id} className="group hover:bg-muted/20">
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <p className="font-semibold text-foreground">{sc.partnerName}</p>
                                                    <p className="text-xs text-muted-foreground">{sc.partnerCode}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-2 w-24 overflow-hidden rounded-full bg-muted/40">
                                                        <div className={`h-full rounded-full ${sc.overallScore >= 90 ? "bg-success" : sc.overallScore >= 75 ? "bg-warning" : "bg-error"}`} style={{ width: `${sc.overallScore}%` }} />
                                                    </div>
                                                    <span className="text-sm font-semibold">{sc.overallScore}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell><span className="font-medium">{sc.deliveryScore}</span></TableCell>
                                            <TableCell><span className="font-medium">{sc.qualityScore}</span></TableCell>
                                            <TableCell><span className="font-medium">{sc.customerRating} / 5.0</span></TableCell>
                                            <TableCell>
                                                {sc.trend === "up" ? <TrendingUp className="h-4 w-4 text-success" /> : sc.trend === "down" ? <TrendingDown className="h-4 w-4 text-error" /> : <span className="text-muted-foreground">—</span>}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-lg"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-xl">
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg"><Eye className="h-4 w-4" />View Details</DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg"><FileText className="h-4 w-4" />Full Report</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <ImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} />
            <ExportDialog open={isExportOpen} onOpenChange={setIsExportOpen} />
        </div>
    );
};

export default PerformanceScorecards;
