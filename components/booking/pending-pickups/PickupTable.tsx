import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { Pickup } from "./types";
import {
  Package,
  Phone,
  MapPin,
  Weight,
  QrCode,
  MoreHorizontal,
  Eye,
  UserPlus,
  BarChart3,
  Edit,
  XCircle,
  Download,
} from "lucide-react";

interface PickupTableProps {
  filteredPickups: Pickup[];
  selectedPickups: string[];
  togglePickupSelection: (pickupId: string) => void;
  setSelectedPickups: (pickups: string[]) => void;
}

export const PickupTable = ({
  filteredPickups,
  selectedPickups,
  togglePickupSelection,
  setSelectedPickups,
}: PickupTableProps) => {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold text-foreground">
            Pickup Requests
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {filteredPickups.length} pickups found • {selectedPickups.length}{" "}
            selected
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedPickups.length > 0 && (
            <Badge variant="secondary" className="rounded-full">
              {selectedPickups.length} selected
            </Badge>
          )}
          <Button
            variant="outline"
            className="gap-2 rounded-lg border-border/70"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPickups(filteredPickups.map((p) => p.id));
                    } else {
                      setSelectedPickups([]);
                    }
                  }}
                  checked={
                    selectedPickups.length === filteredPickups.length &&
                    filteredPickups.length > 0
                  }
                />
              </TableHead>
              <TableHead>AWB & Details</TableHead>
              <TableHead>Sender & Receiver</TableHead>
              <TableHead>Package Info</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Rider</TableHead>
              <TableHead>Pickup Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPickups.map((pickup) => (
              <TableRow key={pickup.id} className="group hover:bg-muted/20">
                <TableCell>
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={selectedPickups.includes(pickup.id)}
                    onChange={() => togglePickupSelection(pickup.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-primary" />
                      <p className="font-mono font-semibold text-foreground">
                        {pickup.awbNumber}
                      </p>
                      <QrCode className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ID: {pickup.id}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Booked:{" "}
                      {new Date(pickup.bookingDate).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {pickup.sender.name}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{pickup.sender.phone}</span>
                      </div>
                      <div className="flex items-start gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 mt-0.5" />
                        <span>
                          {pickup.sender.city}, {pickup.sender.pincode}
                        </span>
                      </div>
                    </div>
                    <div className="border-t pt-2">
                      <p className="text-sm font-medium text-foreground">
                        {pickup.receiver.name}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        {pickup.receiver.city}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Weight className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {pickup.package.weight}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {pickup.package.type}
                    </p>
                    <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                      {pickup.package.description}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{pickup.service.type}</p>
                    <p className="text-xs text-muted-foreground">
                      {pickup.service.payment}
                    </p>
                    {pickup.service.codAmount !== "-" && (
                      <p className="text-xs text-green-600 font-medium">
                        COD: {pickup.service.codAmount}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge
                    status={pickup.status}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {pickup.timeInState}
                  </p>
                </TableCell>
                <TableCell>
                  <PriorityBadge
                    priority={pickup.priority}
                  />
                </TableCell>
                <TableCell>
                  {pickup.assignedRider ? (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {pickup.assignedRider}
                      </p>
                      <Badge variant="success" className="rounded-full text-xs">
                        Assigned
                      </Badge>
                    </div>
                  ) : (
                    <Badge variant="outline" className="rounded-full text-xs">
                      Not Assigned
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {new Date(
                        pickup.preferredPickup.split(" ")[0]
                      ).toLocaleDateString("en-IN")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {pickup.preferredPickup.split(" ")[1]}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-lg"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                          <Eye className="h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                          <UserPlus className="h-4 w-4" />
                          Assign Rider
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                          <BarChart3 className="h-4 w-4" />
                          Track Status
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                          <Edit className="h-4 w-4" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-red-600">
                          <XCircle className="h-4 w-4" />
                          Cancel Pickup
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredPickups.length === 0 && (
          <div className="p-8 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No pickups found
            </h3>
            <p className="text-muted-foreground mb-4">
              No pickups match your current filters. Try adjusting your search
              criteria.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
