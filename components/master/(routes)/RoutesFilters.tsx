
import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RoutesFiltersProps {
    searchTerm: string;
    onSearchChange: (val: string) => void;
    statusFilter: string;
    onStatusChange: (val: string) => void;
    typeFilter: string;
    onTypeChange: (val: string) => void;
}

const RoutesFilters = ({
    searchTerm, onSearchChange, statusFilter, onStatusChange, typeFilter, onTypeChange
}: RoutesFiltersProps) => {
    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-3">
                <div className="flex flex-col md:flex-row gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search code, city..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10 bg-background/50"
                        />
                    </div>

                    <Select value={typeFilter} onValueChange={onTypeChange}>
                        <SelectTrigger className="w-[150px] bg-background/50">
                            <SelectValue placeholder="Route Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Types</SelectItem>
                            <SelectItem value="LINEHAUL">Linehaul</SelectItem>
                            <SelectItem value="FEEDER">Feeder</SelectItem>
                            <SelectItem value="LAST_MILE">Last Mile</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={onStatusChange}>
                        <SelectTrigger className="w-[150px] bg-background/50">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Status</SelectItem>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="INACTIVE">Inactive</SelectItem>
                            <SelectItem value="BLOCKED">Blocked</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button variant="outline" size="icon" onClick={() => {
                        onSearchChange("");
                        onStatusChange("ALL");
                        onTypeChange("ALL");
                    }}>
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default RoutesFilters;
