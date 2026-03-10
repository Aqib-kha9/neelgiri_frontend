import { useState } from "react";
import { X, Upload, Download, FileText, AlertCircle, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BulkUploadModalProps {
  onUploadSuccess: () => void;
  onCancel: () => void;
}

const BulkUploadModal = ({ onUploadSuccess, onCancel }: BulkUploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [defaultBranch, setDefaultBranch] = useState("");
  const [defaultCategory, setDefaultCategory] = useState("SELF");

  const handleFileSelect = (selectedFile: File) => {
    if (
      selectedFile.type === "text/csv" ||
      selectedFile.name.endsWith(".csv")
    ) {
      setFile(selectedFile);
    } else {
      toast.error("Please select a CSV file");
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

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);

    try {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const csvText = e.target?.result as string;
          const lines = csvText
            .split("\n")
            .filter((line) => line.trim() !== "");

          if (lines.length === 0) {
            toast.error("CSV file is empty");
            setIsUploading(false);
            return;
          }

          const headers = lines[0]
            .split(",")
            .map((h) => h.trim().toLowerCase());

          const data = lines
            .slice(1)
            .map((line) => {
              const values = line.split(",").map((v) => v.trim());
              const row: any = {};

              headers.forEach((header, i) => {
                if (values[i]) {
                  switch (header) {
                    case "pincode":
                    case "pin code":
                      row.pincode = values[i];
                      break;
                    case "city":
                      row.city = values[i];
                      break;
                    case "office name":
                    case "officename":
                      row.officeName = values[i];
                      break;
                    case "state":
                      row.state = values[i];
                      break;
                    case "district":
                      row.district = values[i];
                      break;
                    case "zone":
                      row.zone = values[i];
                      break;
                  }
                }
              });

              if (defaultBranch && !row.branchId) row.branchId = defaultBranch;

              return row;
            })
            .filter((row) => row.pincode && row.state);

          if (data.length === 0) {
            toast.error("No valid pincode data found");
            setIsUploading(false);
            return;
          }

          const token = localStorage.getItem("token");
          await axios.post("/api/pincodes/bulk", data, {
            headers: { Authorization: `Bearer ${token}` }
          });

          toast.success(`Successfully imported ${data.length} records`);
          onUploadSuccess();
        } catch (error) {
          console.error("Error processing CSV:", error);
          toast.error("Error importing data. Check console for details.");
          setIsUploading(false);
        }
      };

      reader.readAsText(file);
    } catch (error) {
      toast.error("Error processing file");
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const headers = "pincode,office name,city,district,state,zone";
    const example = "400001,Mumbai G.P.O.,Mumbai,Mumbai,Maharashtra,West";
    const template = [headers, example].join("\n");
    const blob = new Blob([template], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pincodes_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <Card className="w-full max-w-4xl h-full max-h-[90vh] rounded-2xl border-border/70 shadow-lg flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/70 bg-card flex-shrink-0">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Upload className="h-5 w-5" />
            Bulk Import Pincode Master
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="rounded-lg h-8 w-8 p-0"
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-6 space-y-6 overflow-y-auto flex-1 text-center">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Upload a CSV file containing the Pincode master data. The system will map fields automatically.
            </p>
          </div>

          <div className="relative max-w-xl mx-auto">
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDragging
                ? "border-primary bg-primary/5"
                : "border-border bg-muted/30"
                } ${isUploading ? "opacity-50" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <div className="space-y-2 mb-4">
                <p className="text-sm font-medium text-foreground">
                  {file ? `Selected: ${file.name}` : "Drag & drop CSV file here"}
                </p>
                {!file && <p className="text-xs text-muted-foreground">or click to browse</p>}
              </div>

              <input
                type="file"
                accept=".csv"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading}
              />

              <Button variant="outline" size="sm" className="rounded-xl shadow-none" disabled={isUploading}>
                {file ? "Change File" : "Select CSV"}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              variant="link"
              className="text-primary gap-2 h-auto p-0"
              onClick={downloadTemplate}
              disabled={isUploading}
            >
              <Download className="h-4 w-4" />
              Download Sample Template
            </Button>
          </div>

          <div className="flex gap-3 justify-center pt-4">
            <Button
              variant="ghost"
              className="px-8 rounded-xl"
              onClick={onCancel}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              className="px-8 rounded-xl bg-primary hover:bg-primary/90"
              onClick={handleUpload}
              disabled={!file || isUploading}
            >
              {isUploading ? "Importing..." : "Start Import"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkUploadModal;
