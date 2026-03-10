"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, AlertTriangle, AlertOctagon, CheckCircle2, Clock, MoreHorizontal, Filter } from "lucide-react";
import { mockPendingExceptions } from "./mockData";

const PendingExceptions = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredData = mockPendingExceptions.filter(item =>
        item.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getSeverityBadge = (severity: string) => {
        switch (severity) {
            case "high": return <Badge className="bg-error/15 text-error">High</Badge>;
            case "medium": return <Badge className="bg-warning/15 text-warning">Medium</Badge>;
            case "low": return <Badge className="bg-success/15 text-success">Low</Badge>;
            default: return <Badge variant="outline">{severity}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Pending Exceptions</h1>
                    <p className="text-sm text-muted-foreground">Action required for unresolved delivery issues.</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
                        <AlertOctagon className="h-4 w-4 text-error" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockPendingExceptions.filter(e => e.severity === 'high').length}</div>
                        <p className="text-xs text-muted-foreground">Requires immediate attention</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Address Issues</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-warning" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockPendingExceptions.filter(e => e.type === 'address_issue').length}</div>
                        <p className="text-xs text-muted-foreground">Wrong pin codes/locations</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
                        <Clock className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2h 15m</div>
                        <p className="text-xs text-muted-foreground">Within SLA</p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex items-center gap-2 bg-card p-4 rounded-lg border shadow-sm">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by Order ID or Type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm border-none shadow-none focus-visible:ring-0"
                />
            </div>

            <div className="rounded-md border bg-card shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Exception ID</TableHead>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Severity</TableHead>
                            <TableHead>Reported At</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Assigned To</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.id}</TableCell>
                                <TableCell>{item.orderId}</TableCell>
                                <TableCell className="capitalize">{item.type.replace('_', ' ')}</TableCell>
                                <TableCell>{getSeverityBadge(item.severity)}</TableCell>
                                <TableCell>{item.reportedAt}</TableCell>
                                <TableCell className="max-w-xs truncate" title={item.description}>{item.description}</TableCell>
                                <TableCell>{item.assignedTo || <span className="text-muted-foreground italic">Unassigned</span>}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>Assign Agent</DropdownMenuItem>
                                            <DropdownMenuItem>Resolve</DropdownMenuItem>
                                            <DropdownMenuItem className="text-error">Escalate</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default PendingExceptions;
