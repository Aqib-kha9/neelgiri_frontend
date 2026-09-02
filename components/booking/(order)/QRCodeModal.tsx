import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import QRCode from "react-qr-code";
import { Order } from "./types";

interface QRCodeModalProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QRCodeModal({ order, open, onOpenChange }: QRCodeModalProps) {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-center">Scan AWB</DialogTitle>
          <DialogDescription className="text-center">
            Show this QR code to the pickup executive.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center p-6 space-y-4">
          <div className="p-4 bg-white rounded-xl shadow-sm border border-border/50">
            <QRCode 
              value={order.awbNumber}
              size={200}
              level="H" // High error correction
              className="mx-auto"
            />
          </div>
          <div className="text-center space-y-1">
            <p className="font-mono text-2xl font-bold tracking-tight text-foreground">{order.awbNumber}</p>
            <p className="text-sm text-muted-foreground">Order: {order.id}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
