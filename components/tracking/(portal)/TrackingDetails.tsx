import TrackingSummary from "./TrackingSummary";
import TimelineAlerts from "./TimelineAlerts";
import QuickActionsPanel from "./QuickActionsPanel";

interface TrackingDetailsProps {
  tracking: any;
}

const TrackingDetails = ({ tracking }: TrackingDetailsProps) => {
  return (
    <div className="xl:col-span-2 space-y-6">
      <TrackingSummary tracking={tracking} />
      <TimelineAlerts tracking={tracking} />
      <QuickActionsPanel tracking={tracking} />
    </div>
  );
};

export default TrackingDetails;
