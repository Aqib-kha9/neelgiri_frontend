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
import { FileText, Plus, Download, Upload, BarChart3, Search, X, MoreHorizontal, Eye, CheckCircle, XCircle, Loader2, RefreshCw, Clock, UserCheck, UserX, Users } from "lucide-react";
import { ImportDialog } from "../../warehouse/(inventory)/ImportDialog";
import { ExportDialog } from "../../warehouse/(inventory)/ExportDialog";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

interface OnboardingApp {
    id: string;
    applicantName: string;
    businessName: string;
    businessType: string;
    location: string;
    applicationDate: string;
    status: string;
    assignedTo: string;
}

interface OnboardingStat {
    title: string;
    value: string;
    change: string;
    trend: "up" | "down";
    icon: any;
    description: string;
}

const mapPartnerToOnboarding = (p: any): OnboardingApp => {
    const statusMap: Record<string, string> = {
        PENDING: "pending",
        ACTIVE: "approved",
        SUSPENDED: "in-review",
        TERMINATED: "rejected",
    };
    return {
        id: p._id || p.id || "",
        applicantName: p.contactPerson || p.userId?.name || "Unknown",
        businessName: p.companyName || "Unknown Business",
        businessType: p.type || "retail",
        location: p.address?.city ? `${p.address.city}, ${p.address.state || ""}` : "—",
        applicationDate: p.createdAt || p.agreementStartDate || new Date().toISOString(),
        status: statusMap[p.status] || "pending",
        assignedTo: p.createdBy?.name || p.createdBy?.email || "—",
    };
};

const PartnerOnboarding = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all-status");
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [applications, setApplications] = useState<OnboardingApp[]>([]);
    const [stats, setStats] = useState<OnboardingStat[]>([]);
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
            const mapped = partnerList.map(mapPartnerToOnboarding);
            setApplications(mapped);

            const s = statsRes.data || {};
            const pending = (s.pending || 0) + (s.suspended || 0);
            const approved = s.active || 0;
            const rejected = s.terminated || 0;
            const total = s.total || 0;

            setStats([
                { title: "Total Applications", value: String(total), change: "+5", trend: "up", icon: Users, description: "All time" },
                { title: "Pending Review", value: String(pending), change: "+3", trend: "down", icon: Clock, description: "Awaiting review" },
                { title: "Approved", value: String(approved), change: "+2", trend: "up", icon: UserCheck, description: "Active partners" },
                { title: "Rejected", value: String(rejected), change: "0", trend: "up", icon: UserX, description: "Terminated" },
            ]);
        } catch (error) {
            toast.error("Failed to load onboarding applications. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleApprove = async (partnerId: string) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `${API_BASE}/api/partners/${partnerId}`,
                { status: "ACTIVE" },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Partner application approved!");
            fetchData();
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Failed to approve partner";
            toast.error(msg);
        }
    };

    const handleReject = async (partnerId: string) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `${API_BASE}/api/partners/${partnerId}`,
                { status: "TERMINATED" },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Partner application rejected.");
            fetchData();
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Failed to reject partner";
            toast.error(msg);
        }
    };

    const filteredData = applications.filter((app) => {
        const matchesSearch =
            app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.businessName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all-status" || app.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-7">
            {/* Header */}
            <section className="rounded-3xl border border-border/70 bg-card/95 p-7 shadow-card">
                <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-5">
                    <div className="space-y-3">
                        <Badge className="rounded-full bg-primary/15 px-4 py-1 text-primary">Partner Onboarding</Badge>
                        <div className="space-y-2">
                            <h1 className="text-display-1 leading-tight">Partner Onboarding</h1>
                            <p className="max-w-2xl text-body">Review and process new partner applications. Streamline onboarding workflow.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1">
                                <FileText className="h-3.5 w-3.5 text-primary" />{stats[1]?.value || 0} pending
                            </span>
                            <span className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
                                <BarChart3 className="h-3.5 w-3.5 text-success" />{stats[0]?.value || 0} total
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                            <Button variant="outline" className="gap-2 rounded-lg border-border/70" onClick={fetchData} disabled={loading}>
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}Refresh
                            </Button>
                            <Button variant="outline" className="gap-2 rounded-lg border-border/70" onClick={() => setIsExportOpen(true)}>
                                <Download className="h-4 w-4" />Export
                            </Button>
                            <Button variant="outline" className="gap-2 rounded-lg border-border/70" onClick={() => setIsImportOpen(true)}>
                                <Upload className="h-4 w-4" />Import
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
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

            {/* Filters */}
            <Card className="rounded-2xl border-border/70 bg-card/50 p-4 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="Search applications..." className="h-10 w-full rounded-xl bg-background/50 pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="h-10 w-[160px] rounded-xl">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-status">All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in-review">In Review</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                        {(searchQuery || statusFilter !== "all-status") && (
                            <Button variant="ghost" size="icon" onClick={() => { setSearchQuery(""); setStatusFilter("all-status"); }} className="h-10 w-10 rounded-xl">
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            {/* Table */}
            <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Applications</CardTitle>
                    <p className="text-xs text-muted-foreground">Partner onboarding applications</p>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[250px]">Applicant</TableHead>
                                    <TableHead>Business Type</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Application Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Assigned To</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow><TableCell colSpan={7} className="h-24 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" /></TableCell></TableRow>
                                ) : filteredData.length === 0 ? (
                                    <TableRow><TableCell colSpan={7} className="h-24 text-center">No applications found.</TableCell></TableRow>
                                ) : (
                                    filteredData.map((app) => (
                                        <TableRow key={app.id} className="group hover:bg-muted/20">
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <p className="font-semibold text-foreground">{app.applicantName}</p>
                                                    <p className="text-xs text-muted-foreground">{app.businessName}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell><Badge variant="secondary" className="rounded-full text-xs capitalize">{app.businessType}</Badge></TableCell>
                                            <TableCell><div className="text-sm">{app.location}</div></TableCell>
                                            <TableCell><span className="text-sm">{new Date(app.applicationDate).toLocaleDateString("en-IN")}</span></TableCell>
                                            <TableCell>
                                                <Badge variant={app.status === "approved" ? "success" : app.status === "rejected" ? "error" : app.status === "in-review" ? "warning" : "secondary"} className="rounded-full">
                                                    {app.status === "approved" ? "Approved" : app.status === "rejected" ? "Rejected" : app.status === "in-review" ? "In Review" : "Pending"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell><span className="text-sm">{app.assignedTo}</span></TableCell>
                                            <TableCell>
                                                <div className="flex justify-end">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-lg"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-xl">
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg"><Eye className="h-4 w-4" />View Details</DropdownMenuItem>
                                                            {app.status === "pending" && <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-success" onClick={() => handleApprove(app.id)}><CheckCircle className="h-4 w-4" />Approve</DropdownMenuItem>}
                                                            {app.status === "pending" && <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-error" onClick={() => handleReject(app.id)}><XCircle className="h-4 w-4" />Reject</DropdownMenuItem>}
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

export default PartnerOnboarding;
