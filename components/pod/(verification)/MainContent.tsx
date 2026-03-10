import VerificationList from "./VerificationList";
import VerificationDetails from "./VerificationDetails";

interface MainContentProps {
  filteredVerifications: any[];
  selectedVerification: any;
  setSelectedVerification: (verification: any) => void;
  verificationComment: string;
  setVerificationComment: (comment: string) => void;
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onApprove: (verification: any) => void;
  onReject: (verification: any) => void;
  onRequestReview: (verification: any) => void;
}

const MainContent = ({
  filteredVerifications,
  selectedVerification,
  setSelectedVerification,
  verificationComment,
  setVerificationComment,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onApprove,
  onReject,
  onRequestReview,
}: MainContentProps) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-1 space-y-4">
        <VerificationList
          filteredVerifications={filteredVerifications}
          selectedVerification={selectedVerification}
          setSelectedVerification={setSelectedVerification}
        />
      </div>

      <div className="xl:col-span-2 space-y-6">
        <VerificationDetails
          selectedVerification={selectedVerification}
          verificationComment={verificationComment}
          setVerificationComment={setVerificationComment}
          zoomLevel={zoomLevel}
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
          onResetZoom={onResetZoom}
          onApprove={onApprove}
          onReject={onReject}
          onRequestReview={onRequestReview}
        />
      </div>
    </div>
  );
};

export default MainContent;
