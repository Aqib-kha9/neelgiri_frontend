// @/components/booking/bulk/FileUpload.tsx
import { useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BulkBookingData, UploadResponse } from "./types";

interface FileUploadProps {
  onFileProcessed: (data: BulkBookingData[]) => void;
}

const FileUpload = ({ onFileProcessed }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processCSV = (text: string): BulkBookingData[] => {
    const lines = text.split("\n").filter((line) => line.trim());
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

    return lines.slice(1).map((line, index) => {
      const values = line.split(",").map((v) => v.trim());
      const row: any = {};

      headers.forEach((header, i) => {
        row[header] = values[i] || "";
      });

      return {
        documentNo: row.documentno || `BULK-${index + 1}`,
        senderName: row.sendername || "",
        senderContact: row.sendercontact || "",
        senderAddress: row.senderaddress || "",
        senderCity: row.sendercity || "",
        receiverName: row.receivername || "",
        receiverContact: row.receivercontact || "",
        receiverAddress: row.receiveraddress || "",
        receiverCity: row.receivercity || "",
        contents: row.contents || "GENERAL",
        weight: row.weight || "0.00",
        chargeWeight: row.chargeweight || "0.00",
        rate: row.rate || "0.00",
        charges: row.charges || "0.00",
        netAmount: row.netamount || "0.00",
      };
    });
  };

  const handleFile = (file: File) => {
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      alert("Please upload a CSV file");
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const processedData = processCSV(text);
      onFileProcessed(processedData);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const clearFile = () => {
    setFileName("");
    onFileProcessed([]);
  };

  return (
    <Card className="rounded-2xl border-border/70">
      <CardContent className="p-6">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Upload CSV File</h3>
          <p className="text-muted-foreground text-sm mb-6">
            Upload a CSV file with booking details to create multiple bookings
            at once
          </p>

          {!fileName ? (
            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium mb-1">
                Drop your CSV file here or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports .csv files with booking information
              </p>
              <input
                id="file-input"
                type="file"
                accept=".csv"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          ) : (
            <div className="border-2 border-success/20 bg-success/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-success" />
                  <div>
                    <p className="font-medium text-sm">{fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      Ready for processing
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFile}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Button
                className="w-full gap-2 rounded-lg bg-green-600 hover:bg-green-700"
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <Upload className="h-4 w-4" />
                Upload Different File
              </Button>
            </div>
          )}

          {/* CSV Template Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium text-blue-800 mb-2">
              CSV Format Required:
            </h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p>
                <strong>Headers:</strong> documentNo, senderName, senderContact,
                senderAddress, senderCity, receiverName, receiverContact,
                receiverAddress, receiverCity, contents, weight, chargeWeight,
                rate, charges, netAmount
              </p>
              <p>
                <strong>Download:</strong>{" "}
                <a href="#" className="underline">
                  Sample CSV Template
                </a>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
