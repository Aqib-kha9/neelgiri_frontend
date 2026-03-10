"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Award, TrendingUp, AlertTriangle, CheckCircle, BarChart3, Search, X, MoreHorizontal, Eye, FileText, Download, Upload, TrendingDown } from "lucide-react";
import { ImportDialog } from "../../warehouse/(inventory)/ImportDialog";
import { ExportDialog } from "../../warehouse/(inventory)/ExportDialog";

const scorecardStats = [
    { title: "Avg Performance Score", value: "89.5", change: "+2.3", trend: "up", icon: Award, description: "Network average" },
    { title: "Top Performers", value: "42", change: "+5", trend: "up", icon: TrendingUp, description: "Score ≥ 90" },
    { title: "Needs Improvement", value: "15", change: "-3", trend: "up", icon: AlertTriangle, description: "Score < 75" },
    { title: "Compliance Rate", value: "96.2%", change: "+1.5%", trend: "up", icon: CheckCircle, description: "Meeting SLAs" },
];

const scorecardData = [
    { id: "SC-001", partnerName: "Spice Garden Restaurant", overallScore: 94, deliveryScore: 96, qualityScore: 92, customerRating: 4.7, trend: "up", status: "excellent" },
    { id: "SC-002", partnerName: "FreshMart Grocery", overallScore: 88, deliveryScore: 85, qualityScore: 90, customerRating: 4.5, trend: "neutral", status: "good" },
    { id: "SC-003", partnerName: "HealthPlus Pharmacy", overallScore: 96, deliveryScore: 98, qualityScore: 95, customerRating: 4.9, trend: "up", status: "excellent" },
    { id: "SC-004", partnerName: "Burger King Express", overallScore: 92, deliveryScore: 90, qualityScore: 93, customerRating: 4.6, trend: "up", status: "excellent" },
    { id: "SC-005", partnerName: "Daily Needs Store", overallScore: 65, deliveryScore: 60, qualityScore: 70, customerRating: 3.8, trend: "down", status: "poor" },
    { id: "SC-006", partnerName: "MediCare Plus", overallScore: 91, deliveryScore: 89, qualityScore: 92, customerRating: 4.7, trend: "up", status: "excellent" },
    { id: "SC-007", partnerName: "Pizza Paradise", overallScore: 89, deliveryScore: 87, qualityScore: 90, customerRating: 4.4, trend: "neutral", status: "good" },
];

const PerformanceScorecards = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [scoreFilter, setScoreFilter] = useState("all-scores");
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);

    const filteredData = scorecardData.filter((sc) => {
        const matchesSearch = sc.partnerName.toLowerCase().includes(searchQuery.toLowerCase());
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
                                <Award className="h-3.5 w-3.5 text-primary" />89.5 avg score
                            </span>
                            <span className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
                                <BarChart3 className="h-3.5 w-3.5 text-success" />96.2% compliance
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
                {scorecardStats.map((stat, index) => (
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
                                {filteredData.length === 0 ? (
                                    <TableRow><TableCell colSpan={7} className="h-24 text-center">No scorecards found.</TableCell></TableRow>
                                ) : (
                                    filteredData.map((sc) => (
                                        <TableRow key={sc.id} className="group hover:bg-muted/20">
                                            <TableCell><p className="font-semibold text-foreground">{sc.partnerName}</p></TableCell>
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
