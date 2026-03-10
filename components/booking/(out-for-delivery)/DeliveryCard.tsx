import {
  Package,
  Calendar,
  QrCode,
  Timer,
  MapPin,
  Phone,
  User,
  IndianRupee,
  BarChart3,
  AlertCircle,
  Eye,
  PhoneCall,
  MessageCircle,
  MoreHorizontal,
  UserCheck,
  Shield,
  Map,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import StatusBadge from "@/components/ui/StatusBadge";
import PriorityBadge from "@/components/ui/PriorityBadge";
import RiderStatusBadge from "@/components/ui/RiderStatusBadge";
import DeliveryProgress from "@/components/ui/DeliveryProgress";
import { Delivery } from "./types/index";

interface DeliveryCardProps {
  delivery: Delivery;
}

const DeliveryCard = ({ delivery }: DeliveryCardProps) => {
  return (
    <Card
      key={delivery.id}
      className="rounded-2xl border-border/70 bg-card/95 shadow-card hover:shadow-lg transition-all duration-300"
    >
      <CardContent className="p-0">
        {/* Header Section */}
        <div className="p-6 border-b border-border/70">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-green-100 p-2">
                  <Package className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-mono font-bold text-lg text-foreground">
                      {delivery.awbNumber}
                    </p>
                    <QrCode className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ID: {delivery.id}
                  </p>
                </div>
              </div>
              <StatusBadge status={delivery.currentStatus} />
              <PriorityBadge priority={delivery.priority} />
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  ETA:{" "}
                  {new Date(
                    delivery.deliveryInfo.estimatedDelivery
                  ).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="w-px h-4 bg-border/70"></div>
              <span>Updated: {delivery.deliveryInfo.lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Delivery Progress */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Timer className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-foreground">
                    Delivery Progress
                  </span>
                </div>
                <div className="space-y-3">
                  <DeliveryProgress delivery={delivery} />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Attempt:</span>
                      <span className="font-medium">
                        {delivery.deliveryInfo.deliveryAttempt}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Assigned:</span>
                      <span className="font-medium">
                        {new Date(
                          delivery.deliveryInfo.assignedTime
                        ).toLocaleTimeString("en-IN")}
                      </span>
                    </div>
                    {delivery.deliveryInfo.deliveredAt && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Delivered:
                        </span>
                        <span className="font-medium text-green-600">
                          {new Date(
                            delivery.deliveryInfo.deliveredAt
                          ).toLocaleTimeString("en-IN")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Receiver & Location */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-foreground">
                    Delivery Location
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {delivery.receiver.name}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      <span>{delivery.receiver.phone}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-foreground">
                      {delivery.receiver.address}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {delivery.receiver.landmark} • {delivery.receiver.city} -{" "}
                      {delivery.receiver.pincode}
                    </p>
                  </div>

                  {delivery.currentStatus === "out_for_delivery" && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-green-700">
                        <Timer className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Current Location
                        </span>
                      </div>
                      <p className="text-xs text-green-600 mt-1">
                        {delivery.deliveryInfo.currentLocation}
                      </p>
                      <div className="flex items-center justify-between text-xs text-green-700 mt-2">
                        <span>
                          {delivery.deliveryInfo.distanceToDestination} away
                        </span>
                        <span>
                          {delivery.deliveryInfo.timeToDestination} ETA
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Rider & Package Info */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-semibold text-foreground">
                    Rider & Package
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {delivery.rider.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <RiderStatusBadge status={delivery.rider.status} />
                      <span className="text-xs text-muted-foreground">
                        Rating: {delivery.rider.rating}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Vehicle:</span>
                      <span className="font-medium">
                        {delivery.rider.vehicle}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Package:</span>
                      <span className="font-medium">
                        {delivery.package.type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Weight:</span>
                      <span className="font-medium">
                        {delivery.package.weight}
                      </span>
                    </div>
                  </div>

                  {delivery.package.codAmount !== "-" && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                      <div className="flex items-center gap-2 text-yellow-700">
                        <IndianRupee className="h-3 w-3" />
                        <span className="text-sm font-medium">
                          COD: {delivery.package.codAmount}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions & Monitoring */}
            <div className="space-y-4">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    Delivery Actions
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Proof Required:
                      </span>
                      <div className="flex gap-1">
                        {delivery.proofRequired.map((proof, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="rounded-full text-xs"
                          >
                            {proof}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Temperature:
                      </span>
                      <Badge
                        variant={
                          delivery.temperature === "Normal"
                            ? "success"
                            : "warning"
                        }
                        className="rounded-full"
                      >
                        {delivery.temperature}
                      </Badge>
                    </div>
                  </div>

                  {delivery.deliveryInfo.attemptNotes && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-orange-700">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Attempt Notes
                        </span>
                      </div>
                      <p className="text-xs text-orange-600 mt-1">
                        {delivery.deliveryInfo.attemptNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  className="gap-2 rounded-lg bg-primary text-primary-foreground"
                >
                  <Eye className="h-3 w-3" />
                  Live Track
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 rounded-lg border-border/70"
                >
                  <PhoneCall className="h-3 w-3" />
                  Call Rider
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 rounded-lg border-border/70"
                >
                  <MessageCircle className="h-3 w-3" />
                  Message Customer
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
                      <UserCheck className="h-4 w-4" />
                      Update Status
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                      <Shield className="h-4 w-4" />
                      View POD
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                      <Map className="h-4 w-4" />
                      View Route
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                      <RefreshCw className="h-4 w-4" />
                      Reschedule
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

export default DeliveryCard;
