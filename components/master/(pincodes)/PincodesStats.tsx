
import {
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Globe,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pincode } from "./types";

interface PincodesStatsProps {
  pincodes: Pincode[];
}

const PincodesStats = ({ pincodes }: PincodesStatsProps) => {
  const activePincodes = pincodes.filter((p) => p.isServiceable).length;
  const odaPincodes = pincodes.filter((p) => p.isODA).length;
  const zoneCovered = pincodes.filter((p) => p.zone && p.zone !== "OTHER").length;
  const total = pincodes.length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card overflow-hidden">
        <CardContent className="p-5">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Total Coverage</span>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold tracking-tight">{total}</h3>
                <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-xs">
                  Pincodes
                </Badge>
              </div>
            </div>
            <div className="p-3 bg-primary/10 rounded-2xl">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card overflow-hidden">
        <CardContent className="p-5">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Live Areas</span>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold tracking-tight text-green-600">{activePincodes}</h3>
                <Badge variant="outline" className="border-green-500/20 bg-green-500/5 text-green-600 text-xs">
                  Serviceable
                </Badge>
              </div>
            </div>
            <div className="p-3 bg-green-500/10 rounded-2xl">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card overflow-hidden">
        <CardContent className="p-5">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">ODA Areas</span>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold tracking-tight text-orange-500">{odaPincodes}</h3>
                <Badge variant="outline" className="border-orange-500/20 bg-orange-500/5 text-orange-600 text-xs">
                  Out of Area
                </Badge>
              </div>
            </div>
            <div className="p-3 bg-orange-500/10 rounded-2xl">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card overflow-hidden">
        <CardContent className="p-5">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Mapped Zones</span>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold tracking-tight text-blue-600">{zoneCovered}</h3>
                <Badge variant="outline" className="border-blue-500/20 bg-blue-500/5 text-blue-600 text-xs">
                  Zone Linked
                </Badge>
              </div>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-2xl">
              <Globe className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PincodesStats;
