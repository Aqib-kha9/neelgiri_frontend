import { useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  RefreshCw,
} from "lucide-react";
import { ShipmentTable } from "../shared/ShipmentTable";
import { ShipmentDetailsDialog } from "../shared/ShipmentDetailsDialog";

interface ShipmentSelectionProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  selectedShipments: any[];
  onToggleShipment: (shipment: any) => void;
  filteredShipments: any[];
  onRefresh?: () => void;
}

const ShipmentSelection = ({
  searchTerm,
  onSearchTermChange,
  selectedShipments,
  onToggleShipment,
  filteredShipments,
  onRefresh
}: ShipmentSelectionProps) => {

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<any>(null);

  const handleViewDetails = (shipment: any) => {
    setSelectedShipment(shipment);
    setDetailsOpen(true);
  };

  return (
    <>
      {/* Search and Filters */}
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col lg:flex-row gap-3 w-full">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by AWB, receiver, phone, city..."
                  className="pl-10 rounded-xl w-full"
                  value={searchTerm}
                  onChange={(e) => onSearchTermChange(e.target.value)}
                />
              </div>

              <div className="flex gap-2 flex-1 lg:flex-none">
                <Select defaultValue="all">
                  <SelectTrigger className="flex-1 lg:w-40 rounded-xl">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="all">
                  <SelectTrigger className="flex-1 lg:w-40 rounded-xl">
                    <SelectValue placeholder="Service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Service</SelectItem>
                    <SelectItem value="express">Express</SelectItem>
                    <SelectItem value="surface">Surface</SelectItem>
                    <SelectItem value="air">Air</SelectItem>
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

      <div className="mt-6">
        <ShipmentTable
          title="Available Shipments"
          description="List of shipments ready for delivery"
          shipments={filteredShipments}
          selectedShipments={selectedShipments}
          onToggleShipment={onToggleShipment}
          onViewDetails={handleViewDetails}
          onActionComplete={onRefresh}
        />
      </div>

      {/* Shipment Details Dialog */}
      {detailsOpen && selectedShipment && (
        <ShipmentDetailsDialog
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
          shipment={selectedShipment}
        />
      )}
    </>
  );
};

export default ShipmentSelection;
