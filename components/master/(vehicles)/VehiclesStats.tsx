import { Truck, AlertTriangle, CheckCircle2, Wrench } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Vehicle } from "./types";

const VehiclesStats = ({ vehicles }: { vehicles: Vehicle[] }) => {
    const available = vehicles.filter(v => v.status === 'AVAILABLE').length;
    const inTransit = vehicles.filter(v => v.status === 'IN_TRANSIT').length;
    const maintenance = vehicles.filter(v => v.status === 'MAINTENANCE').length;
    const total = vehicles.length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
                <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">
                                Total Fleet
                            </p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-foreground">
                                    {total}
                                </span>
                                <Badge variant="secondary" className="rounded-full text-xs">
                                    Registered
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                All vehicles
                            </p>
                        </div>
                        <div className="rounded-2xl bg-primary/10 p-3">
                            <Truck className="h-6 w-6 text-primary" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
                <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">
                                In Transit
                            </p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-foreground">
                                    {inTransit}
                                </span>
                                <Badge variant="default" className="rounded-full text-xs">
                                    Active
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                On route
                            </p>
                        </div>
                        <div className="rounded-2xl bg-blue-500/10 p-3">
                            <Truck className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
                <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">
                                Available
                            </p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-foreground">
                                    {available}
                                </span>
                                <Badge variant="success" className="rounded-full text-xs">
                                    Ready
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Ready for dispatch
                            </p>
                        </div>
                        <div className="rounded-2xl bg-green-500/10 p-3">
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
                <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">
                                Maintenance
                            </p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-foreground">
                                    {maintenance}
                                </span>
                                <Badge variant="destructive" className="rounded-full text-xs">
                                    Service
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Needs attention
                            </p>
                        </div>
                        <div className="rounded-2xl bg-orange-500/10 p-3">
                            <Wrench className="h-6 w-6 text-orange-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default VehiclesStats;
