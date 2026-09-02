import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Order } from "./types";
import { MapPin, Phone, User, Package, IndianRupee, Truck, FileText, Download } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

interface OrderDetailsModalProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailsModal({ order, open, onOpenChange }: OrderDetailsModalProps) {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between mt-2">
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                {order.awbNumber}
                <StatusBadge status={order.status} />
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm text-muted-foreground">
                Order ID: {order.id} • Booked: {order.bookedDate}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Parties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border bg-muted/20 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                <User className="h-4 w-4" /> Sender
              </div>
              <div className="space-y-1.5 text-sm">
                <p className="font-medium">{order.sender.name}</p>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{order.sender.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  <span>{order.sender.address}, {order.sender.pincode}</span>
                </div>
                <div className="text-xs text-muted-foreground pt-1">
                  GSTIN: <span className="font-medium text-foreground">{order.sender.gstin}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border bg-muted/20 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                <User className="h-4 w-4" /> Receiver
              </div>
              <div className="space-y-1.5 text-sm">
                <p className="font-medium">{order.receiver.name}</p>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{order.receiver.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  <span>{order.receiver.address}, {order.receiver.pincode}</span>
                </div>
                <div className="text-xs text-muted-foreground pt-1">
                  GSTIN: <span className="font-medium text-foreground">{order.receiver.gstin}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Package & Service */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-orange-100 bg-orange-50/50 dark:border-orange-900/30 dark:bg-orange-900/10 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-orange-600">
                <Package className="h-4 w-4" /> Package Info
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Charged Weight</p>
                  <p className="font-medium">{order.package.weight}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Volumetric</p>
                  <p className="font-medium">{order.package.volumetricWeight}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Type</p>
                  <p className="font-medium">{order.package.type}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Description</p>
                  <p className="font-medium truncate" title={order.package.description}>{order.package.description}</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-purple-100 bg-purple-50/50 dark:border-purple-900/30 dark:bg-purple-900/10 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-purple-600">
                <Truck className="h-4 w-4" /> Service Details
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Service</p>
                  <p className="font-medium">{order.service.type}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Payment Mode</p>
                  <p className="font-medium">{order.service.payment}</p>
                </div>
                {order.service.payment === "COD" && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">COD Amount</p>
                    <p className="font-medium text-green-600">{order.service.codAmount}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Partner</p>
                  <p className="font-medium">{order.partner}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Financials & Documents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <IndianRupee className="h-4 w-4" /> Financials
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Shipping Charges:</span>
                  <span className="font-bold text-base">{order.service.charges}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Invoice Value:</span>
                  <span className="font-medium">{order.package.invoiceValue}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">FOV Charge:</span>
                  <span className="font-medium text-primary">{order.fovCharge}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border bg-muted/20 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <FileText className="h-4 w-4 text-muted-foreground" /> Documents
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Invoice No:</span>
                  <span className="font-medium">{order.senderInvoiceNo}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">E-Way Bill:</span>
                  <span className="font-medium">{order.eWayBill}</span>
                </div>
                {order.additionalDocNos && order.additionalDocNos.length > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Additional Docs:</span>
                    <span className="font-medium truncate max-w-[120px]" title={order.additionalDocNos.join(', ')}>
                      {order.additionalDocNos.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Attachments */}
          {order.attachments && order.attachments.length > 0 && (
            <div className="p-4 rounded-xl border bg-muted/10 space-y-3">
              <div className="text-sm font-semibold text-foreground">Attachments ({order.attachments.length})</div>
              <div className="flex flex-wrap gap-3">
                {order.attachments.map((att, idx) => (
                  <a
                    key={idx}
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-background hover:bg-muted/50 transition-colors group"
                  >
                    {att.category === 'parcel' ? (
                      <Package className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                    ) : (
                      <FileText className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                    )}
                    <span className="text-xs max-w-[100px] truncate" title={att.originalname}>{att.originalname}</span>
                    <Download className="h-3 w-3 text-muted-foreground ml-1 group-hover:text-primary" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
