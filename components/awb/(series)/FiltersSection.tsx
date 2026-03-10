import { Search, Filter, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface FiltersSectionProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  allocationFilter: string;
  setAllocationFilter: (value: string) => void;
}

const FiltersSection = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  allocationFilter,
  setAllocationFilter,
}: FiltersSectionProps) => {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by series name, prefix, code, or customer..."
                className="pl-10 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40 rounded-xl">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="near_exhaustion">
                    Near Exhaustion
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={allocationFilter}
                onValueChange={setAllocationFilter}
              >
                <SelectTrigger className="w-full sm:w-40 rounded-xl">
                  <SelectValue placeholder="All Allocation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Allocation</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="internal">Internal</SelectItem>
                  <SelectItem value="unallocated">Unallocated</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-full sm:w-40 rounded-xl">
                  <SelectValue placeholder="Service Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="surface">Surface</SelectItem>
                  <SelectItem value="air">Air</SelectItem>
                  <SelectItem value="express">Express</SelectItem>
                  <SelectItem value="international">International</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 w-full lg:w-auto">
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70 flex-1 lg:flex-none"
            >
              <Filter className="h-4 w-4" />
              Advanced Filters
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70 flex-1 lg:flex-none"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FiltersSection;
