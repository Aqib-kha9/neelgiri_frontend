"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, MapPin, CheckCircle2, Play, Calendar, AlertCircle, History, Undo, Pause, PlayCircle, Clock, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RiderTasksPage() {
    const { session } = useAuth();
    const [drsList, setDrsList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(true);
    const [showHistory, setShowHistory] = useState(false);

    const fetchDRS = async () => {
        try {
            const res = await fetch('/api/drs/list?status=all', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                const data = await res.json();
                setDrsList(data);
            }
        } catch (e) {
            console.error("Failed to fetch DRS", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session) {
            const userRole = (session as any).role;
            if (typeof userRole === 'string' && userRole.toLowerCase() !== 'rider') {
                setIsAuthorized(false);
                return;
            }
            fetchDRS();
        }
    }, [session]);

    if (!isAuthorized) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
                <div className="bg-destructive/10 p-6 rounded-full">
                    <AlertCircle className="h-12 w-12 text-destructive" />
                </div>
                <h2 className="text-xl font-semibold">Access Denied</h2>
                <p className="text-muted-foreground">Only riders can access this page.</p>
            </div>
        );
    }

    const handleUpdateDRSStatus = async (drsId: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/drs/${drsId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                toast.success(`DRS ${newStatus === 'in_progress' ? 'Resumed' : newStatus === 'paused' ? 'Paused' : 'Started'}!`);
                fetchDRS();
            } else {
                toast.error(`Failed to ${newStatus} DRS`);
            }
        } catch (e) {
            toast.error("Network error");
        }
    };

    const handleUpdateShipmentStatus = async (drsId: string, awb: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/drs/${drsId}/shipment/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ awb, status: newStatus })
            });

            if (res.ok) {
                toast.success(`Shipment ${newStatus}`);
                fetchDRS();
            } else {
                throw new Error('Failed to update');
            }
        } catch (e) {
            toast.error("Failed to update status");
        }
    };

    const isDateAllowed = (dateString: string) => {
        if (!dateString) return true;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const scheduled = new Date(dateString);
        scheduled.setHours(0, 0, 0, 0);
        return scheduled <= today;
    };

    if (loading) {
        return (
            <div className="p-8 flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <div className="relative">
                    <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                    <Package className="h-6 w-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" />
                </div>
                <p className="text-muted-foreground animate-pulse">Loading your tasks...</p>
            </div>
        );
    }

    const filteredList = drsList.filter(drs => showHistory ? drs.status === 'completed' : drs.status !== 'completed');

    // Calculate stats
    const activeCount = drsList.filter(d => d.status === 'in_progress').length;
    const completedToday = drsList.filter(d => {
        if (d.status !== 'completed') return false;
        const today = new Date().toDateString();
        return new Date(d.updatedAt).toDateString() === today;
    }).length;

    return (
        <div className="container py-6 md:py-8 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="mb-6 md:mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="space-y-1">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                            {showHistory ? '📜 Task History' : '📦 My Tasks'}
                        </h1>
                        <p className="text-sm md:text-base text-muted-foreground">
                            {showHistory ? 'Review your completed deliveries' : 'Manage your delivery run sheets'}
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => setShowHistory(!showHistory)}
                        className="gap-2 hover:scale-105 transition-transform duration-200 shadow-sm"
                    >
                        {showHistory ? <Package className="h-4 w-4" /> : <History className="h-4 w-4" />}
                        {showHistory ? 'Show Active' : 'Show History'}
                    </Button>
                </div>

                {/* Stats Cards - Only show for active tasks */}
                {!showHistory && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6">
                        <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow duration-200">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-500/10 p-2 rounded-lg">
                                        <PlayCircle className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{activeCount}</p>
                                        <p className="text-xs text-muted-foreground">Active Now</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow duration-200">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-500/10 p-2 rounded-lg">
                                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{completedToday}</p>
                                        <p className="text-xs text-muted-foreground">Done Today</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow duration-200 col-span-2 md:col-span-1">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-purple-500/10 p-2 rounded-lg">
                                        <TrendingUp className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{filteredList.length}</p>
                                        <p className="text-xs text-muted-foreground">Total Tasks</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>

            {/* Empty State */}
            {filteredList.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 md:py-20 border-2 rounded-2xl bg-gradient-to-br from-muted/30 to-muted/10 border-dashed animate-in fade-in zoom-in-95 duration-500">
                    <div className="bg-background p-5 rounded-full shadow-lg mb-4 animate-bounce">
                        {showHistory ? (
                            <History className="h-10 w-10 text-muted-foreground" />
                        ) : (
                            <Package className="h-10 w-10 text-muted-foreground" />
                        )}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                        {showHistory ? 'No History Yet' : 'All Clear! 🎉'}
                    </h3>
                    <p className="text-muted-foreground text-center max-w-sm px-4 text-sm">
                        {showHistory
                            ? "You haven't completed any run sheets yet. Completed tasks will appear here."
                            : "You're all caught up! No active run sheets scheduled right now."}
                    </p>
                </div>
            )}

            {/* Tasks List */}
            <div className="space-y-4 md:space-y-6">
                {filteredList.map((drs, index) => {
                    const allowedConsumers = isDateAllowed(drs.scheduledDate);
                    const isStarted = drs.status === 'in_progress';
                    const isPaused = drs.status === 'paused';
                    const isCompleted = drs.status === 'completed';

                    const deliveredCount = drs.shipments.filter((s: any) => s.status === 'delivered' || s.status === 'completed').length;
                    const totalCount = drs.shipments.length;
                    const progress = totalCount > 0 ? (deliveredCount / totalCount) * 100 : 0;

                    return (
                        <Card
                            key={drs._id}
                            className={cn(
                                "border-l-4 shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg",
                                "animate-in fade-in slide-in-from-bottom-2",
                                isCompleted && "border-l-green-500 bg-green-50/30 dark:bg-green-950/10",
                                isPaused && "border-l-yellow-500 bg-yellow-50/30 dark:bg-yellow-950/10",
                                isStarted && "border-l-blue-500 bg-blue-50/20 dark:bg-blue-950/10",
                                !isStarted && !isPaused && !isCompleted && "border-l-slate-400"
                            )}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/20 pb-4">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2 mb-3">
                                            <Badge variant="outline" className="font-mono bg-background text-sm px-3 py-1">
                                                {drs.drsId}
                                            </Badge>
                                            <Badge
                                                variant={
                                                    isCompleted ? 'default' :
                                                        isStarted ? "default" :
                                                            isPaused ? "secondary" :
                                                                "secondary"
                                                }
                                                className={cn(
                                                    "capitalize px-3 py-1",
                                                    isCompleted && "bg-green-600 hover:bg-green-700",
                                                    isStarted && "bg-blue-600 hover:bg-blue-700",
                                                    isPaused && "bg-yellow-600 hover:bg-yellow-700"
                                                )}
                                            >
                                                {drs.status.replace("_", " ")}
                                            </Badge>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-4 w-4" />
                                                <span>{new Date(drs.scheduledDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Package className="h-4 w-4" />
                                                <span>{totalCount} Shipments</span>
                                            </div>
                                            {isStarted && (
                                                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium">
                                                    <Clock className="h-4 w-4 animate-pulse" />
                                                    <span>In Progress</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Progress Bar */}
                                        {(isStarted || isCompleted) && (
                                            <div className="mt-3 space-y-1">
                                                <div className="flex justify-between text-xs text-muted-foreground">
                                                    <span>Progress</span>
                                                    <span className="font-medium">{deliveredCount}/{totalCount} completed</span>
                                                </div>
                                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className={cn(
                                                            "h-full transition-all duration-500 ease-out",
                                                            isCompleted ? "bg-green-500" : "bg-blue-500"
                                                        )}
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Control Buttons */}
                                    {!showHistory && (
                                        <div className="flex flex-col gap-2 md:min-w-[140px]">
                                            {isPaused && drs.pauseType === 'admin' && (
                                                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-3 py-2 rounded-lg flex items-center gap-2 text-xs">
                                                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                                                    <span className="font-medium">Admin Paused</span>
                                                </div>
                                            )}

                                            {drs.status === 'scheduled' && (
                                                <Button
                                                    disabled={!allowedConsumers}
                                                    onClick={() => handleUpdateDRSStatus(drs.drsId, 'in_progress')}
                                                    className="w-full hover:scale-105 transition-transform"
                                                >
                                                    <Play className="mr-2 h-4 w-4" />
                                                    {allowedConsumers ? "Start" : "Wait"}
                                                </Button>
                                            )}

                                            {isStarted && (
                                                <Button
                                                    variant="secondary"
                                                    className="w-full border hover:scale-105 transition-transform"
                                                    onClick={() => handleUpdateDRSStatus(drs.drsId, 'paused')}
                                                >
                                                    <Pause className="mr-2 h-4 w-4" />
                                                    Pause
                                                </Button>
                                            )}

                                            {isPaused && (
                                                <Button
                                                    variant="default"
                                                    disabled={drs.pauseType === 'admin'}
                                                    onClick={() => handleUpdateDRSStatus(drs.drsId, 'in_progress')}
                                                    className="w-full hover:scale-105 transition-transform"
                                                >
                                                    <PlayCircle className="mr-2 h-4 w-4" />
                                                    Resume
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className={cn("p-0", isPaused && "opacity-60 pointer-events-none")}>
                                <div className="divide-y">
                                    {drs.shipments.map((shipment: any, idx: number) => {
                                        const isPendingApproval = shipment.status === 'pending_approval' || shipment.status === 'pending_for_branch_approval';
                                        const isCompletedByBranch = shipment.status === 'completed';
                                        const isDelivered = isCompletedByBranch; // Show as delivered ONLY if approved
                                        const isRescheduled = shipment.status === 'scheduled_for_later';
                                        // specific check: if pending approval, allow undo. If completed, NO EDIT.
                                        const canEdit = (isStarted || isCompleted) && !isRescheduled && !isCompletedByBranch;

                                        return (
                                            <div
                                                key={shipment.awb || idx}
                                                className={cn(
                                                    "p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all duration-200",
                                                    "hover:bg-muted/30 border-l-2",
                                                    isRescheduled && "border-l-amber-500 bg-amber-50/30 dark:bg-amber-950/10",
                                                    isCompletedByBranch && "border-l-green-600 bg-green-50/30 dark:bg-green-950/10",
                                                    isPendingApproval && "border-l-blue-500 bg-blue-50/30 dark:bg-blue-950/10",
                                                    (isDelivered || isCompletedByBranch || isPendingApproval) && "opacity-75",
                                                    !isRescheduled && !isCompletedByBranch && !isPendingApproval && "border-l-transparent"
                                                )}
                                            >
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-muted-foreground font-semibold">AWB:</span>
                                                            <span className={cn(
                                                                "font-mono font-medium text-sm md:text-base",
                                                                (isDelivered || isCompletedByBranch || isPendingApproval) && "line-through text-muted-foreground"
                                                            )}>
                                                                {shipment.awb}
                                                            </span>
                                                        </div>
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                "text-[10px] h-5 capitalize",
                                                                isCompletedByBranch && "bg-green-600 text-white border-green-600 hover:bg-green-600",
                                                                isPendingApproval && "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400",
                                                                isRescheduled && "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400"
                                                            )}
                                                        >
                                                            {isRescheduled ? '📅 Rescheduled' :
                                                                isCompletedByBranch ? '✓ Delivered Successful' :
                                                                    isPendingApproval ? '⏳ Pending Approval' :
                                                                        shipment.status.replace('_', ' ')}
                                                        </Badge>
                                                    </div>

                                                    {isRescheduled && shipment.rescheduledDate && (
                                                        <div className="flex items-center gap-2 p-2 rounded-md bg-amber-500/10 border border-amber-500/20 w-fit animate-pulse">
                                                            <Calendar className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                                                            <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                                                                Active: {new Date(shipment.rescheduledDate).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {isCompletedByBranch && (
                                                        <div className="flex items-center gap-2 p-2 rounded-md bg-green-100 border border-green-200 w-fit dark:bg-green-900/30 dark:border-green-800">
                                                            <CheckCircle2 className="h-3.5 w-3.5 text-green-700 dark:text-green-400" />
                                                            <span className="text-xs font-medium text-green-800 dark:text-green-300">
                                                                Completed by Branch Admin
                                                            </span>
                                                        </div>
                                                    )}

                                                    {isPendingApproval && (
                                                        <div className="flex items-center gap-2 p-2 rounded-md bg-blue-100 border border-blue-200 w-fit dark:bg-blue-900/30 dark:border-blue-800">
                                                            <Clock className="h-3.5 w-3.5 text-blue-700 dark:text-blue-400 animate-pulse" />
                                                            <span className="text-xs font-medium text-blue-800 dark:text-blue-300">
                                                                Waiting for Branch Approval
                                                            </span>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                                                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                                                        <span className="line-clamp-1">
                                                            {drs.pincodes && drs.pincodes.length > 0 ? drs.pincodes.join(', ') : 'Local Delivery'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                {canEdit && (
                                                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                                                        {(!isDelivered && !isCompletedByBranch && !isPendingApproval) ? (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    className="flex-1 md:flex-none h-9 text-xs bg-green-600 hover:bg-green-700 hover:scale-105 transition-transform shadow-sm"
                                                                    onClick={() => {
                                                                        if (confirm("Mark this shipment as Delivered?")) {
                                                                            handleUpdateShipmentStatus(drs._id, shipment.awb, 'delivered');
                                                                        }
                                                                    }}
                                                                >
                                                                    <CheckCircle2 className="mr-1.5 h-4 w-4" />
                                                                    Delivered
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="flex-1 md:flex-none h-9 text-xs border-destructive/30 text-destructive hover:bg-destructive/10 hover:scale-105 transition-transform"
                                                                    onClick={() => {
                                                                        if (confirm("Mark this shipment as Undelivered/Failed?")) {
                                                                            handleUpdateShipmentStatus(drs._id, shipment.awb, 'undelivered');
                                                                        }
                                                                    }}
                                                                >
                                                                    <AlertCircle className="mr-1.5 h-4 w-4" />
                                                                    Failed
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="flex-1 md:flex-none h-9 text-xs text-muted-foreground hover:text-foreground hover:scale-105 transition-transform"
                                                                onClick={() => {
                                                                    if (confirm("Reset status to Pending?")) {
                                                                        handleUpdateShipmentStatus(drs._id, shipment.awb, 'pending');
                                                                    }
                                                                }}
                                                            >
                                                                <Undo className="mr-1.5 h-4 w-4" />
                                                                Undo
                                                            </Button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
