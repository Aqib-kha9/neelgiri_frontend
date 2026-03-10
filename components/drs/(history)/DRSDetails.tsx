import DRSSummary from "./DRSSummary";
import RiderInformation from "./RiderInformation";
import IssuesResolutions from "./IssuesResolutions";
import PerformanceComparison from "./PerformanceComparison";

interface DRSData {
  id: string;
  drsNumber: string;
  status: string;
  rider: {
    id: string;
    name: string;
    phone: string;
    vehicle: string;
    rating: number;
  };
  date: string;
  timeline: {
    startTime: string;
    endTime: string;
    duration: string;
  };
  progress: {
    totalShipments: number;
    delivered: number;
    pending: number;
    returned: number;
    completion: number;
  };
  financial: {
    totalCOD: number;
    collectedCOD: number;
    pendingCOD: number;
    cashDeposited: number;
    depositTime: string;
  };
  performance: {
    averageTimePerStop: string;
    efficiency: number;
    onTimeRate: number;
    customerRating: number;
  };
  route: {
    totalDistance: string;
    optimized: boolean;
    fuelCost: string;
  };
  issues: Array<{
    type: string;
    description: string;
  }>;
}

interface PerformanceStats {
  averageEfficiency: number;
  onTimeDelivery: number;
  customerSatisfaction: number;
}

interface DRSDetailsProps {
  selectedDRS: DRSData;
  performanceStats: PerformanceStats;
}

const DRSDetails = ({ selectedDRS, performanceStats }: DRSDetailsProps) => {
  return (
    <div className="xl:col-span-2 space-y-6">
      <DRSSummary selectedDRS={selectedDRS} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiderInformation selectedDRS={selectedDRS} />
        <IssuesResolutions selectedDRS={selectedDRS} />
      </div>

      <PerformanceComparison
        selectedDRS={selectedDRS}
        performanceStats={performanceStats}
      />
    </div>
  );
};

export default DRSDetails;
