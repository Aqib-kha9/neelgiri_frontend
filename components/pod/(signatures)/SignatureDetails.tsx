import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User,
  MapPin,
  Phone,
  Package,
  Signature,
  FileText,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SignatureDetailsProps {
  signature: any;
}

const SignatureDetails = ({ signature }: SignatureDetailsProps) => {
  const StatusBadge = ({ status }: { status: string }) => {
    const config = {
      verified: {
        label: "Verified",
        color: "bg-green-100 text-green-800 border-green-200",
      },
      pending: {
        label: "Pending",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
      review_required: {
        label: "Review Required",
        color: "bg-orange-100 text-orange-800 border-orange-200",
      },
    }[status];

     if (!config) {
       return (
         <Badge className="rounded-full border bg-gray-100 text-gray-800 border-gray-200 px-2 py-1 text-xs">
           Unknown
         </Badge>
       );
     }

    return (
      <Badge className={`rounded-full border ${config.color} px-3 py-1.5`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-0">
        <div className="p-6 border-b border-border/70">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-100 p-2">
                  <Signature className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-mono font-bold text-lg text-foreground">
                      {signature.awbNumber}
                    </p>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Digital Signature • {signature.receiver.name}
                  </p>
                </div>
              </div>
              <StatusBadge status={signature.status} />
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-lg border-border/70"
              >
                <Signature className="h-3 w-3" />
                View Signature
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg border-border/70"
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                    <FileText className="h-4 w-4" />
                    Download POD
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                    <User className="h-4 w-4" />
                    Contact Receiver
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Receiver Information */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-foreground">
                    Receiver Information
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {signature.receiver.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {signature.receiver.relation}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span>{signature.receiver.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span>{signature.delivery.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Package Information */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-foreground">
                    Package Information
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Type</p>
                      <p className="font-medium">{signature.package.type}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Weight</p>
                      <p className="font-medium">{signature.package.weight}</p>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p className="text-muted-foreground">Description</p>
                    <p className="font-medium">
                      {signature.package.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignatureDetails;
