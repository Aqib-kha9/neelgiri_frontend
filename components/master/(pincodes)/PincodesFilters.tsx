// components/master/pincodes/PincodesFilters.tsx
import { Search, Filter, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pincode } from "./types";

interface PincodesFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  stateFilter: string;
  onStateFilterChange: (value: string) => void;
  districtFilter: string;
  onDistrictFilterChange: (value: string) => void;
  mappingFilter: string;
  onMappingFilterChange: (value: string) => void;
  branchStatusFilter: string;
  onBranchStatusFilterChange: (value: string) => void;
  states: string[];
  districts: string[];
  onRefresh: () => void;
}

const PincodesFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  stateFilter,
  onStateFilterChange,
  districtFilter,
  onDistrictFilterChange,
  mappingFilter,
  onMappingFilterChange,
  branchStatusFilter,
  onBranchStatusFilterChange,
  states,
  districts,
  onRefresh,
}: PincodesFiltersProps) => {

  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          {/* Search Bar Section */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by pincode, city, state, district..."
              className="pl-10 rounded-xl w-full"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Filters and Refresh Button Section */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                <SelectTrigger className="w-full sm:w-40 rounded-xl">
                  <SelectValue placeholder="Global Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Global Status</SelectItem>
                  <SelectItem value="true">Globally Serviceable</SelectItem>
                  <SelectItem value="false">Globally Disabled</SelectItem>
                </SelectContent>
              </Select>

              {/* Mapped Filter Component */}
              <Select value={mappingFilter} onValueChange={onMappingFilterChange}>
                <SelectTrigger className="w-full sm:w-40 rounded-xl">
                  <SelectValue placeholder="Mapping" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Mapping</SelectItem>
                  <SelectItem value="mapped">Mapped to Branch</SelectItem>
                  <SelectItem value="unmapped">Not Mapped</SelectItem>
                </SelectContent>
              </Select>

              {/* Branch Activity Status Filter */}
              <Select value={branchStatusFilter} onValueChange={onBranchStatusFilterChange}>
                <SelectTrigger className="w-full sm:w-40 rounded-xl">
                  <SelectValue placeholder="Branch Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branch Status</SelectItem>
                  <SelectItem value="true">Active at Branch</SelectItem>
                  <SelectItem value="false">Off by Branch</SelectItem>
                </SelectContent>
              </Select>

              <Select value={stateFilter} onValueChange={onStateFilterChange}>
                <SelectTrigger className="w-full sm:w-40 rounded-xl">
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={districtFilter} onValueChange={onDistrictFilterChange}>
                <SelectTrigger className="w-full sm:w-40 rounded-xl">
                  <SelectValue placeholder="District" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  {districts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              onClick={onRefresh}
              className="gap-2 rounded-xl border-border/70 w-full md:w-auto mt-1 md:mt-0"
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

export default PincodesFilters;
