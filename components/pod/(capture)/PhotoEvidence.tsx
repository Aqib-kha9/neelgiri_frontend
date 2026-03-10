import { Camera, Eye } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PhotoEvidenceProps {
  selectedPOD: any;
  setCaptureMode: (mode: "signature" | "photo" | "id" | null) => void;
}

const PhotoEvidence = ({ selectedPOD, setCaptureMode }: PhotoEvidenceProps) => {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Camera className="h-5 w-5 text-primary" />
          Photo Evidence
        </CardTitle>
        <CardDescription>Photos of package and delivery</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {selectedPOD.capture.photos.length > 0 ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {selectedPOD.capture.photos.map((photo: any) => (
                  <div key={photo.id} className="relative group">
                    <img
                      src={photo.url}
                      alt={photo.description}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Eye className="h-4 w-4 text-white" />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center">
                {selectedPOD.capture.photos.length} photos captured
              </p>
            </div>
          ) : (
            <div className="text-center space-y-3">
              <div className="border-2 border-dashed border-border rounded-xl p-8 bg-muted/30">
                <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-sm text-muted-foreground">
                  No photos captured
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full gap-2 rounded-lg"
                onClick={() => setCaptureMode("photo")}
              >
                <Camera className="h-4 w-4" />
                Capture Photos
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PhotoEvidence;
