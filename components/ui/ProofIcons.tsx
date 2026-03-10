import { Signature, Image, Shield } from "lucide-react";
import { Proof } from "@/components/booking/(delivered)/types/index";

interface ProofIconsProps {
  proof: Proof;
}

const ProofIcons = ({ proof }: ProofIconsProps) => {
  return (
    <div className="flex items-center gap-2">
      {proof.signature && (
        <div className="flex items-center gap-1">
          <Signature className="h-4 w-4 text-green-600" />
          <span className="text-xs text-muted-foreground">Signature</span>
        </div>
      )}
      {proof.photo && (
        <div className="flex items-center gap-1">
          <Image className="h-4 w-4 text-blue-600" />
          <span className="text-xs text-muted-foreground">Photo</span>
        </div>
      )}
      {proof.idProof && (
        <div className="flex items-center gap-1">
          <Shield className="h-4 w-4 text-purple-600" />
          <span className="text-xs text-muted-foreground">ID Proof</span>
        </div>
      )}
    </div>
  );
};

export default ProofIcons;
