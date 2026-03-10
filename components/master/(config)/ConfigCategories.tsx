import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { configCategories } from "./mockData";
import {
  Settings,
  Building,
  Truck,
  IndianRupee,
  Bell,
  Shield,
} from "lucide-react";

interface ConfigCategoriesProps {
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const iconMap = {
  Settings,
  Building,
  Truck,
  IndianRupee,
  Bell,
  Shield,
};

const colorMap = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  orange: "bg-orange-100 text-orange-600",
  purple: "bg-purple-100 text-purple-600",
  red: "bg-red-100 text-red-600",
  yellow: "bg-yellow-100 text-yellow-600",
};

const ConfigCategories = ({
  activeCategory,
  onCategoryChange,
}: ConfigCategoriesProps) => {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {configCategories.map((category) => {
        const IconComponent = iconMap[category.icon as keyof typeof iconMap];
        const colorClass = colorMap[category.color as keyof typeof colorMap];

        return (
          <Card
            key={category.id}
            className={`cursor-pointer transition-all border-2 rounded-2xl ${
              activeCategory === category.id
                ? "border-primary shadow-lg bg-primary/5"
                : "border-border/70 hover:border-primary/50"
            }`}
            onClick={() => onCategoryChange(category.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-xl p-2 ${colorClass}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        activeCategory === category.id ? "default" : "outline"
                      }
                      className="rounded-full text-xs"
                    >
                      {activeCategory === category.id
                        ? "Selected"
                        : "Configure"}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      Settings: {Math.floor(Math.random() * 8) + 5}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ConfigCategories;
