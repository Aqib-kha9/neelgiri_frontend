import { Truck, Plus, Download, Upload, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface VehiclesHeaderProps {
    count: number;
    onAdd: () => void;
}

const VehiclesHeader = ({ count, onAdd }: VehiclesHeaderProps) => {
    return (
        <section className="rounded-3xl border border-border/70 bg-card/95 p-7 shadow-card">
            <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-5">
                <div className="space-y-3">
                    <Badge className="rounded-full bg-primary/15 px-4 py-1 text-primary">
                        Fleet Management
                    </Badge>
                    <div className="space-y-2">
                        <h1 className="text-display-1 leading-tight">
                            Vehicle Master & Fleet
                        </h1>
                        <p className="max-w-2xl text-body">
                            Manage your entire fleet, track vehicle status, maintenance schedules,
                            and assignment history from a centralized dashboard.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1">
                            <Truck className="h-3.5 w-3.5 text-primary" />
                            {count} total vehicles
                        </span>
                        <span className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
                            <Activity className="h-3.5 w-3.5 text-success" />
                            GPS Tracking Enabled
                        </span>
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                        <Button
                            className="gap-2 rounded-lg bg-primary text-primary-foreground shadow-brand"
                            onClick={onAdd}
                        >
                            <Plus className="h-4 w-4" />
                            Add Vehicle
                        </Button>
                        <Button variant="outline" className="gap-2 rounded-lg border-border/70">
                            <Download className="h-4 w-4" />
                            Export
                        </Button>
                        <Button variant="outline" className="gap-2 rounded-lg border-border/70">
                            <Upload className="h-4 w-4" />
                            Import
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VehiclesHeader;
