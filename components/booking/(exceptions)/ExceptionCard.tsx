import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertTriangle,
  QrCode,
  Calendar,
  FileText,
  Package,
  Phone,
  Wrench,
  IndianRupee,
  Eye,
  MessageCircle,
  PhoneCall,
  MoreHorizontal,
  User,
  Download,
  Ban,
  HelpCircle,
} from "lucide-react";
import { Exception } from "./types";
import {
  ExceptionTypeBadge,
  SeverityBadge,
  StatusBadge,
  PriorityBadge,
} from "./ExceptionBadges";
import { ResolutionProgress } from "./ResolutionProgress";

interface ExceptionCardProps {
  exception: Exception;
}

export const ExceptionCard = ({ exception }: ExceptionCardProps) => {
  return (
    <Card
      key={exception.id}
      className="rounded-2xl border-border/70 bg-card/95 shadow-card hover:shadow-lg transition-all duration-300"
    >
      <CardContent className="p-0">
        {/* Header Section */}
        <div className="p-6 border-b border-border/70">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-red-100 p-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-mono font-bold text-lg text-foreground">
                      {exception.awbNumber}
                    </p>
                    <QrCode className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ID: {exception.id}
                  </p>
                </div>
              </div>
              <ExceptionTypeBadge type={exception.type as any} />
              <SeverityBadge severity={exception.severity as any} />
              <StatusBadge status={exception.status as any} />
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  Created:{" "}
                  {new Date(exception.createdAt).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="w-px h-4 bg-border/70"></div>
              <span>
                Updated: {new Date(exception.updatedAt).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Exception Details */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-foreground">
                    Exception Details
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {exception.title}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {exception.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Priority:</span>
                      <PriorityBadge priority={exception.priority as any} />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Assigned To:
                      </span>
                      <span className="font-medium">
                        {exception.resolution.assignedTo}
                      </span>
                    </div>
                  </div>

                  {exception.details.notes && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-yellow-700">
                        <HelpCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Additional Notes
                        </span>
                      </div>
                      <p className="text-xs text-yellow-600 mt-1">
                        {exception.details.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Shipment Information */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-foreground">
                    Shipment Information
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {exception.shipment.receiver.name}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      <span>{exception.shipment.receiver.phone}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-foreground">
                      {exception.shipment.receiver.address}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {exception.shipment.receiver.city} -{" "}
                      {exception.shipment.receiver.pincode}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Package:</span>
                      <span className="font-medium">
                        {exception.shipment.package.type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Weight:</span>
                      <span className="font-medium">
                        {exception.shipment.package.weight}
                      </span>
                    </div>
                    {exception.shipment.package.codAmount !== "-" && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          COD Amount:
                        </span>
                        <span className="font-medium text-green-600">
                          {exception.shipment.package.codAmount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Resolution Progress */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Wrench className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-semibold text-foreground">
                    Resolution Progress
                  </span>
                </div>
                <div className="space-y-3">
                  <ResolutionProgress exception={exception} />

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">
                      Required Actions:
                    </p>
                    <div className="space-y-1">
                      {exception.resolution.actions.map(
                        (action: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${
                                index < exception.resolution.actions.length / 2
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            />
                            <span
                              className={
                                index < exception.resolution.actions.length / 2
                                  ? "text-green-700"
                                  : "text-muted-foreground"
                              }
                            >
                              {action}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Impact & Actions */}
            <div className="space-y-4">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <IndianRupee className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    Financial Impact
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Total Impact:
                      </span>
                      <span className="font-medium text-red-600">
                        {exception.financialImpact.totalImpact}
                      </span>
                    </div>
                    {exception.financialImpact.codAmount &&
                      exception.financialImpact.codAmount !== "-" && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            COD Amount:
                          </span>
                          <span className="font-medium">
                            {exception.financialImpact.codAmount}
                          </span>
                        </div>
                      )}
                    {exception.financialImpact.additionalCharges && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Additional Charges:
                        </span>
                        <span className="font-medium">
                          {exception.financialImpact.additionalCharges}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  className="gap-2 rounded-lg bg-primary text-primary-foreground"
                >
                  <Eye className="h-3 w-3" />
                  View Details
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 rounded-lg border-border/70"
                >
                  <MessageCircle className="h-3 w-3" />
                  Contact Customer
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 rounded-lg border-border/70"
                >
                  <PhoneCall className="h-3 w-3" />
                  Call Assigned Team
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-lg border-border/70"
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl">
                    <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                      <FileText className="h-4 w-4" />
                      Update Status
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                      <User className="h-4 w-4" />
                      Reassign
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                      <Download className="h-4 w-4" />
                      Download Documents
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-red-600">
                      <Ban className="h-4 w-4" />
                      Close Exception
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
