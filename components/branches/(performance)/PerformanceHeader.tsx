import {
    TrendingUp,
    Target,
    Download,
    Upload,
    BarChart2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PerformanceHeaderProps {
    onImport: () => void;
    onExport: () => void;
}

export const PerformanceHeader = ({ onImport, onExport }: PerformanceHeaderProps) => {
    return (
        <section className="rounded-3xl border border-border/70 bg-card/95 p-7 shadow-card">
            <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-5">
                <div className="space-y-3">
                    <Badge className="rounded-full bg-primary/15 px-4 py-1 text-primary">
                        Performance Analytics
                    </Badge>
                    <div className="space-y-2">
                        <h1 className="text-display-1 leading-tight">
                            Branch Performance
                        </h1>
                        <p className="max-w-2xl text-body">
                            Detailed performance metrics across your entire branch network.
                            Monitor KPIs, delivery success rates, and customer satisfaction in real-time.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1">
                            <BarChart2 className="h-3.5 w-3.5 text-primary" />
                            Monthly Analysis
                        </span>
                        <span className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
                            <Target className="h-3.5 w-3.5 text-success" />
                            94% SLA Compliance
                        </span>
                        <span className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
                            <TrendingUp className="h-3.5 w-3.5 text-warning" />
                            +2.4% vs Last Month
                        </span>
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                        <Button
                            className="gap-2 rounded-lg bg-primary text-primary-foreground shadow-brand"
                            onClick={onExport}
                        >
                            <Download className="h-4 w-4" />
                            Export Report
                        </Button>
                        <Button
                            variant="outline"
                            className="gap-2 rounded-lg border-border/70"
                            onClick={onImport}
                        >
                            <Upload className="h-4 w-4" />
                            Import Data
                        </Button>
                    </div>
                    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs">
                        <div className="flex items-center justify-between text-muted-foreground">
                            <span>Last updated</span>
                            <span className="font-semibold text-foreground">Just now</span>
                        </div>
                        <div className="flex items-center justify-between text-muted-foreground">
                            <span>Reporting Period</span>
                            <span className="font-semibold text-foreground">Dec 2024</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
