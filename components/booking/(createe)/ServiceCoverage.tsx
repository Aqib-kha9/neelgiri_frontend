import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ServiceCoverageProps {
  senderPincode: string;
  receiverPincode: string;
}

export const ServiceCoverage = ({
  senderPincode,
  receiverPincode,
}: ServiceCoverageProps) => {
  return (
    <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MapPin className="h-5 w-5 text-primary" />
          Service Coverage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">From Pincode:</span>
          <Badge variant="outline" className="rounded-full">
            {senderPincode || "Not set"}
          </Badge>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">To Pincode:</span>
          <Badge variant="outline" className="rounded-full">
            {receiverPincode || "Not set"}
          </Badge>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Serviceable:</span>
          <Badge className="bg-success text-success-foreground rounded-full">
            Available
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
