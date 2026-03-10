"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserPlus, Download, Upload, BarChart3, Search, X, MoreHorizontal, Eye, CheckCircle, XCircle, FileText, Clock, TrendingUp } from "lucide-react";
import { ImportDialog } from "../../warehouse/(inventory)/ImportDialog";
import { ExportDialog } from "../../warehouse/(inventory)/ExportDialog";

const onboardingStats = [
    { title: "Pending Applications", value: "24", change: "+8", trend: "down", icon: FileText, description: "Awaiting review" },
    { title: "In Review", value: "15", change: "+5", trend: "neutral", icon: Clock, description: "Being processed" },
    { title: "Approved Today", value: "7", change: "+3", trend: "up", icon: CheckCircle, description: "Ready to onboard" },
    { title: "Avg Processing Time", value: "2.8 days", change: "-0.4", trend: "up", icon: TrendingUp, description: "Faster processing" },
];

const onboardingData = [
    { id: "ONB-001", applicantName: "Rajesh Patel", companyName: "Patel Enterprises", industry: "Manufacturing", location: "Ahmedabad", applicationDate: "2024-12-20", status: "pending", assignedTo: "Unassigned", phone: "+91 98765 11111", email: "rajesh@patelent.com", documents: 4 },
    { id: "ONB-002", applicantName: "Sneha Reddy", companyName: "Reddy Logistics", industry: "Logistics", location: "Hyderabad", applicationDate: "2024-12-18", status: "in-review", assignedTo: "Amit Kumar", phone: "+91 98765 22222", email: "sneha@reddylog.com", documents: 6 },
    { id: "ONB-003", applicantName: "Karan Malhotra", companyName: "Malhotra Foods", industry: "Food & Beverage", location: "Chandigarh", applicationDate: "2024-12-15", status: "approved", assignedTo: "Priya Sharma", phone: "+91 98765 33333", email: "karan@malhotrafoods.com", documents: 5 },
    { id: "ONB-004", applicantName: "Anjali Desai", companyName: "Desai Textiles", industry: "Textile", location: "Surat", applicationDate: "2024-12-22", status: "pending", assignedTo: "Unassigned", phone: "+91 98765 44444", email: "anjali@desaitex.com", documents: 3 },
    { id: "ONB-005", applicantName: "Rohit Kapoor", companyName: "Kapoor Electronics", industry: "Electronics", location: "Delhi", applicationDate: "2024-12-19", status: "rejected", assignedTo: "Vikram Singh", phone: "+91 98765 55555", email: "rohit@kapoorelec.com", documents: 2 },
];

const CustomerOnboarding = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all-status");
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);

    const filteredData = onboardingData.filter((app) => {
        const matchesSearch = app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) || app.companyName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all-status" || app.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-7">
            <section className="rounded-3xl border border-border/70 bg-card/95 p-7 shadow-card">
                <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-5">
                    <div className="space-y-3">
                        <Badge className="rounded-full bg-primary/15 px-4 py-1 text-primary">Customer Onboarding</Badge>
                        <div className="space-y-2">
                            <h1 className="text-display-1 leading-tight">Customer Onboarding</h1>
                            <p className="max-w-2xl text-body">Review and process new customer applications. Streamline onboarding workflow and approval process.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1">
                                <FileText className="h-3.5 w-3.5 text-primary" />24 pending
                            </span>
                            <span className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
                                <BarChart3 className="h-3.5 w-3.5 text-success" />2.8 days avg
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                            <Button className="gap-2 rounded-lg bg-primary text-primary-foreground shadow-brand">
                                <UserPlus className="h-4 w-4" />New Application
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

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {onboardingStats.map((stat, index) => (
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

            <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Applications</CardTitle>
                    <p className="text-xs text-muted-foreground">Customer onboarding applications</p>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[250px]">Applicant</TableHead>
                                    <TableHead>Industry</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Application Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Assigned To</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.length === 0 ? (
                                    <TableRow><TableCell colSpan={7} className="h-24 text-center">No applications found.</TableCell></TableRow>
                                ) : (
                                    filteredData.map((app) => (
                                        <TableRow key={app.id} className="group hover:bg-muted/20">
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <p className="font-semibold text-foreground">{app.applicantName}</p>
                                                    <p className="text-xs text-muted-foreground">{app.companyName}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell><Badge variant="secondary" className="rounded-full text-xs">{app.industry}</Badge></TableCell>
                                            <TableCell><span className="text-sm">{app.location}</span></TableCell>
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
                                                            {app.status === "pending" && <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-success"><CheckCircle className="h-4 w-4" />Approve</DropdownMenuItem>}
                                                            {app.status === "pending" && <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-error"><XCircle className="h-4 w-4" />Reject</DropdownMenuItem>}
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

export default CustomerOnboarding;
