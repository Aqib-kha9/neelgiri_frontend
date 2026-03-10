// components/master/products/ProductsList.tsx
import {
  Edit,
  Trash2,
  Package,
  Weight,
  Ruler,
  IndianRupee,
  ShieldAlert,
  AlertTriangle,
  Thermometer,
  MoreHorizontal,
  Box,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "./types";

interface ProductsListProps {
  products: Product[];
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onToggleStatus: (productId: string) => void;
}

const ProductsList = ({
  products,
  onEditProduct,
  onDeleteProduct,
  onToggleStatus,
}: ProductsListProps) => {

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="border-green-500/20 bg-green-500/5 text-green-600 rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-none">
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge variant="outline" className="border-red-500/20 bg-red-500/5 text-red-600 rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-none">
            Inactive
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {status}
          </Badge>
        );
    }
  };

  if (products.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/10 p-8 text-center animate-in fade-in-50">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mb-4">
          <Package className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No Products Found</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          Try adjusting your search filters or add a new product to your catalog.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[1200px]">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="w-[300px] py-4 pl-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product Details</TableHead>
                <TableHead className="w-[200px] py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Specifications</TableHead>
                <TableHead className="w-[150px] py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Value</TableHead>
                <TableHead className="w-[250px] py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Handling & Storage</TableHead>
                <TableHead className="w-[120px] py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</TableHead>
                <TableHead className="w-[80px] py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="group border-border/50 hover:bg-muted/30 transition-colors">
                  <TableCell className="py-4 pl-6">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background shadow-sm">
                        <Box className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{product.name}</span>
                          <Badge variant="outline" className="px-1.5 py-0 text-[10px] h-4 rounded-sm border-border bg-muted text-muted-foreground">
                            {product.sku}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{product.category}</span>
                          {product.subCategory && (
                            <>
                              <span className="h-1 w-1 rounded-full bg-border" />
                              <span>{product.subCategory}</span>
                            </>
                          )}
                        </div>
                        <div className="text-[10px] text-muted-foreground/70 font-mono">
                          HSN: {product.hsnCode}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Weight className="h-3.5 w-3.5" />
                        <span className="font-medium text-foreground">{product.weight} kg</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Ruler className="h-3.5 w-3.5" />
                        <span>{product.dimensions}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-1 font-medium text-foreground">
                      <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" />
                      {product.value.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {product.fragile && (
                        <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-medium border-orange-200 bg-orange-50 text-orange-700 gap-1">
                          <ShieldAlert className="h-3 w-3" />
                          Fragile
                        </Badge>
                      )}
                      {product.hazardous && (
                        <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-medium border-red-200 bg-red-50 text-red-700 gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Hazmat
                        </Badge>
                      )}
                      {product.temperatureSensitive && (
                        <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-medium border-blue-200 bg-blue-50 text-blue-700 gap-1">
                          <Thermometer className="h-3 w-3" />
                          Temp Ctrl
                        </Badge>
                      )}
                      {!product.fragile && !product.hazardous && !product.temperatureSensitive && (
                        <span className="text-xs text-muted-foreground italic">Standard Handling</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    {getStatusBadge(product.status)}
                  </TableCell>
                  <TableCell className="py-4 pr-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl border-border/60 shadow-lg">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEditProduct(product)} className="gap-2 cursor-pointer">
                          <Edit className="h-4 w-4 text-muted-foreground" />
                          Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onToggleStatus(product.id)} className="gap-2 cursor-pointer">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          {product.status === "active" ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onDeleteProduct(product.id)} className="gap-2 text-red-600 focus:text-red-700 cursor-pointer">
                          <Trash2 className="h-4 w-4" />
                          Delete Product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ProductsList;
