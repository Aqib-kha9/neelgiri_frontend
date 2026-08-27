import { Card, CardContent } from "@/components/ui/card";
import { PartnerStat } from "./types";

interface PartnerStatsProps {
    stats: PartnerStat[];
}

export const PartnerStats = ({ stats }: PartnerStatsProps) => {
    if (stats.length === 0) {
        return (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card
                        key={i}
                        className="relative overflow-hidden rounded-2xl border-border/70 bg-card/95 shadow-card"
                    >
                        <CardContent className="p-6">
                            <div className="h-20 animate-pulse rounded bg-muted/40" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <Card
                    key={index}
                    className="relative overflow-hidden rounded-2xl border-border/70 bg-card/95 shadow-card transition-all hover:shadow-lg"
                >
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </p>
                                <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                                    {stat.value}
                                </div>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <stat.icon className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            {stat.change && (
                                <span
                                    className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${stat.trend === "up"
                                        ? "bg-success/15 text-success"
                                        : stat.trend === "down"
                                            ? "bg-error/15 text-error"
                                            : "bg-muted text-muted-foreground"
                                        }`}
                                >
                                    {stat.change}
                                </span>
                            )}
                            <span className="text-xs text-muted-foreground">
                                {stat.description}
                            </span>
                        </div>
                    </CardContent>
                    <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 translate-y--8 rounded-full bg-primary/5 blur-2xl" />
                </Card>
            ))}
        </div>
    );
};
