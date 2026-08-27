"use client";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, AlertTriangle, AlertOctagon, CheckCircle2, Clock, MoreHorizontal } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

const TYPE_LABELS: Record<string, string> = {
    DAMAGED: "Package Damaged",
    LOST: "Lost Shipment",
    PILFERAGE: "Pilferage",
    SHORT_DELIVERY: "Short Delivery",
    WRONG_DELIVERY: "Wrong Delivery",
    ADDRESS_ISSUE: "Address Issue",
    WEIGHT_DISCREPANCY: "Weight Discrepancy",
    PAYMENT_ISSUE: "Payment Issue",
    DELAY: "Late Delivery",
    REFUSED: "Customer Refused",
    OTHER: "Other",
};

interface PendingExceptionItem {
    id: string;
    orderId: string;
    type: string;
    severity: string;
    reportedAt: string;
    description: string;
    assignedTo: string | null;
    status: string;
}

const mapException = (e: any): PendingExceptionItem => ({
    id: e.exceptionId || e._id || "",
    orderId: e.awb || e.shipmentId?.awb || e.shipmentId?._id || "—",
    type: TYPE_LABELS[e.type] || e.type || "Other",
    severity: (e.severity || "MEDIUM").toLowerCase(),
    reportedAt: e.createdAt ? new Date(e.createdAt).toLocaleString() : "—",
    description: e.description || e.title || "",
    assignedTo: e.escalatedTo?.name || e.reportedBy || null,
    status: e.status || "OPEN",
});

const PendingExceptions = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [exceptions, setExceptions] = useState<PendingExceptionItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPending = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            const res = await axios.get(`${API_BASE}/api/exceptions`, { headers });
            const raw = res.data?.data || res.data || [];
            const list = Array.isArray(raw) ? raw : [];
            // Filter for pending statuses (not RESOLVED or CLOSED)
            const pending = list
                .filter((e: any) => e.status === "OPEN" || e.status === "INVESTIGATING" || e.status === "ESCALATED")
                .map(mapException);
            setExceptions(pending);
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Failed to load pending exceptions.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPending();
    }, [fetchPending]);

    const handleResolve = async (id: string) => {
        const resolution = prompt("Enter resolution note:");
        if (!resolution) return;
        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            await axios.put(`${API_BASE}/api/exceptions/${id}/resolve`, { resolution }, { headers });
            toast.success("Exception resolved successfully");
            fetchPending();
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Failed to resolve exception.";
            toast.error(msg);
        }
    };

    const handleEscalate = async (id: string) => {
        const reason = prompt("Enter escalation reason:");
        if (!reason) return;
        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            await axios.put(`${API_BASE}/api/exceptions/${id}/escalate`, { escalationReason: reason }, { headers });
            toast.success("Exception escalated successfully");
            fetchPending();
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Failed to escalate exception.";
            toast.error(msg);
        }
    };

    const filteredData = exceptions.filter(item =>
        item.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getSeverityBadge = (severity: string) => {
        switch (severity) {
            case "critical": return <Badge className="bg-error/15 text-error">Critical</Badge>;
            case "high": return <Badge className="bg-error/15 text-error">High</Badge>;
            case "medium": return <Badge className="bg-warning/15 text-warning">Medium</Badge>;
            case "low": return <Badge className="bg-success/15 text-success">Low</Badge>;
            default: return <Badge variant="outline">{severity}</Badge>;
        }
    };

    const criticalCount = exceptions.filter(e => e.severity === "critical" || e.severity === "high").length;
    const addressIssueCount = exceptions.filter(e => e.type === "Address Issue").length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Pending Exceptions</h1>
                    <p className="text-sm text-muted-foreground">Action required for unresolved delivery issues.</p>
                </div>
                <Button variant="outline" onClick={fetchPending} className="gap-2">
                    Refresh
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
                        <AlertOctagon className="h-4 w-4 text-error" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{criticalCount}</div>
                        <p className="text-xs text-muted-foreground">Requires immediate attention</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Address Issues</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-warning" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{addressIssueCount}</div>
                        <p className="text-xs text-muted-foreground">Wrong pin codes/locations</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
                        <Clock className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{exceptions.length}</div>
                        <p className="text-xs text-muted-foreground">Awaiting resolution</p>
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
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                    No pending exceptions found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.id}</TableCell>
                                    <TableCell>{item.orderId}</TableCell>
                                    <TableCell>{item.type}</TableCell>
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
                                                <DropdownMenuItem onClick={() => handleResolve(item.id)}>
                                                    <CheckCircle2 className="h-4 w-4 mr-2" /> Resolve
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-error" onClick={() => handleEscalate(item.id)}>
                                                    <AlertTriangle className="h-4 w-4 mr-2" /> Escalate
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default PendingExceptions;
