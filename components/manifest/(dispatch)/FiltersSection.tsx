// app/dashboard/manifest/dispatch/components/FiltersSection.tsx
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
import { Search, Filter, RefreshCw } from "lucide-react";

interface FiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  hubFilter: string;
  setHubFilter: (filter: string) => void;
  vehicleFilter: string;
  setVehicleFilter: (filter: string) => void;
}

const FiltersSection = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  hubFilter,
  setHubFilter,
  vehicleFilter,
  setVehicleFilter,
}: FiltersProps) => {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by manifest, vehicle, driver, origin..."
                className="pl-10 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40 rounded-xl">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="loading">Loading</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={hubFilter} onValueChange={setHubFilter}>
                <SelectTrigger className="w-full sm:w-40 rounded-xl">
                  <SelectValue placeholder="Hub" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Hubs</SelectItem>
                  <SelectItem value="Kolkata Central Hub">Kolkata</SelectItem>
                  <SelectItem value="Mumbai Central Hub">Mumbai</SelectItem>
                  <SelectItem value="Bangalore Central Hub">
                    Bangalore
                  </SelectItem>
                  <SelectItem value="Delhi Central Hub">Delhi</SelectItem>
                  <SelectItem value="Chennai Central Hub">Chennai</SelectItem>
                </SelectContent>
              </Select>

              <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
                <SelectTrigger className="w-full sm:w-40 rounded-xl">
                  <SelectValue placeholder="Vehicle Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="truck">Truck</SelectItem>
                  <SelectItem value="van">Van</SelectItem>
                  <SelectItem value="tempo">Tempo</SelectItem>
                  <SelectItem value="container">Container</SelectItem>
                  <SelectItem value="express">Express Vehicle</SelectItem>
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
