interface QRCodeDisplayProps {
  data: {
    awbNumber: string;
    senderName: string;
    receiverName: string;
    weight: string;
    serviceType: string;
    paymentMode: string;
    codAmount: string;
    timestamp: string;
  };
}

export const QRCodeDisplay = ({ data }: QRCodeDisplayProps) => {
  const qrData = `
SwiftShip Booking:
AWB: ${data.awbNumber}
From: ${data.senderName}
To: ${data.receiverName}
Weight: ${data.weight}kg
Service: ${data.serviceType}
Payment: ${data.paymentMode}
COD: ₹${data.codAmount}
Booked: ${data.timestamp}
  `.trim();

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    qrData
  )}`;

  return (
    <div className="flex flex-col items-center space-y-3 p-4 bg-white rounded-2xl border border-border/70">
      <div className="bg-primary/5 rounded-xl p-3">
        <img src={qrCodeUrl} alt="Booking QR Code" className="w-32 h-32" />
      </div>
      <p className="text-sm font-semibold text-foreground text-center">
        Scan to track shipment
      </p>
      <p className="text-xs text-muted-foreground text-center">
        AWB: {data.awbNumber}
      </p>
    </div>
  );
};
