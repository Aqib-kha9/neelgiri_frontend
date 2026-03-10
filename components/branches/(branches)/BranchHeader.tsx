import {
  Building,
  Activity,
  MapPin,
  Plus,
  Download,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BranchHeaderProps {
  onAddBranch: () => void;
  branchCount: number;
}

export const BranchHeader = ({ onAddBranch, branchCount }: BranchHeaderProps) => {
  return (
    <section className="rounded-3xl border border-border/70 bg-card/95 p-7 shadow-card">
      <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-5">
        <div className="space-y-3">
          <Badge className="rounded-full bg-primary/15 px-4 py-1 text-primary">
            Branch Network Management
          </Badge>
          <div className="space-y-2">
            <h1 className="text-display-1 leading-tight">
              Branch Directory & Operations
            </h1>
            <p className="max-w-2xl text-body">
              Manage all company and partner branches across your delivery
              network. Monitor performance, service areas, and operational
              status in real-time.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1">
              <Building className="h-3.5 w-3.5 text-primary" />
              {branchCount} branches nationwide
            </span>
            <span className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
              <Activity className="h-3.5 w-3.5 text-success" />
              42 active branches
            </span>
            <span className="flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
              <MapPin className="h-3.5 w-3.5 text-warning" />
              124 cities covered
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <Button
              className="gap-2 rounded-lg bg-primary text-primary-foreground shadow-brand"
              onClick={onAddBranch}
            >
              <Plus className="h-4 w-4" />
              Add New Branch
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-lg border-border/70"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-lg border-border/70"
            >
              <Upload className="h-4 w-4" />
              Import
            </Button>
          </div>
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Last branch added</span>
              <span className="font-semibold text-foreground">2 days ago</span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Next audit scheduled</span>
              <span className="font-semibold text-foreground">15 Dec 2024</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
