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

interface InventoryFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    categoryFilter: string;
    setCategoryFilter: (category: string) => void;
    statusFilter: string;
    setStatusFilter: (status: string) => void;
    onClearFilters: () => void;
}

export const InventoryFilters = ({
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    onClearFilters,
}: InventoryFiltersProps) => {
    return (
        <Card className="rounded-2xl border-border/70 bg-card/50 p-4 shadow-sm backdrop-blur-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search items by name or SKU..."
                        className="h-10 w-full rounded-xl bg-background/50 pl-10 border-muted-foreground/20 focus-visible:ring-primary/20"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="h-10 w-[160px] rounded-xl border-muted-foreground/20 bg-background/50">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-categories">All Categories</SelectItem>
                            <SelectItem value="Packaging">Packaging</SelectItem>
                            <SelectItem value="Equipment">Equipment</SelectItem>
                            <SelectItem value="Safety">Safety</SelectItem>
                            <SelectItem value="Supplies">Supplies</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="h-10 w-[160px] rounded-xl border-muted-foreground/20 bg-background/50">
                            <SelectValue placeholder="Stock Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-status">All Status</SelectItem>
                            <SelectItem value="in-stock">In Stock</SelectItem>
                            <SelectItem value="low-stock">Low Stock</SelectItem>
                            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                        </SelectContent>
                    </Select>
                    {(searchQuery || categoryFilter !== "all-categories" || statusFilter !== "all-status") && (
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
