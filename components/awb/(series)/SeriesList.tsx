import { Hash, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SeriesCard from "./SeriesCard";

interface SeriesListProps {
  series: any[];
}

const SeriesList = ({ series }: SeriesListProps) => {
  return (
    <div className="space-y-4">
      {series.map((seriesItem) => (
        <SeriesCard key={seriesItem.id} series={seriesItem} />
      ))}

      {series.length === 0 && (
        <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
          <CardContent className="p-12 text-center">
            <Hash className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No AWB series found
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Get started by creating your first AWB series for allocation.
            </p>
            <Button className="gap-2 rounded-xl bg-primary text-primary-foreground shadow-brand">
              <Plus className="h-4 w-4" />
              Create AWB Series
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SeriesList;
