import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Keep Select for functionality, but verify if Branch uses it. 
// Branch SearchFilters.tsx uses badges for stats, but CustomerFilters had functional dropdowns.
// I will keep the visual structure of SearchFilters.tsx but retain the functional inputs of CustomerFilters.

interface CustomerFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

const CustomerFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: CustomerFiltersProps) => {
  return (
    <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search customers by name, email, or company..."
                className="rounded-xl pl-10"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>

            {/* Integrating the Status Select matching the 'Filter' button aesthetic or replacing it */}
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="w-[180px] rounded-xl border-border/70">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70"
            >
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>

          {/* Replicating the Badge Filters from Branch SearchFilters as clickable or static stats */}
          <div className="flex items-center gap-2 hidden xl:flex">
            <Badge variant="outline" className="rounded-full px-3 py-1">
              Active: 128
            </Badge>
            <Badge variant="outline" className="rounded-full px-3 py-1">
              Corporate: 45
            </Badge>
            <Badge variant="outline" className="rounded-full px-3 py-1">
              Individual: 83
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerFilters;
