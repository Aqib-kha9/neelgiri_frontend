import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserPlus, XCircle } from "lucide-react";
import { Rider } from "./types";

interface RiderAssignmentModalProps {
  showRiderAssignment: boolean;
  setShowRiderAssignment: (value: boolean) => void;
  selectedRider: string;
  setSelectedRider: (value: string) => void;
  selectedPickups: string[];
  riders: Rider[];
  onBulkAssign: () => void;
}

export const RiderAssignmentModal = ({
  showRiderAssignment,
  setShowRiderAssignment,
  selectedRider,
  setSelectedRider,
  selectedPickups,
  riders,
  onBulkAssign,
}: RiderAssignmentModalProps) => {
  if (!showRiderAssignment) return null;

  return (
    <Card className="rounded-2xl border-primary/20 bg-primary/5 shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              Assign Rider to {selectedPickups.length} Pickups
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowRiderAssignment(false)}
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>

          <Select value={selectedRider} onValueChange={setSelectedRider}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Select a rider" />
            </SelectTrigger>
            <SelectContent>
              {riders
                .filter((rider) => rider.status === "available")
                .map((rider) => (
                  <SelectItem key={rider.id} value={rider.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>
                        {rider.name} ({rider.id})
                      </span>
                      <Badge variant="outline" className="text-xs">
                        Load: {rider.currentLoad}/{rider.maxLoad}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              onClick={onBulkAssign}
              disabled={!selectedRider}
              className="flex-1 gap-2 bg-primary text-primary-foreground"
            >
              <UserPlus className="h-4 w-4" />
              Assign Rider
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowRiderAssignment(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
