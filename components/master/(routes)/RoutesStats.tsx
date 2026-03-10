
import { Route as RouteIcon, TrendingUp, Navigation, AlertTriangle, Truck, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Route } from "./types";

const RoutesStats = ({ routes }: { routes: Route[] }) => {
    const active = routes.filter(r => r.status === 'ACTIVE').length;
    const linehaul = routes.filter(r => r.type === 'LINEHAUL').length;
    const blocked = routes.filter(r => r.status === 'BLOCKED').length;
    const total = routes.length;
    const feeder = routes.filter(r => r.type === 'FEEDER').length;

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card overflow-hidden">
                <CardContent className="p-5">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-sm font-medium text-muted-foreground">Total Routes</span>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold tracking-tight">{total}</h3>
                                <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-xs">
                                    Network
                                </Badge>
                            </div>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-2xl">
                            <RouteIcon className="h-5 w-5 text-primary" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card overflow-hidden">
                <CardContent className="p-5">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-sm font-medium text-muted-foreground">Long Haul</span>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold tracking-tight text-blue-600">{linehaul}</h3>
                                <Badge variant="outline" className="border-blue-500/20 bg-blue-500/5 text-blue-600 text-xs">
                                    Inter-City
                                </Badge>
                            </div>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-2xl">
                            <Truck className="h-5 w-5 text-blue-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card overflow-hidden">
                <CardContent className="p-5">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-sm font-medium text-muted-foreground">Feeder/Local</span>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold tracking-tight text-purple-600">{feeder}</h3>
                                <Badge variant="outline" className="border-purple-500/20 bg-purple-500/5 text-purple-600 text-xs">
                                    Last Mile
                                </Badge>
                            </div>
                        </div>
                        <div className="p-3 bg-purple-500/10 rounded-2xl">
                            <MapPin className="h-5 w-5 text-purple-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card overflow-hidden">
                <CardContent className="p-5">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-sm font-medium text-muted-foreground">Blocked</span>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold tracking-tight text-red-600">{blocked}</h3>
                                <Badge variant="outline" className="border-red-500/20 bg-red-500/5 text-red-600 text-xs">
                                    Inactive
                                </Badge>
                            </div>
                        </div>
                        <div className="p-3 bg-red-500/10 rounded-2xl">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RoutesStats;
