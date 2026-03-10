import PODList from "./PODList";
import PODDetails from "./PODDetails";

interface MainContentProps {
  filteredPODs: any[];
  selectedPOD: any;
  setSelectedPOD: (pod: any) => void;
  setCaptureMode: (mode: "signature" | "photo" | "id" | null) => void;
}

const MainContent = ({
  filteredPODs,
  selectedPOD,
  setSelectedPOD,
  setCaptureMode,
}: MainContentProps) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-1 space-y-4">
        <PODList
          filteredPODs={filteredPODs}
          selectedPOD={selectedPOD}
          setSelectedPOD={setSelectedPOD}
        />
      </div>

      <div className="xl:col-span-2 space-y-6">
        <PODDetails selectedPOD={selectedPOD} setCaptureMode={setCaptureMode} />
      </div>
    </div>
  );
};

export default MainContent;
