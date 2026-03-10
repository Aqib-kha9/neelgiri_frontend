"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Users, Plus, Download, Upload, BarChart3, Search, X, MoreHorizontal, Eye, Edit, Phone, Mail, Building, CheckCircle, Clock, IndianRupee } from "lucide-react";
import { ImportDialog } from "../../warehouse/(inventory)/ImportDialog";
import { ExportDialog } from "../../warehouse/(inventory)/ExportDialog";

const customerStats = [
    { title: "Total Customers", value: "1,248", change: "+85", trend: "up", icon: Users, description: "Active accounts" },
    { title: "Active Customers", value: "1,156", change: "+72", trend: "up", icon: CheckCircle, description: "Currently active" },
    { title: "Pending Approvals", value: "28", change: "+13", trend: "down", icon: Clock, description: "Awaiting review" },
    { title: "Monthly Revenue", value: "₹185.5L", change: "+22%", trend: "up", icon: IndianRupee, description: "This month" },
];

const customerData = [
    { id: "CUS-001", companyName: "TechCorp Solutions", customerId: "TC-2024-001", industry: "Technology", location: "Delhi NCR", status: "active", monthlyRevenue: 450000, totalOrders: 156, rating: 4.8, contactPerson: "Amit Kumar", phone: "+91 98765 11111", email: "amit@techcorp.com" },
    { id: "CUS-002", companyName: "RetailHub India", customerId: "RH-2024-002", industry: "Retail", location: "Mumbai", status: "active", monthlyRevenue: 380000, totalOrders: 142, rating: 4.6, contactPerson: "Priya Sharma", phone: "+91 98765 22222", email: "priya@retailhub.com" },
    { id: "CUS-003", companyName: "MediCare Pharma", customerId: "MP-2024-003", industry: "Healthcare", location: "Bangalore", status: "pending", monthlyRevenue: 0, totalOrders: 0, rating: 0, contactPerson: "Dr. Rahul Verma", phone: "+91 98765 33333", email: "rahul@medicare.com" },
    { id: "CUS-004", companyName: "FoodMart Chain", customerId: "FM-2024-004", industry: "Food & Beverage", location: "Pune", status: "active", monthlyRevenue: 520000, totalOrders: 198, rating: 4.9, contactPerson: "Neha Gupta", phone: "+91 98765 44444", email: "neha@foodmart.com" },
    { id: "CUS-005", companyName: "Fashion Trends", customerId: "FT-2024-005", industry: "Fashion", location: "Delhi", status: "inactive", monthlyRevenue: 0, totalOrders: 85, rating: 4.2, contactPerson: "Vikram Singh", phone: "+91 98765 55555", email: "vikram@fashiontrends.com" },
];

const CustomerDirectory = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all-status");
    const [industryFilter, setIndustryFilter] = useState("all-industries");
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);

    const filteredData = customerData.filter((customer) => {
        const matchesSearch = customer.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || customer.customerId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all-status" || customer.status === statusFilter;
        const matchesIndustry = industryFilter === "all-industries" || customer.industry === industryFilter;
        return matchesSearch && matchesStatus && matchesIndustry;
    });

    return (
        <div className="space-y-7">
            <section className="rounded-3xl border border-border/70 bg-card/95 p-7 shadow-card">
                <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-5">
                    <div className="space-y-3">
                        <Badge className="rounded-full bg-primary/15 px-4 py-1 text-primary">Customer Management</Badge>
                        <div className="space-y-2">
                            <h1 className="text-display-1 leading-tight">Customer Directory</h1>
                            <p className="max-w-2xl text-body">Manage your entire customer base. View customer details, track orders, and maintain strong business relationships.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1">
                                <Users className="h-3.5 w-3.5 text-primary" />1,248 customers
                            </span>
                            <span className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
                                <BarChart3 className="h-3.5 w-3.5 text-success" />92.6% active
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                            <Button className="gap-2 rounded-lg bg-primary text-primary-foreground shadow-brand">
                                <Plus className="h-4 w-4" />Add Customer
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
                {customerStats.map((stat, index) => (
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
                        <Input placeholder="Search customers..." className="h-10 w-full rounded-xl bg-background/50 pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Select value={industryFilter} onValueChange={setIndustryFilter}>
                            <SelectTrigger className="h-10 w-[160px] rounded-xl">
                                <SelectValue placeholder="Industry" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-industries">All Industries</SelectItem>
                                <SelectItem value="Technology">Technology</SelectItem>
                                <SelectItem value="Retail">Retail</SelectItem>
                                <SelectItem value="Healthcare">Healthcare</SelectItem>
                                <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                                <SelectItem value="Fashion">Fashion</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="h-10 w-[160px] rounded-xl">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-status">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                        </Select>
                        {(searchQuery || statusFilter !== "all-status" || industryFilter !== "all-industries") && (
                            <Button variant="ghost" size="icon" onClick={() => { setSearchQuery(""); setStatusFilter("all-status"); setIndustryFilter("all-industries"); }} className="h-10 w-10 rounded-xl">
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Customer Directory</CardTitle>
                    <p className="text-xs text-muted-foreground">Complete customer database</p>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[280px]">Customer Details</TableHead>
                                    <TableHead>Industry</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Total Orders</TableHead>
                                    <TableHead>Revenue</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.length === 0 ? (
                                    <TableRow><TableCell colSpan={8} className="h-24 text-center">No customers found.</TableCell></TableRow>
                                ) : (
                                    filteredData.map((customer) => (
                                        <TableRow key={customer.id} className="group hover:bg-muted/20">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="rounded-2xl p-2 bg-primary/10 text-primary">
                                                        <Building className="h-5 w-5" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="font-semibold text-foreground">{customer.companyName}</p>
                                                        <p className="text-xs text-muted-foreground">ID: {customer.customerId}</p>
                                                        <p className="text-xs text-muted-foreground">{customer.contactPerson}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell><Badge variant="secondary" className="rounded-full text-xs">{customer.industry}</Badge></TableCell>
                                            <TableCell><span className="text-sm">{customer.location}</span></TableCell>
                                            <TableCell><span className="font-semibold">{customer.totalOrders}</span></TableCell>
                                            <TableCell>
                                                <span className="font-semibold text-foreground">
                                                    {customer.monthlyRevenue > 0 ? `₹${(customer.monthlyRevenue / 1000).toFixed(0)}K` : "—"}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-medium">{customer.rating > 0 ? `${customer.rating} / 5.0` : "—"}</span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={customer.status === "active" ? "success" : customer.status === "pending" ? "warning" : "secondary"} className="rounded-full">
                                                    {customer.status === "active" ? "Active" : customer.status === "pending" ? "Pending" : "Inactive"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-lg"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-xl">
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg"><Eye className="h-4 w-4" />View Details</DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg"><Edit className="h-4 w-4" />Edit Customer</DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg"><Phone className="h-4 w-4" />Call</DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg"><Mail className="h-4 w-4" />Email</DropdownMenuItem>
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

export default CustomerDirectory;
