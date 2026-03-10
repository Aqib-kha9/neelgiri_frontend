
import { UserCheck, Plus, Download, Upload, Users, ShieldCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface DriversHeaderProps {
    count: number;
    onAdd: () => void;
}

const DriversHeader = ({ count, onAdd }: DriversHeaderProps) => {
    return (
        <section className="flex flex-col gap-4 rounded-3xl border border-border/70 bg-card/95 p-7 shadow-card backdrop-blur-3xl md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="gap-1.5 rounded-full px-3 py-1 text-sm font-medium border-primary/20 bg-primary/5 text-primary">
                        <UserCheck className="h-3.5 w-3.5" />
                        Fleet Personnel
                    </Badge>
                    <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1 text-xs text-muted-foreground">
                        v2.0 System
                    </Badge>
                </div>
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Driver Master
                    </h1>
                    <p className="max-w-xl text-base text-muted-foreground/90">
                        Manage driver profiles, license verification, compliance status, and vehicle assignments efficiently.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                    <div className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-sm text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        <span>{count} Total Pilots</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-sm text-muted-foreground">
                        <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
                        <span>KYC Verified</span>
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
                    Add Driver
                </Button>
            </div>
        </section>
    );
};

export default DriversHeader;
