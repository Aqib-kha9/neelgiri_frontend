
import {
    Edit,
    Trash2,
    MoreHorizontal,
    Map,
    Clock,
    ArrowRight,
    MapPin,
    Truck,
    Navigation,
    Route as RouteIcon,
    IndianRupee,
    CalendarClock,
    ArrowLeftRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Route } from "./types";

interface RoutesListProps {
    routes: Route[];
    onEdit: (route: Route) => void;
    onDelete: (id: string) => void;
}

const RoutesList = ({ routes, onEdit, onDelete }: RoutesListProps) => {

    const getStatusColor = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return "bg-green-500/10 text-green-600 border-green-200/50";
            case "INACTIVE":
                return "bg-slate-500/10 text-slate-600 border-slate-200/50";
            case "BLOCKED":
                return "bg-red-500/10 text-red-600 border-red-200/50";
            default:
                return "bg-slate-500/10 text-slate-600 border-slate-200/50";
        }
    };

    if (routes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center rounded-3xl border border-border/60 bg-card/50 border-dashed">
                <div className="p-4 rounded-full bg-muted/50 mb-4">
                    <Map className="h-10 w-10 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">No routes found</h3>
                <p className="text-muted-foreground max-w-sm mt-1">
                    We couldn't find any routes matching your search criteria. Try adjusting your filters or add a new route.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-3xl border border-border/60 bg-card/95 shadow-sm overflow-hidden relative flex flex-col">
            <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent pb-1">
                <Table className="min-w-[1200px]">
                    <TableHeader className="bg-muted/40">
                        <TableRow className="hover:bg-transparent border-border/60">
                            <TableHead className="w-[180px] pl-6 font-semibold text-muted-foreground whitespace-nowrap">Route & Type</TableHead>
                            <TableHead className="w-[260px] font-semibold text-muted-foreground whitespace-nowrap">Path (Origin &rarr; Dest)</TableHead>
                            <TableHead className="w-[200px] font-semibold text-muted-foreground whitespace-nowrap">Logistics & Cost</TableHead>
                            <TableHead className="w-[100px] font-semibold text-muted-foreground whitespace-nowrap">Stops</TableHead>
                            <TableHead className="w-[180px] font-semibold text-muted-foreground whitespace-nowrap">Schedule</TableHead>
                            <TableHead className="w-[100px] font-semibold text-muted-foreground whitespace-nowrap">Status</TableHead>
                            <TableHead className="w-[60px] text-right font-semibold text-muted-foreground pr-6 whitespace-nowrap">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {routes.map((route) => (
                            <TableRow key={route.id} className="group hover:bg-muted/30 border-border/50">
                                <TableCell className="pl-6 font-medium text-foreground">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                <RouteIcon className="h-4 w-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm">{route.code}</span>
                                                <span className="text-[10px] text-muted-foreground font-mono">ID: {route.id}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="text-[10px] px-1.5 h-5 font-medium border-border/50">
                                                {route.type.replace("_", " ")}
                                            </Badge>
                                            {route.isReturnRoute && (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Badge variant="outline" className="text-[10px] px-1.5 h-5 font-medium border-blue-200 bg-blue-50 text-blue-700 gap-1">
                                                                <ArrowLeftRight className="h-3 w-3" /> Return
                                                            </Badge>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Return Trip Configured</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col min-w-[100px]">
                                            <span className="font-semibold text-sm text-foreground whitespace-nowrap">{route.sourceCity}</span>
                                            <span className="text-[11px] text-muted-foreground truncate max-w-[120px]" title={route.sourceHub}>{route.sourceHub}</span>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                                        <div className="flex flex-col min-w-[100px]">
                                            <span className="font-semibold text-sm text-foreground whitespace-nowrap">{route.destinationCity}</span>
                                            <span className="text-[11px] text-muted-foreground truncate max-w-[120px]" title={route.destinationHub}>{route.destinationHub}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="align-top py-4">
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap" title="Total Distance">
                                            <Navigation className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                                            <span className="font-medium text-foreground">{route.totalDistanceKm} km</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap" title="Total TAT">
                                            <Clock className="h-3.5 w-3.5 text-orange-500/70 shrink-0" />
                                            <span>{route.totalTransitTimeHours} hrs</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap" title="Vehicle Requirement">
                                            <Truck className="h-3.5 w-3.5 text-blue-500/70 shrink-0" />
                                            <span className="truncate max-w-[100px]">{route.vehicleTypeRequired || "Any"}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap" title="Base Cost">
                                            <IndianRupee className="h-3.5 w-3.5 text-green-600/70 shrink-0" />
                                            <span className="font-medium text-green-700">
                                                {route.baseCost ? route.baseCost.toLocaleString() : "0"}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {route.stops.length > 0 ? (
                                        <div className="flex flex-col items-start gap-1">
                                            <Badge variant="secondary" className="h-6 gap-1.5 px-2.5 font-mono text-xs">
                                                {route.stops.length}
                                            </Badge>
                                            <span className="text-[10px] text-muted-foreground">Touchpoints</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-muted-foreground italic pl-1">Direct</span>
                                    )}
                                </TableCell>
                                <TableCell className="align-top py-4">
                                    <div className="flex flex-col gap-2">
                                        {route.schedule && route.schedule.length > 0 ? (
                                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                {route.schedule.slice(0, 4).map(day => (
                                                    <span key={day} className="text-[9px] font-bold font-mono bg-muted text-foreground/70 px-1.5 py-0.5 rounded-[4px] border border-border">
                                                        {day.slice(0, 3)}
                                                    </span>
                                                ))}
                                                {route.schedule.length > 4 && (
                                                    <span className="text-[9px] text-muted-foreground px-1 self-center">+more</span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">-</span>
                                        )}
                                        {route.departureTime && (
                                            <div className="flex items-center gap-1.5 text-[10px] bg-amber-500/10 text-amber-600 font-medium px-2 py-0.5 rounded border border-amber-200/50 w-fit whitespace-nowrap">
                                                <CalendarClock className="h-3 w-3 text-amber-500" />
                                                Departs at {route.departureTime}
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-none ${route.status === 'ACTIVE'
                                            ? 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200'
                                            : route.status === 'BLOCKED'
                                                ? 'bg-red-100 text-red-700 hover:bg-red-200 border-red-200'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                                            }`}
                                    >
                                        {route.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-[160px] rounded-xl">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => onEdit(route)}>
                                                <Edit className="mr-2 h-4 w-4" /> Edit Route
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                onClick={() => onDelete(route.id)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default RoutesList;
