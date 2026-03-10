import {
  CheckCircle,
  Sparkles,
  Truck,
  Clock,
  User,
  Users,
  Phone,
  MapPin,
  Shield,
  Weight,
  Zap,
  Wallet,
  IndianRupee,
  FileText,
  Printer,
  Download,
  Plus,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCodeDisplay } from "./QRCodeDisplay";

const serviceTypes = [
  {
    value: "same-day",
    label: "Same Day",
    rate: 120,
    icon: Zap,
    color: "text-red-600",
  },
  {
    value: "next-day",
    label: "Next Day",
    rate: 80,
    icon: Clock,
    color: "text-orange-600",
  },
  {
    value: "express",
    label: "Express",
    rate: 150,
    icon: Truck,
    color: "text-blue-600",
  },
  {
    value: "economy",
    label: "Economy",
    rate: 60,
    icon: Truck,
    color: "text-green-600",
  },
  {
    value: "standard",
    label: "Standard",
    rate: 70,
    icon: Truck,
    color: "text-purple-600",
  },
];

const paymentModes = [
  { value: "prepaid", label: "Prepaid", icon: Wallet },
  { value: "cod", label: "COD", icon: IndianRupee },
  { value: "credit", label: "Credit", icon: FileText },
  { value: "topay", label: "To Pay", icon: FileText },
];

interface ShippingLabelProps {
  bookingData: any;
  charges: any;
  awbNumber: string;
}

