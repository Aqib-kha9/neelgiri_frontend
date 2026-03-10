import { Signature, Camera, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeaderSection = () => {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-blue-100 p-2">
            <Signature className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">POD Capture</h1>
            <p className="text-muted-foreground">
              Capture proof of delivery with signatures, photos, and ID
              verification
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" className="gap-2 rounded-xl border-border/70">
          <Download className="h-4 w-4" />
          Export PODs
        </Button>
        <Button className="gap-2 rounded-xl bg-primary text-primary-foreground shadow-brand">
          <Camera className="h-4 w-4" />
          New Capture
        </Button>
      </div>
    </div>
  );
};

export default HeaderSection;
