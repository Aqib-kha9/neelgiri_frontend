import { Tag, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RateRule } from "./types";

interface RatesStatsProps {
    rates: RateRule[];
}

const RatesStats = ({ rates }: RatesStatsProps) => {
    const stats = {
        totalRates: rates.length,
        activeRates: rates.filter(
            (r) => r.isActive && new Date(r.validTo) >= new Date()
        ).length,
        expiringSoon: rates.filter((r) => {
            const daysToExpiry = Math.ceil(
                (new Date(r.validTo).getTime() - new Date().getTime()) /
                (1000 * 3600 * 24)
            );
            return daysToExpiry <= 30 && daysToExpiry > 0;
        }).length,
        expiredRates: rates.filter((r) => new Date(r.validTo) < new Date()).length,
    };

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card overflow-hidden">
                <CardContent className="p-5">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-sm font-medium text-muted-foreground">Total Rules</span>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold tracking-tight">{stats.totalRates}</h3>
                                <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-xs">
                                    Configured
                                </Badge>
                            </div>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-2xl">
                            <Tag className="h-5 w-5 text-primary" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card overflow-hidden">
                <CardContent className="p-5">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-sm font-medium text-muted-foreground">Active Rules</span>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold tracking-tight text-green-600">{stats.activeRates}</h3>
                                <Badge variant="outline" className="border-green-500/20 bg-green-500/5 text-green-600 text-xs">
                                    Running
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
                            <span className="text-sm font-medium text-muted-foreground">Expiring Soon</span>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold tracking-tight text-orange-600">{stats.expiringSoon}</h3>
                                <Badge variant="outline" className="border-orange-500/20 bg-orange-500/5 text-orange-600 text-xs">
                                    Action Needed
                                </Badge>
                            </div>
                        </div>
                        <div className="p-3 bg-orange-500/10 rounded-2xl">
                            <AlertCircle className="h-5 w-5 text-orange-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card overflow-hidden">
                <CardContent className="p-5">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-sm font-medium text-muted-foreground">Expired</span>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold tracking-tight text-red-600">{stats.expiredRates}</h3>
                                <Badge variant="outline" className="border-red-500/20 bg-red-500/5 text-red-600 text-xs">
                                    Inactive
                                </Badge>
                            </div>
                        </div>
                        <div className="p-3 bg-red-500/10 rounded-2xl">
                            <Clock className="h-5 w-5 text-red-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RatesStats;
