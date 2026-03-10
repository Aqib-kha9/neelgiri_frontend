"use client";

import { useState, useRef } from "react";
import {
  Signature,
  Camera,
  IdCard,
  Package,
  User,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CaptureModalProps {
  captureMode: "signature" | "photo" | "id" | null;
  setCaptureMode: (mode: "signature" | "photo" | "id" | null) => void;
}

const CaptureModal = ({ captureMode, setCaptureMode }: CaptureModalProps) => {
  const [signatureData, setSignatureData] = useState("");
  const [capturedPhotos, setCapturedPhotos] = useState<any[]>([]);
  const [idPhoto, setIdPhoto] = useState("");
  const [notes, setNotes] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.closePath();
    setIsDrawing(false);

    setSignatureData(canvas.toDataURL());
  };

  const clearSignature = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureData("");
  };

  const capturePhoto = (type: string) => {
    const mockPhoto = {
      id: `photo-${Date.now()}`,
      type,
      url: "/api/placeholder/400/300",
      timestamp: new Date().toISOString(),
      description: `${type} photo`,
    };
    setCapturedPhotos((prev) => [...prev, mockPhoto]);
  };

  const captureID = () => {
    setIdPhoto("/api/placeholder/300/200");
  };

  const submitPOD = () => {
    console.log("Submitting POD:", {
      signature: signatureData,
      photos: capturedPhotos,
      idPhoto,
      notes,
    });
    setCaptureMode(null);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl rounded-2xl border-border/70 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {captureMode === "signature" && <Signature className="h-5 w-5" />}
            {captureMode === "photo" && <Camera className="h-5 w-5" />}
            {captureMode === "id" && <IdCard className="h-5 w-5" />}
            Capture{" "}
            {captureMode === "signature"
              ? "Signature"
              : captureMode === "photo"
              ? "Photos"
              : "ID"}
          </CardTitle>
          <CardDescription>
            {captureMode === "signature" &&
              "Ask the receiver to sign in the box below"}
            {captureMode === "photo" &&
              "Take photos of the package and delivery location"}
            {captureMode === "id" &&
              "Capture the receiver's identification document"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {captureMode === "signature" && (
              <div className="space-y-4">
                <div className="border-2 border-border rounded-xl bg-white">
                  <canvas
                    ref={canvasRef}
                    width={500}
                    height={200}
                    className="w-full h-50 cursor-crosshair touch-none"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 gap-2 rounded-lg"
                    onClick={clearSignature}
                  >
                    <RotateCcw className="h-4 w-4" />
                    Clear
                  </Button>
                  <Button
                    className="flex-1 gap-2 rounded-lg"
                    onClick={() => setCaptureMode(null)}
                    disabled={!signatureData}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Save Signature
                  </Button>
                </div>
              </div>
            )}

            {captureMode === "photo" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center space-y-2">
                    <div className="border-2 border-dashed border-border rounded-xl p-8 bg-muted/30">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                    </div>
                    <Button
                      size="sm"
                      className="w-full gap-2 rounded-lg"
                      onClick={() => capturePhoto("package")}
                    >
                      <Camera className="h-4 w-4" />
                      Package Photo
                    </Button>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="border-2 border-dashed border-border rounded-xl p-8 bg-muted/30">
                      <User className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                    </div>
                    <Button
                      size="sm"
                      className="w-full gap-2 rounded-lg"
                      onClick={() => capturePhoto("receiver")}
                    >
                      <Camera className="h-4 w-4" />
                      Receiver Photo
                    </Button>
                  </div>
                </div>

                {capturedPhotos.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">
                      Captured Photos
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {capturedPhotos.map((photo) => (
                        <div key={photo.id} className="relative">
                          <img
                            src={photo.url}
                            alt={photo.description}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-lg"
                    onClick={() => setCaptureMode(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 gap-2 rounded-lg"
                    onClick={submitPOD}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Complete Capture
                  </Button>
                </div>
              </div>
            )}

            {captureMode === "id" && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-xl p-8 bg-muted/30 text-center">
                  <IdCard className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Position the ID document within the frame
                  </p>
                  <Button className="gap-2 rounded-lg" onClick={captureID}>
                    <Camera className="h-4 w-4" />
                    Capture ID
                  </Button>
                </div>

                {idPhoto && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">
                      Captured ID
                    </p>
                    <img
                      src={idPhoto}
                      alt="ID Document"
                      className="w-full max-w-xs mx-auto rounded-lg"
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <Select defaultValue="aadhaar">
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="ID Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aadhaar">Aadhaar Card</SelectItem>
                      <SelectItem value="pan">PAN Card</SelectItem>
                      <SelectItem value="driving">Driving License</SelectItem>
                      <SelectItem value="voter">Voter ID</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input placeholder="ID Number" className="rounded-lg" />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-lg"
                    onClick={() => setCaptureMode(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 gap-2 rounded-lg"
                    onClick={submitPOD}
                    disabled={!idPhoto}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Verify ID
                  </Button>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-border/70">
              <Textarea
                placeholder="Add delivery notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="rounded-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CaptureModal;
