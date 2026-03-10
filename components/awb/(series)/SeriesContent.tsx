import SeriesInfo from "./SeriesInfo";
import AllocationDetails from "./AllocationDetails";
import UsageStatistics from "./UsageStatistics";
import RestrictionsActions from "./RestrictionsActions";

interface SeriesContentProps {
  series: any;
}

const SeriesContent = ({ series }: SeriesContentProps) => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <SeriesInfo series={series} />
        <AllocationDetails series={series} />
        <UsageStatistics series={series} />
        <RestrictionsActions series={series} />
      </div>
    </div>
  );
};

export default SeriesContent;
