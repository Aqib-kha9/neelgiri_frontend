import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Signature, RotateCcw, CheckCircle2, X } from "lucide-react";
import { useRef, useState } from "react";

interface SignatureCaptureProps {
  onClose: () => void;
  onSave: (signatureData: any) => void;
}

const SignatureCapture = ({ onClose, onSave }: SignatureCaptureProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

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
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleSave = () => {
    if (!canvasRef.current) return;

    const signatureData = {
      url: canvasRef.current.toDataURL(),
      quality: 95,
      timestamp: new Date().toISOString(),
      confidence: 98.2,
      type: "digital",
    };

    onSave(signatureData);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl rounded-2xl border-border/70 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Signature className="h-5 w-5" />
            Capture Signature
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
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
                Clear Signature
              </Button>
              <Button
                className="flex-1 gap-2 rounded-lg"
                onClick={handleSave}
                disabled={!hasSignature}
              >
                <CheckCircle2 className="h-4 w-4" />
                Save Signature
              </Button>
            </div>

            <div className="pt-4 border-t border-border/70">
              <Textarea
                placeholder="Add delivery notes (optional)"
                className="rounded-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignatureCapture;
