
import { Route, Plus, Download, Upload, Map, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface RoutesHeaderProps {
    count: number;
    onAdd: () => void;
}

const RoutesHeader = ({ count, onAdd }: RoutesHeaderProps) => {
    return (
        <section className="flex flex-col gap-4 rounded-3xl border border-border/70 bg-card/95 p-7 shadow-card backdrop-blur-3xl md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="gap-1.5 rounded-full px-3 py-1 text-sm font-medium border-primary/20 bg-primary/5 text-primary">
                        <Map className="h-3.5 w-3.5" />
                        Network Logistics
                    </Badge>
                    <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1 text-xs text-muted-foreground">
                        Optimization Active
                    </Badge>
                </div>
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Route Master
                    </h1>
                    <p className="max-w-xl text-base text-muted-foreground/90">
                        Configure logistics corridors, define transit times, and manage stopovers for efficient delivery planning.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                    <div className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-sm text-muted-foreground">
                        <Route className="h-3.5 w-3.5" />
                        <span>{count} Active Routes</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-sm text-muted-foreground">
                        <ArrowRightLeft className="h-3.5 w-3.5 text-blue-600" />
                        <span>Return Trips Configured</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button variant="outline" className="h-11 rounded-xl border-border/60 bg-background/50 px-5 hover:bg-muted/50">
                    <Upload className="mr-2 h-4 w-4 text-muted-foreground" />
                    Import
                </Button>
                <Button variant="outline" className="h-11 rounded-xl border-border/60 bg-background/50 px-5 hover:bg-muted/50">
                    <Download className="mr-2 h-4 w-4 text-muted-foreground" />
                    Export
                </Button>
                <Button onClick={onAdd} className="h-11 rounded-xl px-6 shadow-lg transition-all hover:scale-105 active:scale-95">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Route
                </Button>
            </div>
        </section>
    );
};

export default RoutesHeader;
