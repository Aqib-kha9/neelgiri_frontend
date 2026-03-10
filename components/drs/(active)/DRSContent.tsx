import { DRSTable } from "../shared/DRSTable";

interface DRSContentProps {
  filteredDRS: any[];
  selectedDRS: any;
  setSelectedDRS: (drs: any) => void;
  onEdit: (drs: any) => void;
  onRefresh: () => void;
}

const DRSContent = ({
  filteredDRS,
  selectedDRS,
  setSelectedDRS,
  onEdit,
  onRefresh,
}: DRSContentProps) => {
  return (
    <div className="space-y-6">
      <DRSTable
        data={filteredDRS}
        title="Active DRS List"
        onEdit={onEdit}
        onRefresh={onRefresh}
      />
    </div>
  );
};

export default DRSContent;
