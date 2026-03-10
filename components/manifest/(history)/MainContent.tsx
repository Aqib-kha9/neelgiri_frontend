// app/dashboard/manifest/history/components/MainContent.tsx
import HistoryList from "./HistoryList";
import HistoryDetails from "./HistoryDetails";

interface MainContentProps {
  filteredHistory: any[];
  selectedHistory: any;
  setSelectedHistory: (history: any) => void;
}

const MainContent = ({
  filteredHistory,
  selectedHistory,
  setSelectedHistory,
}: MainContentProps) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-1 space-y-4">
        <HistoryList
          history={filteredHistory}
          selectedHistory={selectedHistory}
          setSelectedHistory={setSelectedHistory}
        />
      </div>
      <div className="xl:col-span-2 space-y-6">
        <HistoryDetails history={selectedHistory} />
      </div>
    </div>
  );
};

export default MainContent;
