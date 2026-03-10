import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Truck,
  QrCode,
  FileText,
  User,
  MapPin,
  Phone,
  Mail,
  BarChart3,
  Shield,
  Edit3,
  RefreshCw,
  Copy,
  Download,
  Trash2,
  Eye,
  AlertCircle,
} from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { AllocationTypeBadge } from "./AllocationTypeBadge";
import { ServiceTypeBadge } from "./ServiceTypeBadge";
import { UsageProgress } from "./UsageProgress";
import { AWBPreview } from "./AWBPreview";

interface AllocationCardProps {
  allocation: any;
  onDelete: (id: string) => void;
  onRenew: (allocation: any) => void;
  onModify: (allocation: any) => void;
}

export const AllocationCard = ({
  allocation,
  onDelete,
  onRenew,
  onModify,
}: AllocationCardProps) => {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card hover:shadow-lg transition-all duration-300">
      <CardContent className="p-0">
        {/* Header Section */}
        <div className="p-6 border-b border-border/70">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-100 p-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-lg text-foreground">
                      {allocation.series.name}
                    </p>
                    <QrCode className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Allocated to {allocation.allocatedTo.name} •{" "}
                    {allocation.allocatedTo.code}
                  </p>
                </div>
              </div>
              <StatusBadge status={allocation.status} />
              <AllocationTypeBadge type={allocation.allocatedTo.type} />
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {allocation.usage.used}/
                  {allocation.usage.used + allocation.usage.available}
                </p>
                <p className="text-xs text-muted-foreground">Used/Available</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg border-border/70"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                    <Eye className="h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-2 rounded-lg"
                    onClick={() => onModify(allocation)}
                  >
                    <Edit3 className="h-4 w-4" />
                    Modify Allocation
                  </DropdownMenuItem>
                  {allocation.status === "expiring_soon" ||
                  allocation.status === "expired" ? (
                    <DropdownMenuItem
                      className="flex items-center gap-2 rounded-lg"
                      onClick={() => onRenew(allocation)}
                    >
                      <RefreshCw className="h-4 w-4" />
                      Renew Allocation
                    </DropdownMenuItem>
                  ) : null}
                  <DropdownMenuItem
                    className="flex items-center gap-2 rounded-lg"
                    onClick={() => onModify(allocation)}
                  >
                    <Copy className="h-4 w-4" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                    <Download className="h-4 w-4" />
                    Export Usage
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-2 rounded-lg text-red-600"
                    onClick={() => onDelete(allocation.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Allocation
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Series & Allocation Info */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-foreground">
                    Series Information
                  </span>
                </div>
                <div className="space-y-3">
                  <AWBPreview series={allocation.series} />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Range:</span>
                      <span className="font-mono font-medium">
                        {allocation.series.startRange} -{" "}
                        {allocation.series.endRange}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Total Numbers:
                      </span>
                      <span className="font-medium">
                        {(
                          allocation.series.endRange -
                          allocation.series.startRange +
                          1
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Branch/Partner Details */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-foreground">
                    {allocation.allocatedTo.type === "branch"
                      ? "Branch"
                      : "Partner"}{" "}
                    Details
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {allocation.allocatedTo.name}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {allocation.allocatedTo.type}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {allocation.allocatedTo.code}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span>
                        {allocation.allocatedTo.address.city},{" "}
                        {allocation.allocatedTo.address.state}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span>{allocation.allocatedTo.contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span>{allocation.allocatedTo.contact.email}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Daily Capacity</p>
                      <p className="font-medium">
                        {allocation.allocatedTo.capacity.daily}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Monthly Capacity</p>
                      <p className="font-medium">
                        {allocation.allocatedTo.capacity.monthly.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage & Performance */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-semibold text-foreground">
                    Usage & Performance
                  </span>
                </div>
                <div className="space-y-3">
                  <UsageProgress usage={allocation.usage} />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Daily Average:
                      </span>
                      <span className="font-medium">
                        {allocation.usage.dailyAverage}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Monthly Usage:
                      </span>
                      <span className="font-medium">
                        {allocation.usage.monthlyUsage.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Success Rate:
                      </span>
                      <span className="font-medium text-green-600">
                        {allocation.performance.successRate}%
                      </span>
                    </div>
                  </div>

                  {allocation.usage.lastUsed && (
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Last Used:</span>
                      <span>
                        {new Date(allocation.usage.lastUsed).toLocaleDateString(
                          "en-IN"
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Allocation Details & Actions */}
            <div className="space-y-4">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    Allocation Details
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Allocated:</span>
                      <span className="font-medium">
                        {new Date(
                          allocation.allocation.date
                        ).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Valid Until:
                      </span>
                      <span
                        className={`font-medium ${
                          new Date(allocation.allocation.validUntil) <
                          new Date()
                            ? "text-red-600"
                            : "text-foreground"
                        }`}
                      >
                        {new Date(
                          allocation.allocation.validUntil
                        ).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Auto Renew:</span>
                      <Switch
                        checked={allocation.allocation.autoRenew}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Rate/Shipment:
                      </span>
                      <span className="font-medium text-green-600">
                        {allocation.financial.ratePerShipment}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  className="gap-2 rounded-lg bg-primary text-primary-foreground"
                >
                  <Eye className="h-3 w-3" />
                  View Usage Report
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 rounded-lg border-border/70"
                  onClick={() => onModify(allocation)}
                >
                  <Edit3 className="h-3 w-3" />
                  Modify Allocation
                </Button>
                {(allocation.status === "expiring_soon" ||
                  allocation.status === "expired") && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 rounded-lg border-yellow-200 bg-yellow-50 text-yellow-700"
                    onClick={() => onRenew(allocation)}
                  >
                    <RefreshCw className="h-3 w-3" />
                    Renew Allocation
                  </Button>
                )}
                {allocation.usage.percentage >= 80 && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 rounded-lg border-red-200 bg-red-50 text-red-700"
                  >
                    <AlertCircle className="h-3 w-3" />
                    Low Numbers Alert
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Restrictions & Service Types */}
          <div className="mt-6 rounded-xl border border-border/60 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-foreground">
                Service Restrictions
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-foreground mb-2">
                  Service Types
                </p>
                <div className="flex flex-wrap gap-1">
                  {allocation.restrictions.serviceType.map((type: string) => (
                    <ServiceTypeBadge key={type} type={type} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-2">
                  Payment Methods
                </p>
                <div className="space-y-1">
                  {allocation.restrictions.paymentType.map((type: string) => (
                    <Badge
                      key={type}
                      variant="outline"
                      className="rounded-full text-xs"
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-2">
                  Restrictions
                </p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Weight:</span>
                    <span className="font-medium">
                      {allocation.restrictions.maxWeight}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Special Handling:
                    </span>
                    <span className="font-medium">
                      {allocation.restrictions.specialHandling ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Billing Cycle:
                    </span>
                    <span className="font-medium">
                      {allocation.financial.billingCycle}
                    </span>
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