export const ShippingLabel = ({
  bookingData,
  charges,
  awbNumber,
}: ShippingLabelProps) => {
  const currentDate = new Date();
  const bookedDate = currentDate.toLocaleDateString("en-IN");
  const bookedTime = currentDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="space-y-7">
      {/* Success Header */}
      <Card className="rounded-3xl border-success/40 bg-gradient-to-r from-success/10 to-success/5 shadow-card">
        <CardContent className="p-8">
          <div className="flex items-center gap-6">
            <div className="rounded-2xl bg-success/20 p-4">
              <CheckCircle className="h-12 w-12 text-success" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Booking Created Successfully!
              </h2>
              <p className="text-muted-foreground mb-3">
                Your shipment has been registered and is ready for pickup
              </p>
              <div className="flex items-center gap-4">
                <Badge className="bg-success text-success-foreground rounded-full px-4 py-1.5">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AWB: <strong className="ml-1">{awbNumber}</strong>
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Booked on {bookedDate} at {bookedTime}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Shipping Label */}
        <div className="lg:col-span-2">
          <Card className="rounded-3xl border-2 border-gray-800 bg-white shadow-xl">
            <CardContent className="p-0">
              {/* Header */}
              <div className="border-b-2 border-gray-800 p-6 bg-gradient-to-r from-blue-50 to-blue-100">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-600 p-2">
                      <Truck className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        SwiftShip Express
                      </h1>
                      <p className="text-sm text-gray-600">
                        Fast & Reliable Logistics Solutions
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">
                      Contact: 1800-XXX-XXXX
                    </p>
                    <p className="text-xs text-gray-600">
                      support@swiftship.com
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="p-6">
                {/* AWB Number and QR Code Row */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold tracking-wider">
                      AWB NUMBER
                    </p>
                    <p className="text-2xl font-bold text-gray-900 font-mono bg-gray-100 px-3 py-2 rounded-lg">
                      {awbNumber}
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      <Clock className="h-3 w-3 inline mr-1" />
                      Booked: {bookedDate}, {bookedTime}
                    </p>
                  </div>
                  <QRCodeDisplay
                    data={{
                      awbNumber: awbNumber,
                      senderName: bookingData.senderName,
                      receiverName: bookingData.receiverName,
                      weight: bookingData.weight,
                      serviceType:
                        serviceTypes.find(
                          (s) => s.value === bookingData.serviceType
                        )?.label || "Standard", // Fallback value
                      paymentMode:
                        paymentModes.find(
                          (p) => p.value === bookingData.paymentMode
                        )?.label || "Prepaid", // Fallback value
                      codAmount: bookingData.codAmount || "0",
                      timestamp: `${bookedDate} ${bookedTime}`,
                    }}
                  />
                </div>

                {/* Sender and Receiver Details */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  {/* From */}
                  <div className="border-2 border-blue-200 p-4 rounded-xl bg-blue-50">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="h-4 w-4 text-blue-600" />
                      <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                        SHIP FROM
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-gray-900">
                        {bookingData.senderName}
                      </p>
                      <p className="text-sm text-gray-700 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {bookingData.senderPhone}
                      </p>
                      <p className="text-sm text-gray-700 flex items-start gap-1">
                        <MapPin className="h-3 w-3 mt-0.5" />
                        <span>
                          {bookingData.senderAddress},{" "}
                          {bookingData.senderPincode}
                        </span>
                      </p>
                      {bookingData.senderGSTIN && (
                        <p className="text-xs text-gray-600">
                          <Shield className="h-3 w-3 inline mr-1" />
                          GSTIN: {bookingData.senderGSTIN}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* To */}
                  <div className="border-2 border-green-200 p-4 rounded-xl bg-green-50">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="h-4 w-4 text-green-600" />
                      <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">
                        SHIP TO
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-gray-900">
                        {bookingData.receiverName}
                      </p>
                      <p className="text-sm text-gray-700 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {bookingData.receiverPhone}
                      </p>
                      <p className="text-sm text-gray-700 flex items-start gap-1">
                        <MapPin className="h-3 w-3 mt-0.5" />
                        <span>
                          {bookingData.receiverAddress},{" "}
                          {bookingData.receiverPincode}
                        </span>
                      </p>
                      {bookingData.receiverGSTIN && (
                        <p className="text-xs text-gray-600">
                          <Shield className="h-3 w-3 inline mr-1" />
                          GSTIN: {bookingData.receiverGSTIN}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Package & Service Details */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="text-center bg-gray-50 p-3 rounded-lg">
                    <Weight className="h-5 w-5 text-blue-600 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-gray-600 uppercase">
                      Weight
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {bookingData.weight} kg
                    </p>
                  </div>
                  <div className="text-center bg-gray-50 p-3 rounded-lg">
                    <Zap className="h-5 w-5 text-orange-600 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-gray-600 uppercase">
                      Service
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {serviceTypes.find(
                        (s) => s.value === bookingData.serviceType
                      )?.label || "Standard"}
                    </p>
                  </div>
                  <div className="text-center bg-gray-50 p-3 rounded-lg">
                    <Wallet className="h-5 w-5 text-purple-600 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-gray-600 uppercase">
                      Payment
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {paymentModes.find(
                        (p) => p.value === bookingData.paymentMode
                      )?.label || "Prepaid"}
                    </p>
                  </div>
                  {bookingData.paymentMode === "cod" && (
                    <div className="text-center bg-red-50 p-3 rounded-lg">
                      <IndianRupee className="h-5 w-5 text-red-600 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-gray-600 uppercase">
                        COD AMOUNT
                      </p>
                      <p className="text-lg font-bold text-red-600">
                        ₹{bookingData.codAmount}
                      </p>
                    </div>
                  )}
                </div>

                {/* Special Instructions */}
                {bookingData.specialInstructions && (
                  <div className="border-t-2 border-gray-300 pt-4 mb-4">
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-2 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Special Instructions
                    </p>
                    <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-lg">
                      {bookingData.specialInstructions}
                    </p>
                  </div>
                )}

                {/* Footer */}
                <div className="border-t-2 border-gray-800 pt-4">
                  <p className="text-xs text-gray-600 text-center">
                    Handle with care. This is a system generated label.
                  </p>
                  <p className="text-xs text-gray-600 text-center">
                    Terms & Conditions apply. Visit www.swiftship.com for
                    details.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
          {/* Invoice Summary */}
          <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-5 w-5 text-primary" />
                Invoice Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Base Freight:</span>
                  <span className="font-medium">
                    ₹{charges.baseFreight.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Fuel Surcharge (12%):
                  </span>
                  <span className="font-medium">
                    ₹{charges.fuelSurcharge.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GST (18%):</span>
                  <span className="font-medium">
                    ₹{charges.serviceTax.toFixed(2)}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-base">
                    <span>Total Amount:</span>
                    <span className="text-primary">
                      ₹{charges.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
                {bookingData.paymentMode === "cod" && (
                  <div className="flex justify-between text-red-600 font-semibold text-sm">
                    <span>COD Amount:</span>
                    <span>₹{bookingData.codAmount}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Zap className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full gap-2 bg-primary text-primary-foreground">
                <Printer className="h-4 w-4" />
                Print Shipping Label
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <Truck className="h-4 w-4" />
                Track Shipment
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Create Similar Booking
              </Button>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="rounded-3xl border-primary/20 bg-primary/5 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-primary">
                <Clock className="h-5 w-5" />
                Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="rounded-full bg-primary/20 p-1">
                  <CheckCircle className="h-3 w-3 text-primary" />
                </div>
                <span className="text-foreground">Booking created</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="rounded-full bg-primary/20 p-1">
                  <div className="h-3 w-3 bg-primary rounded-full"></div>
                </div>
                <span className="text-muted-foreground">Awaiting pickup</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="rounded-full bg-primary/20 p-1">
                  <div className="h-3 w-3 bg-primary/30 rounded-full"></div>
                </div>
                <span className="text-muted-foreground">In transit</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="rounded-full bg-primary/20 p-1">
                  <div className="h-3 w-3 bg-primary/30 rounded-full"></div>
                </div>
                <span className="text-muted-foreground">Out for delivery</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
