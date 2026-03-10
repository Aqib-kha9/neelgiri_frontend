import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";

export const SearchFilters = () => {
  return (
    <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search branches by name, city, or manager..."
                className="rounded-xl pl-10"
              />
            </div>
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="rounded-full">
              Active: 42
            </Badge>
            <Badge variant="outline" className="rounded-full">
              Company: 24
            </Badge>
            <Badge variant="outline" className="rounded-full">
              Partner: 24
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
