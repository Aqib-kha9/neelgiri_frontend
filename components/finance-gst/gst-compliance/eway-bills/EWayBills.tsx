"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Truck, Download, Upload, Search, X, MoreHorizontal, Eye, Plus, MapPin, Calendar } from "lucide-react";
import { ImportDialog } from "../../../warehouse/(inventory)/ImportDialog";
import { ExportDialog } from "../../../warehouse/(inventory)/ExportDialog";
import { ewayBillStats, ewayBills } from "./mockData";

const EWayBills = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all-status");
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);

    const filteredData = ewayBills.filter((bill) => {
        const matchesSearch =
            bill.ewbNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bill.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bill.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bill.consignee.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all-status" || bill.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-7">
            <section className="rounded-3xl border border-border/70 bg-card/95 p-7 shadow-card">
                <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-5">
                    <div className="space-y-3">
                        <Badge className="rounded-full bg-primary/15 px-4 py-1 text-primary">GST Compliance</Badge>
                        <div className="space-y-2">
                            <h1 className="text-display-1 leading-tight">E-Way Bills</h1>
                            <p className="max-w-2xl text-body">Generate and manage e-way bills for delivery shipments. Track active bills, validity, and compliance.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1">
                                <Truck className="h-3.5 w-3.5 text-primary" />1,856 bills generated
                            </span>
                            <span className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
                                <MapPin className="h-3.5 w-3.5 text-success" />142 active
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                            <Button className="gap-2 rounded-lg">
                                <Plus className="h-4 w-4" />Generate E-Way Bill
                            </Button>
                        </div>
                        <div className="flex gap-2">
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
                {ewayBillStats.map((stat, index) => (
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
                        <Input
                            placeholder="Search by EWB number, invoice, vehicle..."
                            className="h-10 w-full rounded-xl bg-background/50 pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="h-10 w-[160px] rounded-xl">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-status">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="expired">Expired</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                        {(searchQuery || statusFilter !== "all-status") && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    setSearchQuery("");
                                    setStatusFilter("all-status");
                                }}
                                className="h-10 w-10 rounded-xl"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
                <CardHeader>
                    <CardTitle className="text-base font-semibold">E-Way Bills</CardTitle>
                    <p className="text-xs text-muted-foreground">Active and historical e-way bill records</p>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[140px]">EWB Number</TableHead>
                                    <TableHead>Invoice No</TableHead>
                                    <TableHead>Consignee</TableHead>
                                    <TableHead>Vehicle</TableHead>
                                    <TableHead>Route</TableHead>
                                    <TableHead>Distance</TableHead>
                                    <TableHead>Goods Value</TableHead>
                                    <TableHead>Generated</TableHead>
                                    <TableHead>Valid Upto</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={11} className="h-24 text-center">No e-way bills found.</TableCell>
                                    </TableRow>
                                ) : (
                                    filteredData.map((bill) => (
                                        <TableRow key={bill.id} className="group hover:bg-muted/20">
                                            <TableCell>
                                                <p className="font-semibold text-foreground">{bill.ewbNumber}</p>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm text-muted-foreground">{bill.invoiceNo}</span>
                                            </TableCell>
                                            <TableCell>
                                                <p className="font-medium text-foreground max-w-[200px] truncate">{bill.consignee}</p>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="rounded-full font-mono">
                                                    {bill.vehicleNumber}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-sm">
                                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                                    <span className="max-w-[150px] truncate">{bill.fromLocation}</span>
                                                    <span className="text-muted-foreground">→</span>
                                                    <span className="max-w-[150px] truncate">{bill.toLocation}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm">{bill.distance} km</span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-medium">₹{bill.goodsValue.toLocaleString("en-IN")}</span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                                    {new Date(bill.generatedDate).toLocaleDateString("en-IN")}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm">{new Date(bill.validUpto).toLocaleDateString("en-IN")}</span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        bill.status === "active" ? "success" :
                                                            bill.status === "completed" ? "default" :
                                                                bill.status === "expired" ? "error" :
                                                                    "secondary"
                                                    }
                                                    className="rounded-full"
                                                >
                                                    {bill.status === "active" ? "Active" :
                                                        bill.status === "completed" ? "Completed" :
                                                            bill.status === "expired" ? "Expired" :
                                                                "Cancelled"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="rounded-lg">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-xl">
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                                                                <Eye className="h-4 w-4" />View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                                                                <Download className="h-4 w-4" />Download PDF
                                                            </DropdownMenuItem>
                                                            {bill.status === "active" && (
                                                                <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-error">
                                                                    <X className="h-4 w-4" />Cancel Bill
                                                                </DropdownMenuItem>
                                                            )}
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

export default EWayBills;
