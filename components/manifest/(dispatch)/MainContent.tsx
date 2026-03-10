// app/dashboard/manifest/dispatch/components/MainContent.tsx
import DispatchList from "./DispatchList";
import DispatchDetails from "./DispatchDetails";

interface MainContentProps {
  filteredDispatches: any[];
  selectedDispatch: any;
  setSelectedDispatch: (dispatch: any) => void;
}

const MainContent = ({
  filteredDispatches,
  selectedDispatch,
  setSelectedDispatch,
}: MainContentProps) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-1 space-y-4">
        <DispatchList
          dispatches={filteredDispatches}
          selectedDispatch={selectedDispatch}
          setSelectedDispatch={setSelectedDispatch}
        />
      </div>
      <div className="xl:col-span-2 space-y-6">
        <DispatchDetails dispatch={selectedDispatch} />
      </div>
    </div>
  );
};

export default MainContent;
