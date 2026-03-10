"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Route, RouteFormData, RouteStop } from "./types";
import { MapPin, Truck, Calendar, Plus, Trash2, ArrowRight, CornerDownRight, Clock, Map } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

interface RouteFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: RouteFormData) => void;
    route: Route | null;
}

const DAYS_OF_WEEK = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const RouteForm = ({ open, onOpenChange, onSave, route }: RouteFormProps) => {
    const [activeTab, setActiveTab] = useState("basic");
    const [formData, setFormData] = useState<RouteFormData>({
        code: "",
        sourceCity: "",
        destinationCity: "",
        sourceHub: "",
        destinationHub: "",
        stops: [],
        schedule: [],
        departureTime: "00:00",
        status: "ACTIVE",
        type: "LINEHAUL",
        isReturnRoute: false,
        baseCost: 0,
        vehicleTypeRequired: "",
    });

    const [newStop, setNewStop] = useState({
        hubName: "",
        distance: 0,
        transit: 0,
        halt: 0
    });

    useEffect(() => {
        if (route) {
            const { id, totalDistanceKm, totalTransitTimeHours, ...rest } = route;
            setFormData(rest);
        } else {
            setFormData({
                code: "",
                sourceCity: "",
                destinationCity: "",
                sourceHub: "",
                destinationHub: "",
                stops: [],
                schedule: [],
                departureTime: "00:00",
                status: "ACTIVE",
                type: "LINEHAUL",
                isReturnRoute: false,
                baseCost: 0,
                vehicleTypeRequired: "",
            });
        }
    }, [route, open]);

    const handleChange = (field: keyof RouteFormData, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleAddStop = () => {
        if (!newStop.hubName) return;
        const stop: RouteStop = {
            id: `STOP-${Date.now()}`,
            hubId: `HUB-${Date.now()}`, // Would integrate with Hub Selector
            hubName: newStop.hubName,
            sequence: formData.stops.length + 1,
            distanceFromPrevKm: newStop.distance,
            transitTimeFromPrevMins: newStop.transit,
            haltTimeMins: newStop.halt
        };

        setFormData(prev => ({
            ...prev,
            stops: [...prev.stops, stop]
        }));
        setNewStop({ hubName: "", distance: 0, transit: 0, halt: 0 });
    };

    const handleRemoveStop = (id: string) => {
        setFormData(prev => ({
            ...prev,
            stops: prev.stops.filter(s => s.id !== id)
        }));
    };

    const toggleDay = (day: string) => {
        setFormData(prev => {
            const days = prev.schedule.includes(day)
                ? prev.schedule.filter(d => d !== day)
                : [...prev.schedule, day];
            return { ...prev, schedule: days };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onOpenChange(false);
    };

    // Calculations for UI feedback
    const totalKm = formData.stops.reduce((sum, s) => sum + (Number(s.distanceFromPrevKm) || 0), 0);
    const totalTimeMins = formData.stops.reduce((sum, s) => sum + (Number(s.transitTimeFromPrevMins) || 0) + (Number(s.haltTimeMins) || 0), 0);
    const totalHours = Math.round(totalTimeMins / 60);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[1000px] sm:w-[1000px] sm:max-w-[1000px] flex flex-col h-full bg-card">
                <SheetHeader className="flex-none pb-6 border-b border-border/40">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Map className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <SheetTitle>{route ? "Manage Route Logistics" : "Create New Route"}</SheetTitle>
                            <SheetDescription>Define network path, timeline, and operational efficiency.</SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto">
                    <form id="route-form" onSubmit={handleSubmit} className="flex flex-col h-full">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                            <div className="px-6 pt-6">
                                <TabsList className="grid w-full grid-cols-3 h-12">
                                    <TabsTrigger value="basic" className="text-sm">Network Path</TabsTrigger>
                                    <TabsTrigger value="stops" className="text-sm">Stop Sequence</TabsTrigger>
                                    <TabsTrigger value="ops" className="text-sm">Schedule & Cost</TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="flex-1 p-6">
                                <TabsContent value="basic" className="mt-0 h-full space-y-8">
                                    {/* Source & Destination */}
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="p-5 rounded-2xl border border-blue-500/10 bg-blue-500/5 space-y-4">
                                            <div className="flex items-center gap-2 text-blue-600 mb-2">
                                                <div className="h-2 w-2 rounded-full bg-blue-500" />
                                                <span className="text-xs font-bold uppercase tracking-wider">Origin Point</span>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="space-y-1">
                                                    <Label>Source City</Label>
                                                    <Input
                                                        placeholder="e.g. Mumbai"
                                                        value={formData.sourceCity}
                                                        onChange={e => handleChange("sourceCity", e.target.value)}
                                                        className="bg-background"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label>Source Hub</Label>
                                                    <Input
                                                        placeholder="e.g. Mumbai Gateway"
                                                        value={formData.sourceHub}
                                                        onChange={e => handleChange("sourceHub", e.target.value)}
                                                        className="bg-background"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-5 rounded-2xl border border-green-500/10 bg-green-500/5 space-y-4">
                                            <div className="flex items-center gap-2 text-green-600 mb-2">
                                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                                <span className="text-xs font-bold uppercase tracking-wider">Destination Point</span>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="space-y-1">
                                                    <Label>Destination City</Label>
                                                    <Input
                                                        placeholder="e.g. Delhi"
                                                        value={formData.destinationCity}
                                                        onChange={e => handleChange("destinationCity", e.target.value)}
                                                        className="bg-background"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label>Destination Hub</Label>
                                                    <Input
                                                        placeholder="e.g. Delhi Hub"
                                                        value={formData.destinationHub}
                                                        onChange={e => handleChange("destinationHub", e.target.value)}
                                                        className="bg-background"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <Label>Route Type</Label>
                                            <Select value={formData.type} onValueChange={(v: any) => handleChange("type", v)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="LINEHAUL">Linehaul (Inter-State)</SelectItem>
                                                    <SelectItem value="FEEDER">Feeder (Intra-State)</SelectItem>
                                                    <SelectItem value="LAST_MILE">Last Mile (City)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Route Code</Label>
                                            <Input
                                                value={formData.code}
                                                onChange={e => handleChange("code", e.target.value)}
                                                placeholder="e.g. BOM-DEL-L1"
                                                className="font-mono uppercase"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Status</Label>
                                            <Select value={formData.status} onValueChange={(v: any) => handleChange("status", v)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                                    <SelectItem value="BLOCKED">Blocked</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="stops" className="mt-0 h-full flex flex-col gap-6">
                                    {/* Visual Timeline Header */}
                                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
                                        <div className="flex items-center gap-4">
                                            <div className="text-sm">
                                                <span className="text-muted-foreground mr-1">Total Distance:</span>
                                                <span className="font-mono font-bold">{totalKm} km</span>
                                            </div>
                                            <div className="h-4 w-[1px] bg-border/50"></div>
                                            <div className="text-sm">
                                                <span className="text-muted-foreground mr-1">Est. Duration:</span>
                                                <span className="font-mono font-bold text-primary">{totalHours}h</span>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                                            {formData.stops.length} Intermediate Stops
                                        </Badge>
                                    </div>

                                    <div className="flex-1 flex gap-6 min-h-0">
                                        {/* Stops List */}
                                        <ScrollArea className="flex-1 pr-4 border-r border-border/40">
                                            <div className="space-y-8 relative pb-10">
                                                {/* Route Line */}
                                                <div className="absolute left-[19px] top-8 bottom-0 w-[2px] bg-border/60 z-0"></div>

                                                {/* Start Node */}
                                                <div className="relative z-10 flex gap-4">
                                                    <div className="h-10 w-10 flex-none rounded-full border-4 border-background bg-blue-100 flex items-center justify-center">
                                                        <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                                                    </div>
                                                    <div className="mt-2">
                                                        <h4 className="font-semibold text-sm">{formData.sourceHub || "Source Hub"}</h4>
                                                        <p className="text-xs text-muted-foreground">Origin</p>
                                                    </div>
                                                </div>

                                                {formData.stops.map((stop, index) => (
                                                    <div key={stop.id} className="relative z-10 flex gap-4 group">
                                                        <div className="h-10 w-10 flex-none rounded-full border-4 border-background bg-muted flex items-center justify-center">
                                                            <span className="text-xs font-mono font-medium text-muted-foreground">{index + 1}</span>
                                                        </div>
                                                        <div className="flex-1 pt-0.5">
                                                            <div className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-card hover:border-primary/30 transition-colors shadow-sm">
                                                                <div>
                                                                    <h4 className="font-medium text-sm">{stop.hubName}</h4>
                                                                    <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                                                                        <span className="flex items-center gap-1"><ArrowRight className="h-3 w-3" /> {stop.distanceFromPrevKm} km</span>
                                                                        <span className="flex items-center gap-1"><Truck className="h-3 w-3" /> {stop.transitTimeFromPrevMins} mins</span>
                                                                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {stop.haltTimeMins} mins halt</span>
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-7 w-7 text-muted-foreground hover:text-red-500"
                                                                    onClick={() => handleRemoveStop(stop.id)}
                                                                >
                                                                    <Trash2 className="h-3.5 w-3.5" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                                {/* End Node */}
                                                <div className="relative z-10 flex gap-4">
                                                    <div className="h-10 w-10 flex-none rounded-full border-4 border-background bg-green-100 flex items-center justify-center">
                                                        <div className="h-3 w-3 rounded-full bg-green-600"></div>
                                                    </div>
                                                    <div className="mt-2">
                                                        <h4 className="font-semibold text-sm">{formData.destinationHub || "Destination Hub"}</h4>
                                                        <p className="text-xs text-muted-foreground">Final Destination</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </ScrollArea>

                                        {/* Add Stop Panel */}
                                        <div className="w-[320px] bg-muted/20 rounded-xl p-5 border border-border/50 h-fit space-y-5">
                                            <div className="space-y-1">
                                                <h4 className="font-semibold text-sm">Add Intermediate Stop</h4>
                                                <p className="text-xs text-muted-foreground">Define next hop details.</p>
                                            </div>
                                            <Separator />
                                            <div className="space-y-3">
                                                <div className="space-y-1">
                                                    <Label className="text-xs">Hub Name</Label>
                                                    <Input
                                                        className="h-8 bg-background"
                                                        placeholder="Select Hub"
                                                        value={newStop.hubName}
                                                        onChange={e => setNewStop({ ...newStop, hubName: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs">Distance (km)</Label>
                                                    <Input
                                                        type="number" className="h-8 bg-background"
                                                        value={newStop.distance}
                                                        onChange={e => setNewStop({ ...newStop, distance: parseInt(e.target.value) })}
                                                    />
                                                    <p className="text-[9px] text-muted-foreground">From previous point</p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="space-y-1">
                                                        <Label className="text-xs">Transit (min)</Label>
                                                        <Input
                                                            type="number" className="h-8 bg-background"
                                                            value={newStop.transit}
                                                            onChange={e => setNewStop({ ...newStop, transit: parseInt(e.target.value) })}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label className="text-xs">Halt (min)</Label>
                                                        <Input
                                                            type="number" className="h-8 bg-background"
                                                            value={newStop.halt}
                                                            onChange={e => setNewStop({ ...newStop, halt: parseInt(e.target.value) })}
                                                        />
                                                    </div>
                                                </div>
                                                <Button size="sm" className="w-full mt-2" onClick={handleAddStop} disabled={!newStop.hubName}>
                                                    <Plus className="h-3.5 w-3.5 mr-2" /> Add Stop
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="ops" className="mt-0 h-full space-y-6">
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-sm flex items-center gap-2">
                                                <Calendar className="h-4 w-4" /> Operational Schedule
                                            </h4>
                                            <div className="grid grid-cols-4 gap-3">
                                                {DAYS_OF_WEEK.map(day => (
                                                    <div
                                                        key={day}
                                                        className={`
                                            cursor-pointer flex items-center justify-center p-2 rounded-lg border text-sm font-medium transition-all
                                            ${formData.schedule.includes(day)
                                                                ? 'bg-primary text-primary-foreground border-primary'
                                                                : 'bg-background hover:bg-muted border-input text-muted-foreground'}
                                        `}
                                                        onClick={() => toggleDay(day)}
                                                    >
                                                        {day}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="pt-2 space-y-2">
                                                <Label>Departure Time</Label>
                                                <Input
                                                    type="time"
                                                    value={formData.departureTime}
                                                    onChange={e => handleChange("departureTime", e.target.value)}
                                                    className="w-[150px]"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-sm flex items-center gap-2">
                                                <Truck className="h-4 w-4" /> Vehicle & Costing
                                            </h4>
                                            <div className="space-y-3">
                                                <div className="space-y-1">
                                                    <Label>Required Vehicle Type</Label>
                                                    <Select
                                                        value={formData.vehicleTypeRequired}
                                                        onValueChange={(v: any) => handleChange("vehicleTypeRequired", v)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Any" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="32FT MXL">32FT MXL Container</SelectItem>
                                                            <SelectItem value="20FT SXL">20FT SXL Container</SelectItem>
                                                            <SelectItem value="TATA 407">Tata 407 (Feeder)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-1">
                                                    <Label>Estimated Base Cost (₹)</Label>
                                                    <Input
                                                        type="number"
                                                        value={formData.baseCost}
                                                        onChange={e => handleChange("baseCost", parseInt(e.target.value))}
                                                    />
                                                    <p className="text-[10px] text-muted-foreground">Includes fuel and toll for one-way trip.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>

                        <SheetFooter className="p-6 border-t border-border/40 mt-auto">
                            <Button variant="outline" onClick={() => onOpenChange(false)} type="button">Cancel</Button>
                            <Button type="submit">Save Configuration</Button>
                        </SheetFooter>
                    </form>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default RouteForm;
