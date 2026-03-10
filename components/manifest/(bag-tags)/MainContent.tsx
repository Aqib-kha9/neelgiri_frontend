// app/dashboard/manifest/bag-tags/components/MainContent.tsx
import BagList from "./BagList";
import BagDetails from "./BagDetails";

interface MainContentProps {
  filteredBags: any[];
  selectedBag: any;
  setSelectedBag: (bag: any) => void;
}

const MainContent = ({
  filteredBags,
  selectedBag,
  setSelectedBag,
}: MainContentProps) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-1 space-y-4">
        <BagList
          bags={filteredBags}
          selectedBag={selectedBag}
          setSelectedBag={setSelectedBag}
        />
      </div>
      <div className="xl:col-span-2 space-y-6">
        <BagDetails bag={selectedBag} />
      </div>
    </div>
  );
};

export default MainContent;
