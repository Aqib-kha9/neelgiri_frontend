"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Download, Upload, MoreHorizontal, Calendar, Clock, UserCheck, UserX } from "lucide-react";
import { ImportDialog } from "@/components/warehouse/(inventory)/ImportDialog";
import { ExportDialog } from "@/components/warehouse/(inventory)/ExportDialog";
import { AttendanceRecord, AttendanceStats } from "./types";

const AttendanceShifts = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [stats, setStats] = useState<AttendanceStats | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchAttendance = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get("/api/attendance", {
                headers: { Authorization: `Bearer ${token}` }
            });

            const records = (Array.isArray(data) ? data : data.data || []).map((r: any) => ({
                ...r,
                id: r._id || r.id,
                name: r.riderName || r.name || "Unknown",
                riderId: r.riderCode || r.riderId || r.attendanceId || "-",
                date: r.date ? new Date(r.date).toLocaleDateString('en-IN') : "-",
                checkIn: r.checkIn ? new Date(r.checkIn).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : "-",
                checkOut: r.checkOut ? new Date(r.checkOut).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : "-",
                totalHours: r.totalHours || (r.workingHoursMins ? `${Math.floor(r.workingHoursMins / 60)}h ${r.workingHoursMins % 60}m` : "-"),
                shift: r.shift || "general",
                status: r.status || "absent",
            }));
            setAttendance(records);
        } catch (error) {
            console.error("Failed to load attendance", error);
            toast.error("Failed to load attendance records");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchStats = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get("/api/attendance/stats", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(data);
        } catch (error) {
            console.error("Failed to load attendance stats", error);
        }
    }, []);

    useEffect(() => {
        fetchAttendance();
        fetchStats();
    }, [fetchAttendance, fetchStats]);

    const filteredData = attendance.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.riderId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "present": return <Badge className="bg-success/15 text-success">Present</Badge>;
            case "absent": return <Badge className="bg-error/15 text-error">Absent</Badge>;
            case "late": return <Badge className="bg-warning/15 text-warning">Late</Badge>;
            case "half-day": return <Badge variant="secondary">Half Day</Badge>;
            case "on_leave": return <Badge className="bg-blue-500/15 text-blue-600">On Leave</Badge>;
            case "holiday": return <Badge variant="outline">Holiday</Badge>;
            case "weekly_off": return <Badge variant="outline">Weekly Off</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const presentToday = stats?.present ?? 0;
    const absentToday = stats?.absent ?? 0;
    const lateToday = stats?.late ?? 0;
    const totalToday = stats?.total ?? 0;
    const coveragePct = totalToday > 0 ? Math.round((presentToday / totalToday) * 100) : 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Attendance & Shifts</h1>
                    <p className="text-sm text-muted-foreground">Manage daily attendance and shift schedules.</p>
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
                        <CardTitle className="text-sm font-medium">Present Today</CardTitle>
                        <UserCheck className="h-4 w-4 text-success" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{presentToday}</div>
                        <p className="text-xs text-muted-foreground">{totalToday > 0 ? `${Math.round((presentToday / totalToday) * 100)}% of workforce` : "No data"}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Absent</CardTitle>
                        <UserX className="h-4 w-4 text-error" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{absentToday}</div>
                        <p className="text-xs text-muted-foreground">Unplanned leave</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
                        <Clock className="h-4 w-4 text-warning" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{lateToday}</div>
                        <p className="text-xs text-muted-foreground">Avg delay: {stats?.avgLateMins ? `${Math.round(stats.avgLateMins)}m` : "0m"}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Shift Coverage</CardTitle>
                        <Calendar className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{coveragePct}%</div>
                        <p className="text-xs text-muted-foreground">{presentToday} of {totalToday} present</p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex items-center gap-2 bg-card p-4 rounded-lg border shadow-sm">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm border-none shadow-none focus-visible:ring-0"
                />
            </div>

            <div className="rounded-md border bg-card shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Rider</TableHead>
                            <TableHead>Shift</TableHead>
                            <TableHead>Check In</TableHead>
                            <TableHead>Check Out</TableHead>
                            <TableHead>Hours</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                    Loading attendance records...
                                </TableCell>
                            </TableRow>
                        ) : filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                    No attendance records found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.date}</TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{item.name}</div>
                                            <div className="text-xs text-muted-foreground">{item.riderId}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="capitalize">{item.shift}</TableCell>
                                    <TableCell>{item.checkIn}</TableCell>
                                    <TableCell>{item.checkOut}</TableCell>
                                    <TableCell>{item.totalHours}</TableCell>
                                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>View Logs</DropdownMenuItem>
                                                <DropdownMenuItem>Adjust Time</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <ImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} />
            <ExportDialog open={isExportOpen} onOpenChange={setIsExportOpen} />
        </div>
    );
};

export default AttendanceShifts;
