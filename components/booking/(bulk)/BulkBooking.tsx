// @/components/booking/bulk/BulkBooking.tsx
"use client";

import { useState } from "react";
import { Upload, Download, Printer, Plus, Eye, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FileUpload from "./FileUpload";
import PreviewTable from "./PreviewTable";
import BulkPrintView from "./BulkPrintView";
import { BulkBookingData, BulkBookingResult } from "./types";

const BulkBooking = () => {
  const [uploadedData, setUploadedData] = useState<BulkBookingData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdBookings, setCreatedBookings] =
    useState<BulkBookingResult | null>(null);
  const [showPrintView, setShowPrintView] = useState(false);

  const handleFileProcessed = (data: BulkBookingData[]) => {
    setUploadedData(data);
    setCreatedBookings(null);
  };

  const generateBookingNumber = () => {
    return `BK${Date.now().toString().slice(-6)}`;
  };

  const handleCreateBookings = async () => {
    if (uploadedData.length === 0) return;

    setIsProcessing(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create booking numbers and print views for each
      const bookingResults = uploadedData.map((bookingData) => {
        const bookingNumber = generateBookingNumber();
        return {
          data: bookingData,
          bookingNumber,
          printView: (
            <BulkPrintView data={bookingData} bookingNumber={bookingNumber} />
          ),
        };
      });

      const result: BulkBookingResult = {
        success: true,
        bookings: bookingResults,
        failed: 0,
      };

      setCreatedBookings(result);
      alert(`Successfully created ${uploadedData.length} bookings!`);
    } catch (error) {
      alert("Error creating bookings. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrintAll = () => {
    setShowPrintView(true);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleClosePrint = () => {
    setShowPrintView(false);
  };

  const downloadTemplate = () => {
    const headers = [
      "documentNo",
      "senderName",
      "senderContact",
      "senderAddress",
      "senderCity",
      "receiverName",
      "receiverContact",
      "receiverAddress",
      "receiverCity",
      "contents",
      "weight",
      "chargeWeight",
      "rate",
      "charges",
      "netAmount",
      "payMode",
      "forwardTo",
      "thru",
      "fovAmt",
      "otherAddLess",
      "netCharges",
      "disc",
      "fuelPercent",
      "tax",
      "remark",
    ];

    const sampleData = [
      "DOC001",
      "ABC Company",
      "9876543210",
      "123 Main St",
      "Mumbai",
      "XYZ Corp",
      "9876543211",
      "456 Park Ave",
      "Delhi",
      "ELECTRONICS",
      "2.5",
      "3.0",
      "150.00",
      "450.00",
      "450.00",
      "Cash",
      "R-BillToSender",
      "YELLOWHYDERA",
      "0.00",
      "0.00",
      "450.00",
      "0.00",
      "0.00",
      "0.00",
      "Sample remark",
    ];

    const csvContent = [headers, sampleData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bulk-booking-template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (showPrintView && createdBookings) {
    return (
      <div className="p-6 space-y-6 print:p-0 print:space-y-0">
        <div className="flex justify-between items-center print:hidden">
          <h1 className="text-2xl font-bold">Bulk Booking Print Preview</h1>
          <div className="flex gap-3">
            <Button
              onClick={handlePrintAll}
              className="gap-2 rounded-xl bg-primary text-primary-foreground"
            >
              <Printer className="h-4 w-4" />
              Print All
            </Button>
            <Button
              onClick={handleClosePrint}
              className="gap-2 rounded-xl bg-green-600 hover:bg-green-700"
            >
              <FileText className="h-4 w-4" />
              Back to Bookings
            </Button>
          </div>
        </div>
        {createdBookings.bookings.map((booking, index) => (
          <div key={index}>{booking.printView}</div>
        ))}
      </div>
    );
  }

  if (createdBookings) {
    return (
      <div className="space-y-6 p-6">
        {/* Success Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-green-100 p-2">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Bookings Created Successfully!
                </h1>
                <p className="text-muted-foreground">
                  {createdBookings.bookings.length} bookings created •{" "}
                  {createdBookings.failed} failed
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setCreatedBookings(null)}
              variant="outline"
              className="gap-2 rounded-xl"
            >
              <Plus className="h-4 w-4" />
              New Upload
            </Button>
            <Button
              onClick={() => setShowPrintView(true)}
              className="gap-2 rounded-xl bg-primary text-primary-foreground"
            >
              <Eye className="h-4 w-4" />
              View All Bills
            </Button>
            <Button
              onClick={handlePrintAll}
              className="gap-2 rounded-xl bg-green-600 hover:bg-green-700"
            >
              <Printer className="h-4 w-4" />
              Print All
            </Button>
          </div>
        </div>

        {/* Created Bookings List */}
        <Card className="rounded-2xl border-border/70">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Created Bookings</h3>
            <div className="space-y-4">
              {createdBookings.bookings.map((booking, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {booking.data.senderName} → {booking.data.receiverName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.bookingNumber} • {booking.data.documentNo} • ₹
                        {booking.data.netAmount}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      setShowPrintView(true);
                      // You can implement individual print view here
                    }}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View Bill
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-2">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Bulk Booking
              </h1>
              <p className="text-muted-foreground">
                Create multiple bookings quickly using CSV upload
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={downloadTemplate}
            variant="outline"
            className="gap-2 rounded-xl"
          >
            <Download className="h-4 w-4" />
            Download Template
          </Button>
          <Button
            onClick={handleCreateBookings}
            disabled={uploadedData.length === 0 || isProcessing}
            className="gap-2 rounded-xl bg-green-600 hover:bg-green-700"
          >
            {isProcessing ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processing...
              </>
            ) : (
              <>
                <Printer className="h-4 w-4" />
                Create{" "}
                {uploadedData.length > 0 ? `${uploadedData.length} ` : ""}
                Bookings
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Side - File Upload */}
        <div className="space-y-6">
          <FileUpload onFileProcessed={handleFileProcessed} />

          {/* Quick Stats */}
          {uploadedData.length > 0 && (
            <Card className="rounded-2xl border-border/70">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Upload Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {uploadedData.length}
                    </div>
                    <div className="text-sm text-blue-600">Total Bookings</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      ₹
                      {uploadedData
                        .reduce(
                          (sum, item) =>
                            sum + parseFloat(item.netAmount || "0"),
                          0
                        )
                        .toFixed(2)}
                    </div>
                    <div className="text-sm text-green-600">Total Amount</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Side - Preview */}
        <div className="space-y-6">
          {uploadedData.length > 0 ? (
            <PreviewTable data={uploadedData} />
          ) : (
            <Card className="rounded-2xl border-border/70">
              <CardContent className="p-6 text-center">
                <div className="mx-auto w-12 h-12 bg-muted rounded-2xl flex items-center justify-center mb-4">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">No Data Uploaded</h3>
                <p className="text-muted-foreground text-sm">
                  Upload a CSV file to see preview of your bulk bookings
                </p>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card className="rounded-2xl border-border/70">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">How to Use</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs font-bold mt-0.5">
                    1
                  </div>
                  <div>
                    <strong>Download Template</strong>
                    <p className="text-muted-foreground">
                      Use our CSV template with required columns
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs font-bold mt-0.5">
                    2
                  </div>
                  <div>
                    <strong>Fill Your Data</strong>
                    <p className="text-muted-foreground">
                      Add your booking details in the CSV file
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs font-bold mt-0.5">
                    3
                  </div>
                  <div>
                    <strong>Upload & Create</strong>
                    <p className="text-muted-foreground">
                      Upload the file and create all bookings at once
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BulkBooking;
