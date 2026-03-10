import PODSummary from "./PODSummary";
import CaptureEvidence from "./CaptureEvidence";
import DeliveryNotes from "./DeliveryNotes";

interface PODDetailsProps {
  selectedPOD: any;
  setCaptureMode: (mode: "signature" | "photo" | "id" | null) => void;
}

const PODDetails = ({ selectedPOD, setCaptureMode }: PODDetailsProps) => {
  return (
    <>
      <PODSummary selectedPOD={selectedPOD} setCaptureMode={setCaptureMode} />
      <CaptureEvidence
        selectedPOD={selectedPOD}
        setCaptureMode={setCaptureMode}
      />
      {selectedPOD.capture.notes && <DeliveryNotes selectedPOD={selectedPOD} />}
    </>
  );
};

export default PODDetails;
