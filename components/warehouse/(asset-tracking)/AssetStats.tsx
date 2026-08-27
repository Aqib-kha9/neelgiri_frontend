import { Card, CardContent } from "@/components/ui/card";
import { Box, Activity, Wrench, TrendingDown } from "lucide-react";
import { AssetStatsResponse, Asset } from "./types";

interface AssetStatsProps {
    stats?: AssetStatsResponse | null;
    assets?: Asset[];
}

export const AssetStats = ({ stats, assets }: AssetStatsProps) => {
    const total = stats?.total ?? assets?.length ?? 0;
    const active = stats?.active ?? assets?.filter(a => a.status === "active").length ?? 0;
    const maintenance = stats?.maintenance ?? assets?.filter(a => a.status === "maintenance").length ?? 0;
    const totalCurrentValue = stats?.totalCurrentValue ?? assets?.reduce((acc, a) => acc + (a.currentValue || 0), 0) ?? 0;
    const totalPurchaseValue = stats?.totalPurchaseValue ?? assets?.reduce((acc, a) => acc + (a.purchaseValue || 0), 0) ?? 0;
    const depreciation = totalPurchaseValue - totalCurrentValue;

    const displayStats = [
        {
            title: "Total Assets",
            value: total.toString(),
            change: `${total}`,
            trend: "up" as const,
            icon: Box,
            description: "Tracked items",
        },
        {
            title: "Active Assets",
            value: active.toString(),
            change: `${active}`,
            trend: "up" as const,
            icon: Activity,
            description: "In operation",
        },
        {
            title: "Under Maintenance",
            value: maintenance.toString(),
            change: `${maintenance}`,
            trend: "down" as const,
            icon: Wrench,
            description: "Being serviced",
        },
        {
            title: "Depreciation Value",
            value: `₹${(depreciation / 100000).toFixed(2)}L`,
            change: `${depreciation.toLocaleString("en-IN")}`,
            trend: "down" as const,
            icon: TrendingDown,
            description: "This quarter",
        },
    ];

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {displayStats.map((stat, index) => (
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
                            <div
                                className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.title === "Under Maintenance"
                                    ? "bg-warning/10 text-warning"
                                    : stat.title === "Depreciation Value"
                                        ? "bg-error/10 text-error"
                                        : "bg-primary/10 text-primary"
                                    }`}
                            >
                                <stat.icon className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
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
