import { Search, X } from "lucide-react";
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

interface ReconciliationFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    statusFilter: string;
    setStatusFilter: (status: string) => void;
    onClearFilters: () => void;
}

export const ReconciliationFilters = ({
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    onClearFilters,
}: ReconciliationFiltersProps) => {
    return (
        <Card className="rounded-2xl border-border/70 bg-card/50 p-4 shadow-sm backdrop-blur-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search by item name or SKU..."
                        className="h-10 w-full rounded-xl bg-background/50 pl-10 border-muted-foreground/20 focus-visible:ring-primary/20"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="h-10 w-[180px] rounded-xl border-muted-foreground/20 bg-background/50">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-status">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="discrepancy">Discrepancy</SelectItem>
                        </SelectContent>
                    </Select>
                    {(searchQuery || statusFilter !== "all-status") && (
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
