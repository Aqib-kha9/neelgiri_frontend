import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Users,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  User,
  Phone,
  Truck,
} from "lucide-react";
import { availableRiders } from "./data/mockData";

interface DRSConfigurationProps {
  drsNumber: string;
  onDrsNumberChange: (value: string) => void;
  drsDate: string;
  onDrsDateChange: (value: string) => void;
  notes: string;
  onNotesChange: (value: string) => void;
  useOptimizedRoute: boolean;
  onUseOptimizedRouteChange: (value: boolean) => void;
  selectedRider: any;
  onRiderChange: (rider: any) => void;
  selectedShipments: any[];
  stats: {
    totalShipments: number;
    totalCOD: number;
    totalWeight: number;
    priorityShipments: number;
  };
  onCreateDRS: () => void;
}

const DRSConfiguration = ({
  drsNumber,
  onDrsNumberChange,
  drsDate,
  onDrsDateChange,
  notes,
  onNotesChange,
  useOptimizedRoute,
  onUseOptimizedRouteChange,
  selectedRider,
  onRiderChange,
  selectedShipments,
  stats,
  onCreateDRS,
}: DRSConfigurationProps) => {
  return (
    <>
      {/* DRS Basic Information */}
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-5 w-5 text-primary" />
            DRS Information
          </CardTitle>
          <CardDescription>
            Basic details for the Delivery Run Sheet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              DRS Number
            </label>
            <Input
              value={drsNumber}
              onChange={(e) => onDrsNumberChange(e.target.value)}
              className="rounded-lg font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              DRS Date
            </label>
            <Input
              type="date"
              value={drsDate}
              onChange={(e) => onDrsDateChange(e.target.value)}
              className="rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Notes</label>
            <Textarea
              placeholder="Add notes for the rider..."
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              className="rounded-lg min-h-[80px]"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div>
              <p className="text-sm font-medium text-foreground">
                Optimized Route
              </p>
              <p className="text-xs text-muted-foreground">
                Auto-optimize delivery sequence
              </p>
            </div>
            <Switch
              checked={useOptimizedRoute}
              onCheckedChange={onUseOptimizedRouteChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Rider Selection */}
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-5 w-5 text-primary" />
            Assign Rider
          </CardTitle>
          <CardDescription>
            Select a rider for this delivery run
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {availableRiders.map((rider) => (
              <Card
                key={rider.id}
                className={`cursor-pointer transition-all border-2 ${
                  selectedRider.id === rider.id
                    ? "border-primary shadow-lg"
                    : "border-border/70 hover:border-primary/50"
                } rounded-xl`}
                onClick={() => onRiderChange(rider)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {rider.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {rider.id}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          rider.currentLoad < rider.capacity
                            ? "success"
                            : "error"
                        }
                        className="rounded-full text-xs"
                      >
                        {rider.currentLoad}/{rider.capacity}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span>{rider.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Truck className="h-3 w-3 text-muted-foreground" />
                        <span>{rider.vehicle}</span>
                      </div>
                    </div>

                    <Progress
                      value={(rider.currentLoad / rider.capacity) * 100}
                      className={`h-2 ${
                        rider.currentLoad < rider.capacity - 5
                          ? "bg-green-100"
                          : rider.currentLoad < rider.capacity
                          ? "bg-yellow-100"
                          : "bg-red-100"
                      }`}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* DRS Summary */}
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-5 w-5 text-primary" />
            Run Summary
          </CardTitle>
          <CardDescription>Overview of the delivery run</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Total Stops:</span>
              <span className="font-medium">{selectedShipments.length}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Estimated Distance:</span>
              <span className="font-medium">
                ~{(selectedShipments.length * 2.5).toFixed(1)} km
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Estimated Time:</span>
              <span className="font-medium">
                ~{(selectedShipments.length * 0.5).toFixed(1)} hours
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">COD Collection:</span>
              <span className="font-medium text-green-600">
                ₹{stats.totalCOD}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Rider Capacity:</span>
              <span className="font-medium">
                {selectedShipments.length}/
                {selectedRider.capacity - selectedRider.currentLoad} available
              </span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Route Optimization
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {useOptimizedRoute
                ? "Delivery sequence will be optimized for fastest route"
                : "Deliveries will follow the order they were added"}
            </p>
          </div>

          <Button
            className="w-full mt-4 gap-2 rounded-lg bg-green-600 hover:bg-green-700"
            onClick={onCreateDRS}
            disabled={selectedShipments.length === 0}
          >
            <CheckCircle2 className="h-4 w-4" />
            Create DRS
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

export default DRSConfiguration;
