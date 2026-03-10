// components/master/products/BulkUploadModal.tsx
import { useState } from "react";
import { X, Upload, Download, FileText, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface BulkUploadModalProps {
  onUpload: (data: any[]) => void;
  onCancel: () => void;
}

const BulkUploadModal = ({ onUpload, onCancel }: BulkUploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (selectedFile: File) => {
    if (
      selectedFile.type === "text/csv" ||
      selectedFile.name.endsWith(".csv")
    ) {
      setFile(selectedFile);
    } else {
      alert("Please select a CSV file");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleUpload = () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const lines = csvText.split("\n");
        const headers = lines[0].split(",").map((h) => h.trim());

        const data = lines
          .slice(1)
          .map((line) => {
            const values = line.split(",").map((v) => v.trim());
            const row: any = {};
            headers.forEach((header, index) => {
              row[header] = values[index] || "";
            });
            return row;
          })
          .filter((row) => row.name); // Filter out empty rows

        onUpload(data);
      } catch (error) {
        alert("Error processing CSV file. Please check the format.");
      }
    };
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const template = `name,description,category,subCategory,hsnCode,weight,dimensions,value,fragile,hazardous,temperatureSensitive,specialHandling,storageRequirements
iPhone 15 Pro Max,Latest Apple smartphone,Electronics,Mobile Phones,85171200,0.221,16.0 x 7.8 x 0.8 cm,129999,true,false,true,Handle with care,Store in dry place
Samsung 55" 4K Smart TV,Ultra HD Smart Television,Electronics,Televisions,85287200,18.5,123.0 x 71.0 x 28.0 cm,64999,true,false,false,Keep upright,Store in original packaging
Perfume Gift Set,Luxury perfume collection,Beauty & Personal Care,Fragrances,33030010,0.45,15.0 x 10.0 x 8.0 cm,5999,true,true,true,Fragile,Store in cool place`;

    const blob = new Blob([template], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl rounded-2xl border-border/70 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/70">
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Bulk Upload Products
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="rounded-lg"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Instructions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              Upload a CSV file with product data
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <Badge variant="outline" className="rounded-full mb-2">
                  Required Fields
                </Badge>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• name</li>
                  <li>• category</li>
                  <li>• hsnCode</li>
                  <li>• weight</li>
                  <li>• value</li>
                </ul>
              </div>
              <div>
                <Badge variant="outline" className="rounded-full mb-2">
                  Optional Fields
                </Badge>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• description</li>
                  <li>• subCategory</li>
                  <li>• dimensions</li>
                  <li>• specialHandling</li>
                  <li>• storageRequirements</li>
                </ul>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              <p>
                <strong>Boolean fields:</strong> Use "true" or "false" for
                fragile, hazardous, temperatureSensitive
              </p>
              <p>
                <strong>Numeric fields:</strong> weight and value should be
                numbers only
              </p>
            </div>
          </div>

          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border bg-muted/30"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                {file ? file.name : "Drag & drop your CSV file here"}
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse files
              </p>
            </div>

            <input
              type="file"
              accept=".csv"
              onChange={(e) =>
                e.target.files?.[0] && handleFileSelect(e.target.files[0])
              }
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <Button
              variant="outline"
              className="mt-4 gap-2 rounded-lg"
              onClick={() =>
               (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()
              }
            >
              <Upload className="h-4 w-4" />
              Browse Files
            </Button>
          </div>

          {/* Template Download */}
          <div className="text-center">
            <Button
              variant="outline"
              className="gap-2 rounded-lg"
              onClick={downloadTemplate}
            >
              <Download className="h-4 w-4" />
              Download CSV Template
            </Button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border/70">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-lg"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="flex-1 gap-2 rounded-lg bg-green-600 hover:bg-green-700"
              onClick={handleUpload}
              disabled={!file}
            >
              <Upload className="h-4 w-4" />
              Upload Products
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkUploadModal;
