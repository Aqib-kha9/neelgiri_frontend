"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
    AlertCircle,
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    Clock3,
    IndianRupee,
    Loader2,
    MapPinned,
    Plus,
    Route as RouteIcon,
    Trash2,
    Truck,
    Warehouse,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Route, RouteFormData, RouteStop } from "./types";

interface RouteFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: RouteFormData) => Promise<void> | void;
    route: Route | null;
}

interface HubOption {
    id: string;
    code: string;
    name: string;
    city: string;
    state: string;
    status: string;
}

type FormErrors = Partial<Record<"code" | "sourceHub" | "destinationHub" | "schedule" | "finalLeg", string>>;

const API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";
const DAYS = [
    { value: "MON", label: "Mon" },
    { value: "TUE", label: "Tue" },
    { value: "WED", label: "Wed" },
    { value: "THU", label: "Thu" },
    { value: "FRI", label: "Fri" },
    { value: "SAT", label: "Sat" },
    { value: "SUN", label: "Sun" },
];

const emptyForm = (): RouteFormData => ({
    code: "",
    name: "",
    sourceCity: "",
    destinationCity: "",
    sourceHub: "",
    sourceHubName: "",
    destinationHub: "",
    destinationHubName: "",
    stops: [],
    schedule: [],
    departureTime: "22:00",
    status: "ACTIVE",
    type: "LINEHAUL",
    isReturnRoute: false,
    baseCost: 0,
    vehicleTypeRequired: "",
    finalLegDistanceKm: 0,
    finalLegTransitTimeMins: 0,
});

const numberValue = (value: string) => Math.max(0, Number(value) || 0);
const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
};

