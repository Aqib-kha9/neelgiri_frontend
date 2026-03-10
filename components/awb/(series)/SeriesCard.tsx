import { Card, CardContent } from "@/components/ui/card";
import SeriesHeader from "./SeriesHeader";
import SeriesContent from "./SeriesContent";

interface SeriesCardProps {
  series: any;
}

const SeriesCard = ({ series }: SeriesCardProps) => {
  return (
    <Card
      key={series.id}
      className="rounded-2xl border-border/70 bg-card/95 shadow-card hover:shadow-lg transition-all duration-300"
    >
      <CardContent className="p-0">
        <SeriesHeader series={series} />
        <SeriesContent series={series} />
      </CardContent>
    </Card>
  );
};

export default SeriesCard;
