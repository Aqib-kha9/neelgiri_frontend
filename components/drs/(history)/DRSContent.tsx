import { DRSTable } from "../shared/DRSTable";
import { DRSData } from "./types/drs";

interface PerformanceStats {
  averageEfficiency: number;
  onTimeDelivery: number;
  customerSatisfaction: number;
}

interface DRSContentProps {
  filteredDRS: DRSData[];
  selectedDRS: DRSData;
  setSelectedDRS: (drs: DRSData) => void;
  performanceStats: PerformanceStats;
}

const DRSContent = ({
  filteredDRS,
  selectedDRS,
  setSelectedDRS,
  performanceStats,
}: DRSContentProps) => {
  return (
    <div className="space-y-6">
      <DRSTable data={filteredDRS} title="DRS History List" onViewDetails={setSelectedDRS} />
    </div>
  );
};

export default DRSContent;
