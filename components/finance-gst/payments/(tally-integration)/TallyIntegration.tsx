"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { RefreshCw, CheckCircle, XCircle, AlertCircle, Search, Settings, Activity, FileJson, Server, ArrowRightLeft } from "lucide-react";
import { mockSyncLogs, mockTallyConfig } from "./mockData";

const TallyIntegration = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all-status");
    const [isSyncing, setIsSyncing] = useState(false);

    const filteredLogs = mockSyncLogs.filter((log) => {
        const matchesSearch = log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.type.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all-status" || log.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleSync = () => {
        setIsSyncing(true);
        setTimeout(() => setIsSyncing(false), 2000);
    };

    return (
        <div className="space-y-7">
            {/* Header Section */}
            <section className="rounded-3xl border border-border/70 bg-card/95 p-7 shadow-card">
                <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-5">
                    <div className="space-y-3">
                        <Badge className="rounded-full bg-primary/15 px-4 py-1 text-primary">Accounting Integration</Badge>
                        <div className="space-y-2">
                            <h1 className="text-display-1 leading-tight">Tally Prime Integration</h1>
                            <p className="max-w-2xl text-body">Manage synchronization between Dashboard and Tally Prime. View sync logs and status.</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Button
                            className={`gap-2 rounded-lg shadow-lg shadow-primary/20 ${isSyncing ? "opacity-80" : ""}`}
                            onClick={handleSync}
                            disabled={isSyncing}
                        >
                            <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
                            {isSyncing ? "Syncing..." : "Sync Now"}
                        </Button>
                    </div>
                </div>
            </section>

            {/* Connection Status Cards */}
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
                <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Connection Status</CardTitle>
                        <Server className={`h-4 w-4 ${mockTallyConfig.connectionStatus === 'connected' ? 'text-success' : 'text-error'}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold capitalize flex items-center gap-2">
                            {mockTallyConfig.connectionStatus}
                            <span className="relative flex h-3 w-3">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${mockTallyConfig.connectionStatus === 'connected' ? 'bg-success' : 'bg-error'}`}></span>
                                <span className={`relative inline-flex rounded-full h-3 w-3 ${mockTallyConfig.connectionStatus === 'connected' ? 'bg-success' : 'bg-error'}`}></span>
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {mockTallyConfig.companyName} ({mockTallyConfig.tallyVersion})
                        </p>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{new Date(mockTallyConfig.lastSyncTime).toLocaleTimeString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {new Date(mockTallyConfig.lastSyncTime).toLocaleDateString()}
                        </p>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Auto Sync</CardTitle>
                        <Settings className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2">
                            <Switch checked={mockTallyConfig.autoSync} />
                            <span className="text-sm font-medium">{mockTallyConfig.autoSync ? "Enabled" : "Disabled"}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Syncs every 1 hour
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Logs Table */}
            <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Synchronization Logs</CardTitle>
                    <CardDescription>History of data exchange events</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Filters inside Card */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search logs..."
                                className="h-10 w-full rounded-xl bg-background/50 pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="h-10 w-[160px] rounded-xl">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-status">All Status</SelectItem>
                                <SelectItem value="success">Success</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-border/50">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead>Event ID</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Records</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Details</TableHead>
                                    <TableHead>User</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredLogs.length === 0 ? (
                                    <TableRow><TableCell colSpan={7} className="h-24 text-center">No logs found.</TableCell></TableRow>
                                ) : (
                                    filteredLogs.map((log) => (
                                        <TableRow key={log.id} className="hover:bg-muted/20">
                                            <TableCell><span className="font-mono text-xs">{log.id}</span></TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize flex w-fit items-center gap-1">
                                                    {log.type === 'invoice' && <FileJson className="h-3 w-3" />}
                                                    {log.type === 'payment' && <ArrowRightLeft className="h-3 w-3" />}
                                                    {log.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {log.status === 'success' && <CheckCircle className="h-4 w-4 text-success" />}
                                                    {log.status === 'failed' && <XCircle className="h-4 w-4 text-error" />}
                                                    {log.status === 'processing' && <RefreshCw className="h-4 w-4 text-info animate-spin" />}
                                                    <span className="capitalize text-sm font-medium">{log.status}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell><span className="font-medium">{log.recordsSynced}</span></TableCell>
                                            <TableCell><span className="text-sm text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</span></TableCell>
                                            <TableCell><span className="text-sm text-muted-foreground max-w-[200px] truncate block" title={log.details}>{log.details}</span></TableCell>
                                            <TableCell><span className="text-xs bg-muted px-2 py-1 rounded-full">{log.user}</span></TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TallyIntegration;