const RouteForm = ({ open, onOpenChange, onSave, route }: RouteFormProps) => {
    const [activeTab, setActiveTab] = useState("network");
    const [formData, setFormData] = useState<RouteFormData>(emptyForm);
    const [hubs, setHubs] = useState<HubOption[]>([]);
    const [loadingHubs, setLoadingHubs] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [newStop, setNewStop] = useState({ hubId: "", distance: 0, transit: 0, halt: 30 });

    useEffect(() => {
        if (!open) return;
        setActiveTab("network");
        setErrors({});
        setNewStop({ hubId: "", distance: 0, transit: 0, halt: 30 });
        if (route) {
            const { id, totalDistanceKm, totalTransitTimeHours, ...editable } = route;
            setFormData({ ...emptyForm(), ...editable });
        } else {
            setFormData(emptyForm());
        }
    }, [route, open]);

    useEffect(() => {
        if (!open) return;
        const fetchHubs = async () => {
            setLoadingHubs(true);
            try {
                const token = localStorage.getItem("token");
                const { data } = await axios.get(`${API_BASE}/api/locations`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const list = Array.isArray(data) ? data : data?.data || [];
                setHubs(list.map((hub: any) => ({
                    id: hub._id || hub.id,
                    code: hub.code || "",
                    name: hub.name || "Unnamed hub",
                    city: hub.address?.city || hub.city || "",
                    state: hub.address?.state || hub.state || "",
                    status: hub.status || "ACTIVE",
                })).filter((hub: HubOption) => hub.id && hub.status !== "INACTIVE"));
            } catch {
                setHubs([]);
            } finally {
                setLoadingHubs(false);
            }
        };
        fetchHubs();
    }, [open]);

    const selectedSource = hubs.find((hub) => hub.id === formData.sourceHub);
    const selectedDestination = hubs.find((hub) => hub.id === formData.destinationHub);
    const usedHubIds = new Set([formData.sourceHub, formData.destinationHub, ...formData.stops.map((stop) => stop.hubId)]);

    const metrics = useMemo(() => {
        const stopDistance = formData.stops.reduce((sum, stop) => sum + numberValue(String(stop.distanceFromPrevKm)), 0);
        const stopMinutes = formData.stops.reduce(
            (sum, stop) => sum + numberValue(String(stop.transitTimeFromPrevMins)) + numberValue(String(stop.haltTimeMins)), 0
        );
        const distance = stopDistance + numberValue(String(formData.finalLegDistanceKm));
        const minutes = stopMinutes + numberValue(String(formData.finalLegTransitTimeMins));
        const costPerKm = distance > 0 ? formData.baseCost / distance : 0;
        return { distance, minutes, costPerKm };
    }, [formData.stops, formData.finalLegDistanceKm, formData.finalLegTransitTimeMins, formData.baseCost]);

    const updateField = <K extends keyof RouteFormData>(field: K, value: RouteFormData[K]) => {
        setFormData((current) => ({ ...current, [field]: value }));
        setErrors((current) => ({ ...current, [field]: undefined }));
    };

    const selectHub = (kind: "source" | "destination", hubId: string) => {
        const hub = hubs.find((item) => item.id === hubId);
        if (!hub) return;
        if (kind === "source") {
            setFormData((current) => ({ ...current, sourceHub: hub.id, sourceHubName: hub.name, sourceCity: hub.city }));
            setErrors((current) => ({ ...current, sourceHub: undefined }));
        } else {
            setFormData((current) => ({ ...current, destinationHub: hub.id, destinationHubName: hub.name, destinationCity: hub.city }));
            setErrors((current) => ({ ...current, destinationHub: undefined }));
        }
    };

    const addStop = () => {
        const hub = hubs.find((item) => item.id === newStop.hubId);
        if (!hub || newStop.distance <= 0 || newStop.transit <= 0) return;
        const stop: RouteStop = {
            id: `stop-${Date.now()}`,
            hubId: hub.id,
            hubName: hub.name,
            sequence: formData.stops.length + 1,
            distanceFromPrevKm: newStop.distance,
            transitTimeFromPrevMins: newStop.transit,
            haltTimeMins: newStop.halt,
        };
        setFormData((current) => ({ ...current, stops: [...current.stops, stop] }));
        setNewStop({ hubId: "", distance: 0, transit: 0, halt: 30 });
    };

    const removeStop = (id: string) => {
        setFormData((current) => ({
            ...current,
            stops: current.stops.filter((stop) => stop.id !== id).map((stop, index) => ({ ...stop, sequence: index + 1 })),
        }));
    };

    const toggleDay = (day: string) => {
        setFormData((current) => ({
            ...current,
            schedule: current.schedule.includes(day)
                ? current.schedule.filter((item) => item !== day)
                : [...current.schedule, day],
        }));
        setErrors((current) => ({ ...current, schedule: undefined }));
    };

    const useDailySchedule = () => {
        updateField("schedule", formData.schedule.length === 7 ? [] : DAYS.map((day) => day.value));
    };

    const validate = () => {
        const nextErrors: FormErrors = {};
        if (!formData.code.trim()) nextErrors.code = "A unique route code is required.";
        if (!formData.sourceHub) nextErrors.sourceHub = "Select an origin from Location Master.";
        if (!formData.destinationHub) nextErrors.destinationHub = "Select a destination from Location Master.";
        if (formData.sourceHub && formData.sourceHub === formData.destinationHub) nextErrors.destinationHub = "Origin and destination cannot be the same.";
        if (formData.schedule.length === 0) nextErrors.schedule = "Select at least one operating day.";
        if (formData.finalLegDistanceKm <= 0 || formData.finalLegTransitTimeMins <= 0) {
            nextErrors.finalLeg = "Enter distance and driving time for the final leg to destination.";
        }
        setErrors(nextErrors);
        if (nextErrors.code || nextErrors.sourceHub || nextErrors.destinationHub) setActiveTab("network");
        else if (nextErrors.finalLeg) setActiveTab("stops");
        else if (nextErrors.schedule) setActiveTab("operations");
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!validate()) return;
        setSaving(true);
        try {
            await onSave({ ...formData, code: formData.code.trim().toUpperCase(), name: formData.name?.trim() });
            onOpenChange(false);
        } finally {
            setSaving(false);
        }
    };

    const hasHubMaster = hubs.length > 0;

    return (
        <Sheet open={open} onOpenChange={(value) => !saving && onOpenChange(value)}>
            <SheetContent className="flex h-full w-full flex-col p-0 sm:max-w-[1080px]">
                <SheetHeader className="border-b bg-gradient-to-r from-slate-50 to-background px-7 py-5 dark:from-slate-950">
                    <div className="flex items-start gap-4">
                        <div className="rounded-xl bg-primary p-2.5 text-primary-foreground shadow-sm">
                            <RouteIcon className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <SheetTitle>{route ? "Edit network route" : "Configure network route"}</SheetTitle>
                                <Badge variant="outline" className="font-normal">Route master</Badge>
                            </div>
                            <SheetDescription>
                                Build an executable origin-to-destination lane with movement legs, cut-off schedule, vehicle and trip economics.
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                <form id="route-form" onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex min-h-0 flex-1 flex-col">
                        <div className="border-b px-7 py-3">
                            <TabsList className="grid h-11 w-full grid-cols-3 bg-muted/60">
                                <TabsTrigger value="network" className="gap-2"><MapPinned className="h-4 w-4" /> 1. Network lane</TabsTrigger>
                                <TabsTrigger value="stops" className="gap-2"><Warehouse className="h-4 w-4" /> 2. Movement legs</TabsTrigger>
                                <TabsTrigger value="operations" className="gap-2"><CalendarDays className="h-4 w-4" /> 3. Operations</TabsTrigger>
                            </TabsList>
                        </div>

                        <ScrollArea className="min-h-0 flex-1">
                            <div className="p-7">
                                <TabsContent value="network" className="m-0 space-y-6">
                                    {!loadingHubs && !hasHubMaster && (
                                        <Alert>
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>No active locations were found. Create hubs in Location Master before activating a route.</AlertDescription>
                                        </Alert>
                                    )}

                                    <section className="rounded-xl border bg-card p-5 shadow-sm">
                                        <div className="mb-5 flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold">Lane identity</h3>
                                                <p className="text-sm text-muted-foreground">A short, searchable identity used in trips, manifests and reports.</p>
                                            </div>
                                            <Badge className={formData.status === "ACTIVE" ? "bg-emerald-600" : ""}>{formData.status}</Badge>
                                        </div>
                                        <div className="grid gap-5 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="route-name">Route name</Label>
                                                <Input id="route-name" value={formData.name || ""} onChange={(e) => updateField("name", e.target.value)} placeholder="Mumbai to Delhi nightly linehaul" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="route-code">Route code <span className="text-destructive">*</span></Label>
                                                <Input id="route-code" value={formData.code} onChange={(e) => updateField("code", e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ""))} placeholder="BOM-DEL-LH-01" className="font-mono uppercase" />
                                                {errors.code && <p className="text-xs text-destructive">{errors.code}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Movement type</Label>
                                                <Select value={formData.type} onValueChange={(value: RouteFormData["type"]) => updateField("type", value)}>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="LINEHAUL">Linehaul · hub to hub / inter-state</SelectItem>
                                                        <SelectItem value="FEEDER">Feeder · branch to gateway</SelectItem>
                                                        <SelectItem value="LAST_MILE">Last mile · local delivery run</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Operational status</Label>
                                                <Select value={formData.status} onValueChange={(value: RouteFormData["status"]) => updateField("status", value)}>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="ACTIVE">Active · available for trip planning</SelectItem>
                                                        <SelectItem value="INACTIVE">Inactive · draft / temporarily unused</SelectItem>
                                                        <SelectItem value="BLOCKED">Blocked · operational restriction</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </section>

                                    <section className="rounded-xl border bg-card p-5 shadow-sm">
                                        <div className="mb-5">
                                            <h3 className="font-semibold">Origin and destination</h3>
                                            <p className="text-sm text-muted-foreground">Select controlled hubs from Location Master; city details are filled automatically.</p>
                                        </div>
                                        <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
                                            <div className="space-y-3 rounded-xl border border-blue-200 bg-blue-50/60 p-4 dark:border-blue-900 dark:bg-blue-950/20">
                                                <div className="flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-300"><span className="h-2.5 w-2.5 rounded-full bg-blue-600" /> Origin hub</div>
                                                <Select value={formData.sourceHub} onValueChange={(value) => selectHub("source", value)} disabled={loadingHubs}>
                                                    <SelectTrigger><SelectValue placeholder={loadingHubs ? "Loading hubs..." : "Select dispatch hub"} /></SelectTrigger>
                                                    <SelectContent>
                                                        {hubs.filter((hub) => hub.id !== formData.destinationHub).map((hub) => <SelectItem key={hub.id} value={hub.id}>{hub.code} · {hub.name} ({hub.city})</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                                <div className="min-h-10 text-sm"><span className="text-muted-foreground">City / State</span><p className="font-medium">{selectedSource ? `${selectedSource.city}, ${selectedSource.state}` : "—"}</p></div>
                                                {errors.sourceHub && <p className="text-xs text-destructive">{errors.sourceHub}</p>}
                                            </div>
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-background"><ArrowRight className="h-4 w-4 text-muted-foreground" /></div>
                                            <div className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
                                                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300"><span className="h-2.5 w-2.5 rounded-full bg-emerald-600" /> Destination hub</div>
                                                <Select value={formData.destinationHub} onValueChange={(value) => selectHub("destination", value)} disabled={loadingHubs}>
                                                    <SelectTrigger><SelectValue placeholder={loadingHubs ? "Loading hubs..." : "Select receiving hub"} /></SelectTrigger>
                                                    <SelectContent>
                                                        {hubs.filter((hub) => hub.id !== formData.sourceHub).map((hub) => <SelectItem key={hub.id} value={hub.id}>{hub.code} · {hub.name} ({hub.city})</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                                <div className="min-h-10 text-sm"><span className="text-muted-foreground">City / State</span><p className="font-medium">{selectedDestination ? `${selectedDestination.city}, ${selectedDestination.state}` : "—"}</p></div>
                                                {errors.destinationHub && <p className="text-xs text-destructive">{errors.destinationHub}</p>}
                                            </div>
                                        </div>
                                    </section>
                                </TabsContent>

                                <TabsContent value="stops" className="m-0 space-y-5">
                                    <div className="grid grid-cols-3 gap-3">
                                        <Metric icon={MapPinned} label="Planned distance" value={`${metrics.distance.toLocaleString("en-IN")} km`} />
                                        <Metric icon={Clock3} label="Driving + halt time" value={formatDuration(metrics.minutes)} />
                                        <Metric icon={Warehouse} label="Intermediate hubs" value={String(formData.stops.length)} />
                                    </div>

                                    <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
                                        <section className="rounded-xl border bg-card p-5 shadow-sm">
                                            <div className="mb-5">
                                                <h3 className="font-semibold">Ordered route timeline</h3>
                                                <p className="text-sm text-muted-foreground">Each leg records road distance, drive time and handling halt at the arrival hub.</p>
                                            </div>
                                            <div className="relative space-y-4 before:absolute before:bottom-6 before:left-[17px] before:top-6 before:w-px before:bg-border">
                                                <TimelineNode tone="blue" title={formData.sourceHubName || "Select origin hub"} subtitle="Dispatch origin · departure point" />
                                                {formData.stops.map((stop, index) => (
                                                    <div key={stop.id} className="relative flex gap-4 pl-0">
                                                        <div className="z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-4 border-background bg-slate-200 text-xs font-semibold dark:bg-slate-700">{index + 1}</div>
                                                        <div className="flex flex-1 items-center justify-between rounded-lg border bg-background p-3">
                                                            <div><p className="text-sm font-semibold">{stop.hubName}</p><p className="mt-1 text-xs text-muted-foreground">{stop.distanceFromPrevKm} km · {formatDuration(stop.transitTimeFromPrevMins)} drive · {stop.haltTimeMins}m halt</p></div>
                                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeStop(stop.id)} aria-label={`Remove ${stop.hubName}`}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                                        </div>
                                                    </div>
                                                ))}
                                                <TimelineNode tone="green" title={formData.destinationHubName || "Select destination hub"} subtitle={`${formData.finalLegDistanceKm} km · ${formatDuration(formData.finalLegTransitTimeMins)} final drive`} />
                                            </div>
                                        </section>

                                        <div className="space-y-5">
                                            <section className="rounded-xl border bg-muted/30 p-5">
                                                <h3 className="font-semibold">Add intermediate hub</h3>
                                                <p className="mb-4 text-xs text-muted-foreground">Skip this when the lane is direct.</p>
                                                <div className="space-y-3">
                                                    <div className="space-y-1.5"><Label>Arrival hub</Label><Select value={newStop.hubId} onValueChange={(hubId) => setNewStop((current) => ({ ...current, hubId }))}><SelectTrigger><SelectValue placeholder="Select next hub" /></SelectTrigger><SelectContent>{hubs.filter((hub) => !usedHubIds.has(hub.id)).map((hub) => <SelectItem key={hub.id} value={hub.id}>{hub.code} · {hub.name}</SelectItem>)}</SelectContent></Select></div>
                                                    <div className="grid grid-cols-2 gap-3"><NumberField label="Leg distance (km)" value={newStop.distance} onChange={(distance) => setNewStop((current) => ({ ...current, distance }))} /><NumberField label="Drive time (min)" value={newStop.transit} onChange={(transit) => setNewStop((current) => ({ ...current, transit }))} /></div>
                                                    <NumberField label="Handling halt (min)" value={newStop.halt} onChange={(halt) => setNewStop((current) => ({ ...current, halt }))} />
                                                    <Button type="button" variant="outline" className="w-full" onClick={addStop} disabled={!newStop.hubId || newStop.distance <= 0 || newStop.transit <= 0}><Plus className="mr-2 h-4 w-4" /> Add to timeline</Button>
                                                </div>
                                            </section>

                                            <section className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5 dark:border-emerald-900 dark:bg-emerald-950/20">
                                                <h3 className="font-semibold">Final leg to destination <span className="text-destructive">*</span></h3>
                                                <p className="mb-4 text-xs text-muted-foreground">From {formData.stops.at(-1)?.hubName || formData.sourceHubName || "previous hub"} to {formData.destinationHubName || "destination"}.</p>
                                                <div className="grid grid-cols-2 gap-3"><NumberField label="Distance (km)" value={formData.finalLegDistanceKm} onChange={(value) => updateField("finalLegDistanceKm", value)} /><NumberField label="Drive time (min)" value={formData.finalLegTransitTimeMins} onChange={(value) => updateField("finalLegTransitTimeMins", value)} /></div>
                                                {errors.finalLeg && <p className="mt-2 text-xs text-destructive">{errors.finalLeg}</p>}
                                            </section>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="operations" className="m-0 space-y-5">
                                    <div className="grid gap-5 lg:grid-cols-2">
                                        <section className="rounded-xl border bg-card p-5 shadow-sm">
                                            <div className="mb-5 flex items-start justify-between"><div><h3 className="font-semibold">Dispatch calendar</h3><p className="text-sm text-muted-foreground">Recurring departure from the origin hub.</p></div><CalendarDays className="h-5 w-5 text-muted-foreground" /></div>
                                            <div className="mb-3 flex items-center justify-between"><Label>Operating days <span className="text-destructive">*</span></Label><Button type="button" variant="ghost" size="sm" onClick={useDailySchedule}>{formData.schedule.length === 7 ? "Clear all" : "Select daily"}</Button></div>
                                            <div className="grid grid-cols-7 gap-2">{DAYS.map((day) => <button key={day.value} type="button" onClick={() => toggleDay(day.value)} className={`rounded-lg border px-1 py-2 text-xs font-medium transition-colors ${formData.schedule.includes(day.value) ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}>{day.label}</button>)}</div>
                                            {errors.schedule && <p className="mt-2 text-xs text-destructive">{errors.schedule}</p>}
                                            <div className="mt-5 space-y-2"><Label htmlFor="departure">Scheduled departure</Label><Input id="departure" type="time" value={formData.departureTime} onChange={(e) => updateField("departureTime", e.target.value)} className="max-w-48" /><p className="text-xs text-muted-foreground">Use the origin hub's local time.</p></div>
                                        </section>

                                        <section className="rounded-xl border bg-card p-5 shadow-sm">
                                            <div className="mb-5 flex items-start justify-between"><div><h3 className="font-semibold">Capacity profile</h3><p className="text-sm text-muted-foreground">The default vehicle expected for trip allocation.</p></div><Truck className="h-5 w-5 text-muted-foreground" /></div>
                                            <div className="space-y-2"><Label>Required vehicle</Label><Select value={formData.vehicleTypeRequired || "ANY"} onValueChange={(value) => updateField("vehicleTypeRequired", value === "ANY" ? "" : value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ANY">Any compatible vehicle</SelectItem><SelectItem value="32FT MXL">32FT MXL · 14–15 MT</SelectItem><SelectItem value="32FT SXL">32FT SXL · 7–9 MT</SelectItem><SelectItem value="20FT SXL">20FT SXL · 6–7 MT</SelectItem><SelectItem value="TATA 407">Tata 407 · 2.5 MT</SelectItem><SelectItem value="LCV">LCV / pickup · up to 1.5 MT</SelectItem></SelectContent></Select></div>
                                            <div className="mt-5 rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">Vehicle availability is checked during trip creation; this value acts as the default planning constraint.</div>
                                        </section>
                                    </div>

                                    <section className="rounded-xl border bg-card p-5 shadow-sm">
                                        <div className="mb-5 flex items-start justify-between"><div><h3 className="font-semibold">One-way trip economics</h3><p className="text-sm text-muted-foreground">Expected fixed cost including vendor freight, fuel, toll and driver allowance.</p></div><IndianRupee className="h-5 w-5 text-muted-foreground" /></div>
                                        <div className="grid gap-4 md:grid-cols-3"><div className="space-y-2"><Label htmlFor="cost">Estimated base cost (₹)</Label><Input id="cost" type="number" min="0" value={formData.baseCost} onChange={(e) => updateField("baseCost", numberValue(e.target.value))} /></div><Metric icon={IndianRupee} label="Estimated cost / km" value={metrics.distance ? `₹${metrics.costPerKm.toFixed(2)}` : "—"} /><Metric icon={Clock3} label="Planned transit" value={formatDuration(metrics.minutes)} /></div>
                                    </section>

                                    <Alert className="border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20"><CheckCircle2 className="h-4 w-4 text-emerald-600" /><AlertDescription><strong>Activation check:</strong> active routes become available to auto-routing and trip planning immediately after save. Keep the route inactive while operational approvals are pending.</AlertDescription></Alert>
                                </TabsContent>
                            </div>
                        </ScrollArea>
                    </Tabs>

                    <SheetFooter className="border-t bg-background px-7 py-4 sm:justify-between">
                        <div className="hidden items-center gap-4 text-xs text-muted-foreground sm:flex"><span>{metrics.distance} km planned</span><Separator orientation="vertical" className="h-4" /><span>{formatDuration(metrics.minutes)} transit</span><Separator orientation="vertical" className="h-4" /><span>{formData.schedule.length} operating days</span></div>
                        <div className="flex gap-2"><Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button><Button type="submit" disabled={saving || loadingHubs}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{route ? "Update route" : "Save route configuration"}</Button></div>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
};

const Metric = ({ icon: Icon, label, value }: { icon: typeof MapPinned; label: string; value: string }) => (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-4"><div className="rounded-lg bg-primary/10 p-2 text-primary"><Icon className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">{label}</p><p className="font-semibold">{value}</p></div></div>
);

const TimelineNode = ({ tone, title, subtitle }: { tone: "blue" | "green"; title: string; subtitle: string }) => (
    <div className="relative flex gap-4"><div className={`z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-4 border-background ${tone === "blue" ? "bg-blue-600" : "bg-emerald-600"}`}><span className="h-2 w-2 rounded-full bg-white" /></div><div className="pt-0.5"><p className="text-sm font-semibold">{title}</p><p className="text-xs text-muted-foreground">{subtitle}</p></div></div>
);

const NumberField = ({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) => (
    <div className="space-y-1.5"><Label className="text-xs">{label}</Label><Input type="number" min="0" value={value} onChange={(event) => onChange(numberValue(event.target.value))} /></div>
);

export default RouteForm;
