import { Signature, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SignaturesHeaderProps {
  onNewCapture: () => void;
}

const SignaturesHeader = ({ onNewCapture }: SignaturesHeaderProps) => {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-blue-100 p-2">
            <Signature className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              POD Signatures
            </h1>
            <p className="text-muted-foreground">
              Manage and verify digital signatures for proof of delivery
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" className="gap-2 rounded-xl border-border/70">
          <Download className="h-4 w-4" />
          Export
        </Button>
        <Button
          className="gap-2 rounded-xl bg-primary text-primary-foreground shadow-brand"
          onClick={onNewCapture}
        >
          <Plus className="h-4 w-4" />
          New Capture
        </Button>
      </div>
    </div>
  );
};

export default SignaturesHeader;
