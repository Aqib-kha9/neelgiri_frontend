import DRSSummary from "./DRSSummary";
import FinancialTimeline from "./FinancialTimeline";
import LiveTracking from "./LiveTracking";

interface DRSDetailsProps {
  selectedDRS: any;
}

const DRSDetails = ({ selectedDRS }: DRSDetailsProps) => {
  return (
    <div className="xl:col-span-2 space-y-6">
      <DRSSummary selectedDRS={selectedDRS} />
      <FinancialTimeline selectedDRS={selectedDRS} />
      <LiveTracking selectedDRS={selectedDRS} />
    </div>
  );
};

export default DRSDetails;
