import {
    Users,
    Plus,
    Download,
    Upload,
    BarChart3,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PartnerHeaderProps {
    onImport: () => void;
    onExport: () => void;
    onAddPartner: () => void;
}

export const PartnerHeader = ({ onImport, onExport, onAddPartner }: PartnerHeaderProps) => {
    return (
        <section className="rounded-3xl border border-border/70 bg-card/95 p-7 shadow-card">
            <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-5">
                <div className="space-y-3">
                    <Badge className="rounded-full bg-primary/15 px-4 py-1 text-primary">
                        Partner Network
                    </Badge>
                    <div className="space-y-2">
                        <h1 className="text-display-1 leading-tight">
                            All Partners
                        </h1>
                        <p className="max-w-2xl text-body">
                            Manage your entire partner network. View partner details, performance metrics,
                            and maintain strong business relationships across all locations.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1">
                            <Users className="h-3.5 w-3.5 text-primary" />
                            248 total partners
                        </span>
                        <span className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
                            <BarChart3 className="h-3.5 w-3.5 text-success" />
                            94.8% active rate
                        </span>
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                        <Button
                            className="gap-2 rounded-lg bg-primary text-primary-foreground shadow-brand"
                            onClick={onAddPartner}
                        >
                            <Plus className="h-4 w-4" />
                            Add Partner
                        </Button>
                        <Button
                            variant="outline"
                            className="gap-2 rounded-lg border-border/70"
                            onClick={onExport}
                        >
                            <Download className="h-4 w-4" />
                            Export
                        </Button>
                        <Button
                            variant="outline"
                            className="gap-2 rounded-lg border-border/70"
                            onClick={onImport}
                        >
                            <Upload className="h-4 w-4" />
                            Import
                        </Button>
                    </div>
                    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs">
                        <div className="flex items-center justify-between text-muted-foreground">
                            <span>Last updated</span>
                            <span className="font-semibold text-foreground">Just now</span>
                        </div>
                        <div className="flex items-center justify-between text-muted-foreground">
                            <span>New this month</span>
                            <span className="font-semibold text-foreground">12 partners</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
