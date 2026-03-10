import {
  Package,
  Calendar,
  QrCode,
  CheckCircle2,
  MapPin,
  IndianRupee,
  Shield,
  Star,
  Eye,
  Download,
  FileText,
  MoreHorizontal,
  Printer,
  MessageCircle,
  BarChart3,
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
import VerificationBadge from "@/components/ui/VerificationBadge";
import PaymentBadge from "@/components/ui/PaymentBadge";
import RatingStars from "@/components/ui/RatingStars";
import ProofIcons from "@/components/ui/ProofIcons";
import { Delivery } from "./types";

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
              <VerificationBadge status={delivery.podVerification.status} />
              <PaymentBadge status={delivery.financials.paymentStatus} />
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  Delivered:{" "}
                  {new Date(delivery.deliveryInfo.deliveredAt).toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>
              <div className="w-px h-4 bg-border/70"></div>
              <RatingStars rating={delivery.deliveryInfo.customerRating} />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Delivery Details */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-foreground">
                    Delivery Details
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Received by: {delivery.deliveryInfo.receivedBy}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Relation: {delivery.deliveryInfo.relation}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Rider:</span>
                      <span className="font-medium">
                        {delivery.deliveryInfo.deliveredBy.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Vehicle:</span>
                      <span className="font-medium">
                        {delivery.deliveryInfo.deliveredBy.vehicle}
                      </span>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-green-700">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Delivery Location
                      </span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                      {delivery.deliveryInfo.location.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* POD Verification */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-foreground">
                    POD Verification
                  </span>
                </div>
                <div className="space-y-3">
                  <ProofIcons proof={delivery.deliveryInfo.proof} />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Verified by:
                      </span>
                      <span className="font-medium">
                        {delivery.podVerification.verifiedBy}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Verified at:
                      </span>
                      <span className="font-medium">
                        {new Date(
                          delivery.podVerification.verifiedAt
                        ).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-700">
                      {delivery.podVerification.notes}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <IndianRupee className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-foreground">
                    Financial Information
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Delivery Charges:
                      </span>
                      <span className="font-medium">
                        {delivery.financials.deliveryCharges}
                      </span>
                    </div>
                    {delivery.financials.codCollected !== "-" && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          COD Collected:
                        </span>
                        <span className="font-medium text-green-600">
                          {delivery.financials.codCollected}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm font-semibold border-t pt-2">
                      <span className="text-foreground">Total Amount:</span>
                      <span className="text-green-600">
                        {delivery.financials.totalAmount}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Invoice:</span>
                    <Badge variant="outline" className="rounded-full">
                      {delivery.financials.invoiceNumber}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Feedback & Actions */}
            <div className="space-y-4">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    Customer Feedback
                  </span>
                </div>
                <div className="space-y-3">
                  <RatingStars rating={delivery.deliveryInfo.customerRating} />

                  {delivery.deliveryInfo.feedback && (
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <p className="text-sm text-foreground">
                        {delivery.deliveryInfo.feedback}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Service:</span>
                    <span className="font-medium">{delivery.service.type}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  className="gap-2 rounded-lg bg-primary text-primary-foreground"
                >
                  <Eye className="h-3 w-3" />
                  View POD
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 rounded-lg border-border/70"
                >
                  <Download className="h-3 w-3" />
                  Download Documents
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 rounded-lg border-border/70"
                >
                  <FileText className="h-3 w-3" />
                  Generate Invoice
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
                      <Printer className="h-4 w-4" />
                      Print POD
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                      <MessageCircle className="h-4 w-4" />
                      Contact Customer
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                      <BarChart3 className="h-4 w-4" />
                      View Timeline
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                      <RefreshCw className="h-4 w-4" />
                      Re-verify POD
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
