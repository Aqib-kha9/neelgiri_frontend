import { Search, Filter, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

interface PerformanceFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    typeFilter: string;
    setTypeFilter: (type: string) => void;
    statusFilter: string;
    setStatusFilter: (status: string) => void;
    onClearFilters: () => void;
}

export const PerformanceFilters = ({
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    onClearFilters,
}: PerformanceFiltersProps) => {
    return (
        <Card className="rounded-2xl border-border/70 bg-card/50 p-4 shadow-sm backdrop-blur-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search branches..."
                        className="h-10 w-full rounded-xl bg-background/50 pl-10 border-muted-foreground/20 focus-visible:ring-primary/20"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="h-10 w-[160px] rounded-xl border-muted-foreground/20 bg-background/50">
                            <SelectValue placeholder="Branch Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-types">All Types</SelectItem>
                            <SelectItem value="company">Company Owned</SelectItem>
                            <SelectItem value="partner">Partner</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="h-10 w-[160px] rounded-xl border-muted-foreground/20 bg-background/50">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-status">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="warning">Warning</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                    </Select>
                    {/* <Button
                        variant="outline"
                        className="h-10 gap-2 rounded-xl border-dashed border-primary/30 text-primary hover:bg-primary/5 hover:text-primary hover:border-primary/50"
                    >
                        <Filter className="h-4 w-4" />
                        More Filters
                    </Button> */}
                    {(searchQuery || typeFilter !== "all-types" || statusFilter !== "all-status") && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClearFilters}
                            className="h-10 w-10 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
                            title="Clear Filters"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
};
