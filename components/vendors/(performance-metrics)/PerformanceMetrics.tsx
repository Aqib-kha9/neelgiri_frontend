"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Award, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, BarChart3, Search, X, MoreHorizontal, Eye, FileText, Download, Upload } from "lucide-react";
import { ImportDialog } from "../../warehouse/(inventory)/ImportDialog";
import { ExportDialog } from "../../warehouse/(inventory)/ExportDialog";

const metricsStats = [
    { title: "Avg Performance", value: "87.5", change: "+3.2", trend: "up", icon: Award, description: "Network average" },
    { title: "Top Performers", value: "18", change: "+4", trend: "up", icon: TrendingUp, description: "Score ≥ 90" },
    { title: "Needs Improvement", value: "8", change: "-2", trend: "up", icon: AlertTriangle, description: "Score &lt; 75" },
    { title: "Compliance Rate", value: "94.8%", change: "+2.1%", trend: "up", icon: CheckCircle, description: "Meeting SLAs" },
];

const metricsData = [
    { id: "PM-001", vendorName: "Express Logistics", overallScore: 92, deliveryScore: 94, qualityScore: 90, reliabilityScore: 92, trend: "up", status: "excellent" },
    { id: "PM-002", vendorName: "TechFix Solutions", overallScore: 88, deliveryScore: 85, qualityScore: 90, reliabilityScore: 89, trend: "neutral", status: "good" },
    { id: "PM-003", vendorName: "CleanPro Services", overallScore: 95, deliveryScore: 96, qualityScore: 94, reliabilityScore: 95, trend: "up", status: "excellent" },
    { id: "PM-004", vendorName: "Swift Transport", overallScore: 85, deliveryScore: 83, qualityScore: 87, reliabilityScore: 85, trend: "neutral", status: "good" },
    { id: "PM-005", vendorName: "Fast Track Logistics", overallScore: 68, deliveryScore: 65, qualityScore: 70, reliabilityScore: 69, trend: "down", status: "poor" },
    { id: "PM-006", vendorName: "SecureGuard", overallScore: 91, deliveryScore: 89, qualityScore: 92, reliabilityScore: 92, trend: "up", status: "excellent" },
];

const PerformanceMetrics = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [scoreFilter, setScoreFilter] = useState("all-scores");
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);

    const filteredData = metricsData.filter((vendor) => {
        const matchesSearch = vendor.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesScore = scoreFilter === "all-scores" ||
            (scoreFilter === "excellent" && vendor.overallScore >= 90) ||
            (scoreFilter === "good" && vendor.overallScore >= 75 && vendor.overallScore < 90) ||
            (scoreFilter === "poor" && vendor.overallScore < 75);
        return matchesSearch && matchesScore;
    });

    return (
        <div className="space-y-7">
            <section className="rounded-3xl border border-border/70 bg-card/95 p-7 shadow-card">
                <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-5">
                    <div className="space-y-3">
                        <Badge className="rounded-full bg-primary/15 px-4 py-1 text-primary">Vendor Analytics</Badge>
                        <div className="space-y-2">
                            <h1 className="text-display-1 leading-tight">Performance Metrics</h1>
                            <p className="max-w-2xl text-body">Track vendor performance across all categories. Monitor delivery quality, reliability, and compliance metrics.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1">
                                <Award className="h-3.5 w-3.5 text-primary" />87.5 avg score
                            </span>
                            <span className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
                                <BarChart3 className="h-3.5 w-3.5 text-success" />94.8% compliance
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
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
                {metricsStats.map((stat, index) => (
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
                        <Input placeholder="Search vendors..." className="h-10 w-full rounded-xl bg-background/50 pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
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
                                <SelectItem value="poor">Poor (&lt;75)</SelectItem>
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
                    <CardTitle className="text-base font-semibold">Performance Metrics</CardTitle>
                    <p className="text-xs text-muted-foreground">Vendor performance scorecards</p>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[250px]">Vendor Name</TableHead>
                                    <TableHead>Overall Score</TableHead>
                                    <TableHead>Delivery Score</TableHead>
                                    <TableHead>Quality Score</TableHead>
                                    <TableHead>Reliability</TableHead>
                                    <TableHead>Trend</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.length === 0 ? (
                                    <TableRow><TableCell colSpan={7} className="h-24 text-center">No metrics found.</TableCell></TableRow>
                                ) : (
                                    filteredData.map((vendor) => (
                                        <TableRow key={vendor.id} className="group hover:bg-muted/20">
                                            <TableCell><p className="font-semibold text-foreground">{vendor.vendorName}</p></TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-2 w-24 overflow-hidden rounded-full bg-muted/40">
                                                        <div className={`h-full rounded-full ${vendor.overallScore >= 90 ? "bg-success" : vendor.overallScore >= 75 ? "bg-warning" : "bg-error"}`} style={{ width: `${vendor.overallScore}%` }} />
                                                    </div>
                                                    <span className="text-sm font-semibold">{vendor.overallScore}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell><span className="font-medium">{vendor.deliveryScore}</span></TableCell>
                                            <TableCell><span className="font-medium">{vendor.qualityScore}</span></TableCell>
                                            <TableCell><span className="font-medium">{vendor.reliabilityScore}</span></TableCell>
                                            <TableCell>
                                                {vendor.trend === "up" ? <TrendingUp className="h-4 w-4 text-success" /> : vendor.trend === "down" ? <TrendingDown className="h-4 w-4 text-error" /> : <span className="text-muted-foreground">—</span>}
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

export default PerformanceMetrics;
