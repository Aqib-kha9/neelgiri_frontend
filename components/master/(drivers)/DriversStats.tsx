
import { Users, CheckCircle2, Video, AlertOctagon, Timer, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Driver } from "./types";

const DriversStats = ({ drivers }: { drivers: Driver[] }) => {
    const active = drivers.filter(d => d.status === 'ACTIVE').length;
    const verified = drivers.filter(d => d.verificationStatus === 'VERIFIED').length;
    const pending = drivers.filter(d => d.verificationStatus === 'PENDING').length;
    const total = drivers.length;
    const onLeave = drivers.filter(d => d.status === 'ON_LEAVE').length;

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card overflow-hidden">
                <CardContent className="p-5">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-sm font-medium text-muted-foreground">Total Drivers</span>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold tracking-tight">{total}</h3>
                                <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-xs">
                                    +2 this week
                                </Badge>
                            </div>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-2xl">
                            <Users className="h-5 w-5 text-primary" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card overflow-hidden">
                <CardContent className="p-5">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-sm font-medium text-muted-foreground">Active Duty</span>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold tracking-tight text-green-600">{active}</h3>
                                <Badge variant="outline" className="border-green-500/20 bg-green-500/5 text-green-600 text-xs">
                                    Online
                                </Badge>
                            </div>
                        </div>
                        <div className="p-3 bg-green-500/10 rounded-2xl">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card overflow-hidden">
                <CardContent className="p-5">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-sm font-medium text-muted-foreground">Pending Verification</span>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold tracking-tight text-orange-600">{pending}</h3>
                                <Badge variant="outline" className="border-orange-500/20 bg-orange-500/5 text-orange-600 text-xs">
                                    Action Req.
                                </Badge>
                            </div>
                        </div>
                        <div className="p-3 bg-orange-500/10 rounded-2xl">
                            <ShieldAlert className="h-5 w-5 text-orange-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card overflow-hidden">
                <CardContent className="p-5">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-sm font-medium text-muted-foreground">On Leave</span>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold tracking-tight text-blue-600">{onLeave}</h3>
                                <Badge variant="outline" className="border-blue-500/20 bg-blue-500/5 text-blue-600 text-xs">
                                    Scheduled
                                </Badge>
                            </div>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-2xl">
                            <Timer className="h-5 w-5 text-blue-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DriversStats;
