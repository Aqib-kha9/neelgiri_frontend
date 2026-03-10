import { Search, Package, QrCode } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import { statusConfig, priorityConfig } from "./data/statusConfig";

interface ShipmentsListProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  priorityFilter: string;
  setPriorityFilter: (value: string) => void;
  filteredShipments: any[];
  selectedShipment: any;
  setSelectedShipment: (shipment: any) => void;
  lastUpdated: Date;
}

const ShipmentsList = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  filteredShipments,
  selectedShipment,
  setSelectedShipment,
  lastUpdated,
}: ShipmentsListProps) => {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              Active Shipments
            </p>
            <p className="text-xs text-muted-foreground">
              Real-time tracking updates
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Updated {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by AWB, receiver, phone..."
              className="pl-10 rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full rounded-xl">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="out_for_delivery">
                  Out for Delivery
                </SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full rounded-xl">
                <SelectValue placeholder="All Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Shipments List */}
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {filteredShipments.map((shipment) => (
            <Card
              key={shipment.id}
              className={`cursor-pointer transition-all border-2 ${
                selectedShipment.id === shipment.id
                  ? "border-primary shadow-lg"
                  : "border-border/70 hover:border-primary/50"
              } rounded-xl`}
              onClick={() => setSelectedShipment(shipment)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-semibold text-foreground">
                        {shipment.awbNumber}
                      </p>
                      <QrCode className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <PriorityBadge
                      priority={
                        shipment.priority as keyof typeof priorityConfig
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">To:</span>
                      <span className="font-medium">
                        {shipment.receiver.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Current:</span>
                      <span className="font-medium">
                        {shipment.currentStatus}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">ETA:</span>
                      <span className="font-medium">
                        {new Date(
                          shipment.tracking.eta.predicted
                        ).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <StatusBadge
                      status={shipment.status as keyof typeof statusConfig}
                    />
                    <div className="text-xs text-muted-foreground">
                      {
                        shipment.tracking.currentLocation.timestamp.split(
                          " "
                        )[1]
                      }
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredShipments.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No shipments found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipmentsList;
