"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Download, Upload, MoreHorizontal, TrendingUp, TrendingDown, Award, Star, AlertCircle } from "lucide-react";
import { mockPerformance } from "./mockData";
import { ImportDialog } from "@/components/warehouse/(inventory)/ImportDialog";
import { ExportDialog } from "@/components/warehouse/(inventory)/ExportDialog";

const PerformanceTraction = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);

    const filteredData = mockPerformance.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.riderId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Performance Traction</h1>
                    <p className="text-sm text-muted-foreground">Track rider performance metrics and ratings.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsImportOpen(true)}>
                        <Upload className="mr-2 h-4 w-4" /> Import
                    </Button>
                    <Button variant="outline" onClick={() => setIsExportOpen(true)}>
                        <Download className="mr-2 h-4 w-4" /> Export
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
                        <Star className="h-4 w-4 text-warning" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4.6</div>
                        <p className="text-xs text-muted-foreground">+0.2 from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">On-Time %</CardTitle>
                        <TrendingUp className="h-4 w-4 text-success" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">92%</div>
                        <p className="text-xs text-muted-foreground">Target: 95%</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
                        <Award className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">Riders with 5.0 rating</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
                        <AlertCircle className="h-4 w-4 text-error" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">Riders below 3.5 rating</p>
                    </CardContent>
                </Card>
            </div>

            {/* Table */}
            <div className="flex items-center gap-2 bg-card p-4 rounded-lg border shadow-sm">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search riders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm border-none shadow-none focus-visible:ring-0"
                />
            </div>

            <div className="rounded-md border bg-card shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Rider</TableHead>
                            <TableHead>Deliveries</TableHead>
                            <TableHead>On-Time %</TableHead>
                            <TableHead>Avg Time</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Earnings</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <div>
                                        <div className="font-medium">{item.name}</div>
                                        <div className="text-xs text-muted-foreground">{item.riderId}</div>
                                    </div>
                                </TableCell>
                                <TableCell>{item.totalDeliveries}</TableCell>
                                <TableCell>
                                    <span className={item.onTimeDeliveryPct < 90 ? "text-error" : "text-success"}>
                                        {item.onTimeDeliveryPct}%
                                    </span>
                                </TableCell>
                                <TableCell>{item.avgDeliveryTime}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1">
                                        <Star className="h-3 w-3 fill-warning text-warning" />
                                        {item.avgRating}
                                    </div>
                                </TableCell>
                                <TableCell>₹{item.earnings.toLocaleString()}</TableCell>
                                <TableCell>
                                    <Badge variant={item.status === 'excellent' ? 'success' : item.status === 'poor' ? 'destructive' : 'secondary'}>
                                        {item.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>View Report</DropdownMenuItem>
                                            <DropdownMenuItem>Send Warning</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <ImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} />
            <ExportDialog open={isExportOpen} onOpenChange={setIsExportOpen} />
        </div>
    );
};

export default PerformanceTraction;
