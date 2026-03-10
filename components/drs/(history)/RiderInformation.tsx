import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Copy, Star } from "lucide-react";

interface DRSData {
  rider: {
    id: string;
    name: string;
    phone: string;
    vehicle: string;
    rating: number;
  };
}

interface RiderInformationProps {
  selectedDRS: DRSData;
}

const RiderInformation = ({ selectedDRS }: RiderInformationProps) => {
  const handleRecreateDRS = (drs: any) => {
    console.log("Recreating DRS:", drs.id);
  };

  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <User className="h-5 w-5 text-primary" />
          Rider Information
        </CardTitle>
        <CardDescription>Rider details and performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {selectedDRS.rider.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedDRS.rider.id}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Phone</p>
              <p className="font-medium">{selectedDRS.rider.phone}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Vehicle</p>
              <p className="font-medium">{selectedDRS.rider.vehicle}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Rider Rating</span>
            <div className="flex items-center gap-1">
              <span className="font-medium">{selectedDRS.rider.rating}</span>
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full gap-2 rounded-lg border-border/70"
            onClick={() => handleRecreateDRS(selectedDRS)}
          >
            <Copy className="h-4 w-4" />
            Assign Similar DRS
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiderInformation;
