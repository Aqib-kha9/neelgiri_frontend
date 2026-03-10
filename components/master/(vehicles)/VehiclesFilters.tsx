
import { Search, RotateCcw, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VehiclesFiltersProps {
    searchTerm: string;
    onSearchChange: (val: string) => void;
    statusFilter: string;
    onStatusChange: (val: string) => void;
    typeFilter: string;
    onTypeChange: (val: string) => void;
}

const VehiclesFilters = ({
    searchTerm, onSearchChange, statusFilter, onStatusChange, typeFilter, onTypeChange
}: VehiclesFiltersProps) => {
    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-3">
                <div className="flex flex-col md:flex-row gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search reg no, driver, or make..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10 bg-background/50"
                        />
                    </div>
                    <Select value={typeFilter} onValueChange={onTypeChange}>
                        <SelectTrigger className="w-[150px] bg-background/50">
                            <SelectValue placeholder="Vehicle Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Types</SelectItem>
                            <SelectItem value="TRUCK_10T">Truck 10T</SelectItem>
                            <SelectItem value="TRUCK_5T">Truck 5T</SelectItem>
                            <SelectItem value="PICKUP_VAN">Pickup Van</SelectItem>
                            <SelectItem value="BIKE">Bike</SelectItem>
                            <SelectItem value="CONTAINER_32FT">Container 32ft</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={onStatusChange}>
                        <SelectTrigger className="w-[150px] bg-background/50">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Status</SelectItem>
                            <SelectItem value="AVAILABLE">Available</SelectItem>
                            <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                            <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
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

export default VehiclesFilters;
