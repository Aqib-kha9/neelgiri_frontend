import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "./StatusBadge";
import { Order } from "./types";
import {
  Calendar,
  User,
  Phone,
  MapPin,
  Package,
  Truck,
  IndianRupee,
  Eye,
  BarChart3,
  ScanLine,
  MoreHorizontal,
  FileText,
  Edit,
  Download,
  QrCode,
} from "lucide-react";

interface OrderCardProps {
  order: Order;
}

export const OrderCard = ({ order }: OrderCardProps) => {
  return (
    <Card
      key={order.id}
      className="rounded-2xl border-border/70 bg-card/95 shadow-card hover:shadow-lg transition-all duration-300 group"
    >
      <CardContent className="p-0">
        {/* Header Section */}
        <div className="p-6 border-b border-border/70">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-2">
                  <QrCode className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-mono font-bold text-lg text-foreground">
                    {order.awbNumber}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Order ID: {order.id}
                  </p>
                </div>
              </div>
              <StatusBadge status={order.status} />
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{order.bookedDate}</span>
              </div>
              <div className="w-px h-4 bg-border/70"></div>
              <span>Updated: {order.lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Sender & Receiver */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-foreground">
                    Sender Details
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="font-medium text-foreground">
                    {order.sender.name}
                  </p>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span>{order.sender.phone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-3 w-3 mt-0.5" />
                    <span className="flex-1">
                      {order.sender.address}, {order.sender.pincode}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    GSTIN: {order.sender.gstin}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-foreground">
                    Receiver Details
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="font-medium text-foreground">
                    {order.receiver.name}
                  </p>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span>{order.receiver.phone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-3 w-3 mt-0.5" />
                    <span className="flex-1">
                      {order.receiver.address}, {order.receiver.pincode}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    GSTIN: {order.receiver.gstin}
                  </div>
                </div>
              </div>
            </div>

            {/* Package & Weight Details */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-semibold text-foreground">
                    Package Details
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Weight</p>
                      <p className="font-medium">{order.package.weight}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Volumetric
                      </p>
                      <p className="font-medium">
                        {order.package.volumetricWeight}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Actual Weight
                    </p>
                    <p className="font-medium">{order.package.actualWeight}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="font-medium">{order.package.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Description</p>
                    <p className="font-medium text-sm">
                      {order.package.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Service & Commercials */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Truck className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-semibold text-foreground">
                    Service Details
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Service</p>
                      <p className="font-medium">{order.service.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Mode</p>
                      <p className="font-medium">{order.service.mode}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Payment</p>
                    <p className="font-medium">{order.service.payment}</p>
                  </div>
                  {order.service.codAmount !== "-" && (
                    <div>
                      <p className="text-xs text-muted-foreground">
                        COD Amount
                      </p>
                      <p className="font-medium text-green-600">
                        {order.service.codAmount}
                      </p>
                    </div>
                  )}
                  <div className="pt-2 border-t border-border/60">
                    <p className="text-xs text-muted-foreground">Partner</p>
                    <p className="font-medium">{order.partner}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Financials & Actions */}
            <div className="space-y-4">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <IndianRupee className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    Financials
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Shipping Charges
                    </p>
                    <p className="text-lg font-bold text-foreground">
                      {order.service.charges}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Invoice Value
                    </p>
                    <p className="font-medium text-foreground">
                      {order.package.invoiceValue}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    E-Way Bill: {order.eWayBill}
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
                  <BarChart3 className="h-3 w-3" />
                  Track Shipment
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 rounded-lg border-border/70"
                >
                  <ScanLine className="h-3 w-3" />
                  Scan QR
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
                      Generate Invoice
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                      <Edit className="h-4 w-4" />
                      Edit Order
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                      <Download className="h-4 w-4" />
                      Download Label
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
