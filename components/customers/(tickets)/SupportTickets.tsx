"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Headphones, Plus, Download, Upload, BarChart3, Search, X, MoreHorizontal, Eye, MessageSquare, CheckCircle, Clock, AlertCircle, TrendingUp } from "lucide-react";
import { ImportDialog } from "../../warehouse/(inventory)/ImportDialog";
import { ExportDialog } from "../../warehouse/(inventory)/ExportDialog";

const ticketStats = [
    { title: "Total Tickets", value: "342", change: "+28", trend: "down", icon: Headphones, description: "All time" },
    { title: "Open Tickets", value: "45", change: "+12", trend: "down", icon: Clock, description: "Pending resolution" },
    { title: "Resolved Today", value: "18", change: "+6", trend: "up", icon: CheckCircle, description: "Completed" },
    { title: "Avg Response Time", value: "1.2 hrs", change: "-0.3", trend: "up", icon: TrendingUp, description: "Faster response" },
];

const ticketData = [
    { id: "TKT-001", customer: "TechCorp Solutions", ticketId: "TC-TKT-2024-001", subject: "Delivery Delay Issue", category: "Delivery", priority: "high", status: "open", createdDate: "2024-12-23", assignedTo: "Amit Kumar" },
    { id: "TKT-002", customer: "RetailHub India", ticketId: "RH-TKT-2024-002", subject: "Invoice Discrepancy", category: "Billing", priority: "medium", status: "in-progress", createdDate: "2024-12-22", assignedTo: "Priya Sharma" },
    { id: "TKT-003", customer: "FoodMart Chain", ticketId: "FM-TKT-2024-003", subject: "Product Quality Concern", category: "Quality", priority: "high", status: "open", createdDate: "2024-12-23", assignedTo: "Unassigned" },
    { id: "TKT-004", customer: "Fashion Trends", ticketId: "FT-TKT-2024-004", subject: "Account Access Problem", category: "Technical", priority: "low", status: "resolved", createdDate: "2024-12-20", assignedTo: "Vikram Singh" },
    { id: "TKT-005", customer: "MediCare Pharma", ticketId: "MP-TKT-2024-005", subject: "Missing Items in Order", category: "Delivery", priority: "high", status: "in-progress", createdDate: "2024-12-22", assignedTo: "Neha Gupta" },
];

const SupportTickets = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all-status");
    const [priorityFilter, setPriorityFilter] = useState("all-priority");
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);

    const filteredData = ticketData.filter((ticket) => {
        const matchesSearch = ticket.customer.toLowerCase().includes(searchQuery.toLowerCase()) || ticket.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) || ticket.subject.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all-status" || ticket.status === statusFilter;
        const matchesPriority = priorityFilter === "all-priority" || ticket.priority === priorityFilter;
        return matchesSearch && matchesStatus && matchesPriority;
    });

    return (
        <div className="space-y-7">
            <section className="rounded-3xl border border-border/70 bg-card/95 p-7 shadow-card">
                <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-5">
                    <div className="space-y-3">
                        <Badge className="rounded-full bg-primary/15 px-4 py-1 text-primary">Customer Support</Badge>
                        <div className="space-y-2">
                            <h1 className="text-display-1 leading-tight">Support Tickets</h1>
                            <p className="max-w-2xl text-body">Manage customer support requests and issues. Track resolution times and maintain customer satisfaction.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1">
                                <Headphones className="h-3.5 w-3.5 text-primary" />45 open
                            </span>
                            <span className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
                                <BarChart3 className="h-3.5 w-3.5 text-success" />1.2 hrs avg
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                            <Button className="gap-2 rounded-lg bg-primary text-primary-foreground shadow-brand">
                                <Plus className="h-4 w-4" />New Ticket
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
                {ticketStats.map((stat, index) => (
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
                        <Input placeholder="Search tickets..." className="h-10 w-full rounded-xl bg-background/50 pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                            <SelectTrigger className="h-10 w-[160px] rounded-xl">
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-priority">All Priority</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="h-10 w-[160px] rounded-xl">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-status">All Status</SelectItem>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                            </SelectContent>
                        </Select>
                        {(searchQuery || statusFilter !== "all-status" || priorityFilter !== "all-priority") && (
                            <Button variant="ghost" size="icon" onClick={() => { setSearchQuery(""); setStatusFilter("all-status"); setPriorityFilter("all-priority"); }} className="h-10 w-10 rounded-xl">
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Support Tickets</CardTitle>
                    <p className="text-xs text-muted-foreground">Customer support requests</p>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[250px]">Customer</TableHead>
                                    <TableHead>Ticket ID</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Priority</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Assigned To</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.length === 0 ? (
                                    <TableRow><TableCell colSpan={8} className="h-24 text-center">No tickets found.</TableCell></TableRow>
                                ) : (
                                    filteredData.map((ticket) => (
                                        <TableRow key={ticket.id} className="group hover:bg-muted/20">
                                            <TableCell><p className="font-semibold text-foreground">{ticket.customer}</p></TableCell>
                                            <TableCell><span className="text-sm text-muted-foreground">{ticket.ticketId}</span></TableCell>
                                            <TableCell><span className="text-sm">{ticket.subject}</span></TableCell>
                                            <TableCell><Badge variant="secondary" className="rounded-full text-xs">{ticket.category}</Badge></TableCell>
                                            <TableCell>
                                                <Badge variant={ticket.priority === "high" ? "error" : ticket.priority === "medium" ? "warning" : "secondary"} className="rounded-full text-xs">
                                                    {ticket.priority === "high" ? "High" : ticket.priority === "medium" ? "Medium" : "Low"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={ticket.status === "resolved" ? "success" : ticket.status === "in-progress" ? "warning" : "secondary"} className="rounded-full">
                                                    {ticket.status === "resolved" ? "Resolved" : ticket.status === "in-progress" ? "In Progress" : "Open"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell><span className="text-sm">{ticket.assignedTo}</span></TableCell>
                                            <TableCell>
                                                <div className="flex justify-end">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-lg"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-xl">
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg"><Eye className="h-4 w-4" />View Details</DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg"><MessageSquare className="h-4 w-4" />Add Comment</DropdownMenuItem>
                                                            {ticket.status !== "resolved" && <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-success"><CheckCircle className="h-4 w-4" />Resolve</DropdownMenuItem>}
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

export default SupportTickets;
