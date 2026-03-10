"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Plus, Filter, MoreHorizontal, Eye, Edit, Trash2, Download, Upload, Bike, MapPin, Users, Activity } from "lucide-react";
import { mockRiders } from "./mockData";
import { Rider } from "./types";
import { ImportDialog } from "@/components/warehouse/(inventory)/ImportDialog";
import { ExportDialog } from "@/components/warehouse/(inventory)/ExportDialog";
import { AddRiderDialog } from "./AddRiderDialog";

const RiderAllocation = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [isAddRiderOpen, setIsAddRiderOpen] = useState(false);

    const filteredRiders = mockRiders.filter(rider => {
        const matchesSearch = rider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rider.riderId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || rider.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: Rider["status"]) => {
        switch (status) {
            case "active": return <Badge className="bg-success/15 text-success hover:bg-success/25">Active</Badge>;
            case "inactive": return <Badge className="bg-muted text-muted-foreground hover:bg-muted/80">Inactive</Badge>;
            case "on-leave": return <Badge className="bg-warning/15 text-warning hover:bg-warning/25">On Leave</Badge>;
            case "blocked": return <Badge className="bg-error/15 text-error hover:bg-error/25">Blocked</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Rider Allocation</h1>
                    <p className="text-sm text-muted-foreground">Manage rider zones, assignments, and availability.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsImportOpen(true)}>
                        <Upload className="mr-2 h-4 w-4" /> Import
                    </Button>
                    <Button variant="outline" onClick={() => setIsExportOpen(true)}>
                        <Download className="mr-2 h-4 w-4" /> Export
                    </Button>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setIsAddRiderOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Rider
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Riders</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockRiders.length}</div>
                        <p className="text-xs text-muted-foreground">+2 from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                        <Bike className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockRiders.filter(r => r.status === "active").length}</div>
                        <p className="text-xs text-muted-foreground">Currently on duty</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Orders/Rider</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8.5</div>
                        <p className="text-xs text-muted-foreground">+12% from yesterday</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Zone Coverage</CardTitle>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">95%</div>
                        <p className="text-xs text-muted-foreground">All zones covered</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filter and Search */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="on-leave">On Leave</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border bg-card shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Rider ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Zone</TableHead>
                            <TableHead>Vehicle</TableHead>
                            <TableHead>Shift</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredRiders.length > 0 ? (
                            filteredRiders.map((rider) => (
                                <TableRow key={rider.id}>
                                    <TableCell className="font-medium">{rider.riderId}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{rider.name}</span>
                                            <span className="text-xs text-muted-foreground">{rider.phone}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{rider.zone}</TableCell>
                                    <TableCell className="capitalize">{rider.vehicleType}</TableCell>
                                    <TableCell className="capitalize">{rider.shift}</TableCell>
                                    <TableCell>{getStatusBadge(rider.status)}</TableCell>
                                    <TableCell>{rider.rating} ⭐</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem>
                                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit Rider
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-error focus:text-error">
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <ImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} />
            <ExportDialog open={isExportOpen} onOpenChange={setIsExportOpen} />
            <AddRiderDialog open={isAddRiderOpen} onOpenChange={setIsAddRiderOpen} />
        </div>
    );
};

export default RiderAllocation;
