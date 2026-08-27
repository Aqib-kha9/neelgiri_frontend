"use client";

import { useState, useCallback, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    MoreHorizontal,
    Search,
    Filter,
    Plus,
    Clock,
} from "lucide-react";
import { ExceptionTicket, WorkflowStatus, mapBackendException, STATUS_REVERSE_MAP } from "./types";
import { cn } from "@/lib/utils";
import { AddExceptionTicketDialog } from "./AddExceptionTicketDialog";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

const columns: { id: WorkflowStatus; title: string, color: string }[] = [
    { id: "new", title: "New Exceptions", color: "bg-blue-500/10 text-blue-500 border-blue-200" },
    { id: "investigating", title: "Investigating", color: "bg-yellow-500/10 text-yellow-500 border-yellow-200" },
    { id: "action_required", title: "Action Required", color: "bg-orange-500/10 text-orange-500 border-orange-200" },
    { id: "resolved", title: "Resolved", color: "bg-green-500/10 text-green-500 border-green-200" },
];

const ExceptionWorkflow = () => {
    const [tickets, setTickets] = useState<ExceptionTicket[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddTicketOpen, setIsAddTicketOpen] = useState(false);

    const fetchTickets = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            const res = await axios.get(`${API_BASE}/api/exceptions`, { headers });
            const raw = res.data?.data || res.data || [];
            const list = Array.isArray(raw) ? raw : [];
            setTickets(list.map(mapBackendException));
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Failed to load exception tickets.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    // Filter tickets based on search
    const filteredTickets = tickets.filter(t =>
        t.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Group tickets by status
    const getColumnTickets = (status: WorkflowStatus) => filteredTickets.filter(t => t.status === status);

    const onDragEnd = async (result: DropResult) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;

        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        const newStatus = destination.droppableId as WorkflowStatus;
        const backendStatus = STATUS_REVERSE_MAP[newStatus];

        // Optimistic update
        const newTickets = [...tickets];
        const ticketIndex = newTickets.findIndex(t => t.id === draggableId);
        if (ticketIndex > -1) {
            newTickets[ticketIndex] = {
                ...newTickets[ticketIndex],
                status: newStatus
            };
            setTickets(newTickets);
        }

        // Call API to update status
        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            if (backendStatus === "RESOLVED") {
                await axios.put(`${API_BASE}/api/exceptions/${draggableId}/resolve`,
                    { resolution: "Moved to resolved via workflow board" },
                    { headers });
            } else if (backendStatus === "ESCALATED") {
                await axios.put(`${API_BASE}/api/exceptions/${draggableId}/escalate`,
                    { escalationReason: "Escalated via workflow board" },
                    { headers });
            } else {
                await axios.put(`${API_BASE}/api/exceptions/${draggableId}`,
                    { status: backendStatus },
                    { headers });
            }
            toast.success(`Ticket moved to ${newStatus.replace('_', ' ')}`);
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Failed to update ticket status.";
            toast.error(msg);
            fetchTickets(); // Revert on error
        }
    };

    const getSeverityColor = (sev: string) => {
        switch (sev) {
            case 'critical': return "bg-red-100 text-red-700 border-red-200";
            case 'high': return "bg-orange-100 text-orange-700 border-orange-200";
            case 'medium': return "bg-yellow-100 text-yellow-700 border-yellow-200";
            default: return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };

    return (
        <div className="h-[calc(100vh-120px)] flex flex-col space-y-4">
            {/* Header Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-4 rounded-xl border shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Active Workflows</h1>
                    <p className="text-sm text-muted-foreground">Drag and drop tickets to manage exception resolution lifecycle.</p>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search ticket ID, Order #..."
                            className="pl-9 bg-background/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
                    <Button onClick={() => setIsAddTicketOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> New Ticket
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex-1 overflow-x-auto">
                        <div className="flex gap-4 h-full min-w-[1000px]">
                            {columns.map(col => (
                                <div key={col.id} className="flex-1 flex flex-col min-w-[280px] bg-muted/30 rounded-xl border border-border/50">
                                    {/* Column Header */}
                                    <div className={cn("p-3 flex items-center justify-between border-b bg-card/50 rounded-t-xl backdrop-blur-sm", col.color.split(" ")[2])}>
                                        <div className="flex items-center gap-2">
                                            <div className={cn("w-3 h-3 rounded-full", col.color.split(" ")[1].replace('text-', 'bg-'))} />
                                            <span className="font-semibold text-sm">{col.title}</span>
                                            <Badge variant="secondary" className="px-1.5 h-5 text-[10px] min-w-[20px] justify-center">
                                                {getColumnTickets(col.id).length}
                                            </Badge>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="h-4 w-4 text-muted-foreground" /></Button>
                                    </div>

                                    {/* Droppable Area */}
                                    <Droppable droppableId={col.id}>
                                        {(provided, snapshot) => (
                                            <ScrollArea className="flex-1">
                                                <div
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    className={cn("p-3 space-y-3 min-h-[150px]", snapshot.isDraggingOver ? "bg-muted/50" : "")}
                                                >
                                                    {getColumnTickets(col.id).map((ticket, index) => (
                                                        <Draggable key={ticket.id} draggableId={ticket.id} index={index}>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    style={{ ...provided.draggableProps.style }}
                                                                    className={cn("transition-all duration-200", snapshot.isDragging ? "rotate-2 scale-105 shadow-xl z-50" : "")}
                                                                >
                                                                    <Card className="border shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group">
                                                                        <CardContent className="p-3 space-y-3">
                                                                            {/* Top Row: Tags & ID */}
                                                                            <div className="flex justify-between items-start">
                                                                                <Badge variant="outline" className={cn("text-[10px] font-medium border-0 px-2 py-0.5", getSeverityColor(ticket.severity))}>
                                                                                    {ticket.severity.toUpperCase()}
                                                                                </Badge>
                                                                                <span className="text-[10px] font-mono text-muted-foreground">{ticket.id}</span>
                                                                            </div>

                                                                            {/* Main Content */}
                                                                            <div>
                                                                                <h4 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">{ticket.type}</h4>
                                                                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                                                                                    {ticket.description}
                                                                                </p>
                                                                            </div>

                                                                            {/* Context Info */}
                                                                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-muted/40 p-1.5 rounded-md">
                                                                                <span className="font-medium text-foreground">{ticket.orderId}</span>
                                                                                <Separator orientation="vertical" className="h-3" />
                                                                                <span className={cn(ticket.customerTier === 'Platinum' ? "text-purple-600 font-medium" : "")}>{ticket.customerTier} Customer</span>
                                                                            </div>

                                                                            <Separator />

                                                                            {/* Footer: User & Time */}
                                                                            <div className="flex items-center justify-between pt-1">
                                                                                <div className="flex items-center gap-2">
                                                                                    {ticket.assignee ? (
                                                                                        <div className="flex items-center gap-1.5" title={`Assigned to ${ticket.assignee.name}`}>
                                                                                            <Avatar className="h-5 w-5 border">
                                                                                                <AvatarFallback className="text-[9px] bg-primary/10 text-primary">
                                                                                                    {ticket.assignee.name.charAt(0)}
                                                                                                </AvatarFallback>
                                                                                            </Avatar>
                                                                                            <span className="text-[10px] font-medium text-foreground">{ticket.assignee.name.split(' ')[0]}</span>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div className="flex items-center gap-1 text-muted-foreground">
                                                                                            <div className="h-5 w-5 rounded-full border border-dashed flex items-center justify-center">
                                                                                                <Plus className="h-3 w-3" />
                                                                                            </div>
                                                                                            <span className="text-[10px]">Assign</span>
                                                                                        </div>
                                                                                    )}
                                                                                </div>

                                                                                <div className={cn("flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-sm",
                                                                                    new Date(ticket.slaDeadline) < new Date() ? "bg-red-100 text-red-600" : "bg-muted text-muted-foreground"
                                                                                )}>
                                                                                    <Clock className="h-3 w-3" />
                                                                                    {new Date(ticket.slaDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                                </div>
                                                                            </div>
                                                                        </CardContent>
                                                                    </Card>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            </ScrollArea>
                                        )}
                                    </Droppable>
                                </div>
                            ))}
                        </div>
                    </div>
                </DragDropContext>
            )}
            <AddExceptionTicketDialog open={isAddTicketOpen} onOpenChange={setIsAddTicketOpen} onTicketCreated={fetchTickets} />
        </div>
    );
};

export default ExceptionWorkflow;
