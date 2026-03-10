// components/master/products/ProductsStats.tsx
import {
  Package,
  AlertTriangle,
  Thermometer,
  ShieldAlert,
  CheckCircle2,
  Box,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "./types";

interface ProductsStatsProps {
  products: Product[];
}

const ProductsStats = ({ products }: ProductsStatsProps) => {
  const activeProducts = products.filter((p) => p.status === "active").length;
  const fragileProducts = products.filter((p) => p.fragile).length;
  const hazardousProducts = products.filter((p) => p.hazardous).length;
  const temperatureSensitive = products.filter(
    (p) => p.temperatureSensitive
  ).length;

  // Use fragile + hazardous count as 'Special Handling' metric
  const specialHandling = fragileProducts + hazardousProducts;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card overflow-hidden">
        <CardContent className="p-5">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Total SKUs</span>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold tracking-tight">{products.length}</h3>
                <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-xs">
                  Catalog
                </Badge>
              </div>
            </div>
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Package className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card overflow-hidden">
        <CardContent className="p-5">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Active Items</span>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold tracking-tight text-green-600">{activeProducts}</h3>
                <Badge variant="outline" className="border-green-500/20 bg-green-500/5 text-green-600 text-xs">
                  Live
                </Badge>
              </div>
            </div>
            <div className="p-3 bg-green-500/10 rounded-2xl">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card overflow-hidden">
        <CardContent className="p-5">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Fragile / Hazmat</span>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold tracking-tight text-orange-600">{specialHandling}</h3>
                <Badge variant="outline" className="border-orange-500/20 bg-orange-500/5 text-orange-600 text-xs">
                  Special Care
                </Badge>
              </div>
            </div>
            <div className="p-3 bg-orange-500/10 rounded-2xl">
              <ShieldAlert className="h-5 w-5 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card overflow-hidden">
        <CardContent className="p-5">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Temp Sensitive</span>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold tracking-tight text-blue-600">{temperatureSensitive}</h3>
                <Badge variant="outline" className="border-blue-500/20 bg-blue-500/5 text-blue-600 text-xs">
                  Cold Chain
                </Badge>
              </div>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-2xl">
              <Thermometer className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsStats;
