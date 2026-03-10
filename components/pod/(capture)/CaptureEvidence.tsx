import SignatureCapture from "./SignatureCapture";
import PhotoEvidence from "./PhotoEvidence";
import IDVerification from "./IDVerification";

interface CaptureEvidenceProps {
  selectedPOD: any;
  setCaptureMode: (mode: "signature" | "photo" | "id" | null) => void;
}

const CaptureEvidence = ({
  selectedPOD,
  setCaptureMode,
}: CaptureEvidenceProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <SignatureCapture
        selectedPOD={selectedPOD}
        setCaptureMode={setCaptureMode}
      />
      <PhotoEvidence
        selectedPOD={selectedPOD}
        setCaptureMode={setCaptureMode}
      />
      <IDVerification
        selectedPOD={selectedPOD}
        setCaptureMode={setCaptureMode}
      />
    </div>
  );
};

export default CaptureEvidence;
