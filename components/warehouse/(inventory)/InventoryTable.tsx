import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InventoryItem } from "./types";
import {
    MoreHorizontal,
    Eye,
    Edit,
    Package,
    AlertCircle,
} from "lucide-react";

interface InventoryTableProps {
    data: InventoryItem[];
}

export const InventoryTable = ({ data }: InventoryTableProps) => {
    const getStockPercentage = (current: number, max: number) => {
        return Math.min((current / max) * 100, 100);
    };

    return (
        <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-base font-semibold text-foreground">
                        Inventory Items
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                        Complete inventory list with stock levels
                    </p>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[280px]">Item Details</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Stock Level</TableHead>
                                <TableHead>Min/Max</TableHead>
                                <TableHead>Unit Price</TableHead>
                                <TableHead>Total Value</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-24 text-center">
                                        No items found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((item) => (
                                    <TableRow key={item.id} className="group hover:bg-muted/20">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-2xl p-2 bg-primary/10 text-primary">
                                                    <Package className="h-5 w-5" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-semibold text-foreground">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        SKU: {item.sku}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground line-clamp-1">
                                                        {item.location}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="rounded-full text-xs">
                                                {item.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-2 w-24 overflow-hidden rounded-full bg-muted/40">
                                                        <div
                                                            className={`h-full rounded-full ${item.status === "in-stock"
                                                                    ? "bg-success"
                                                                    : item.status === "low-stock"
                                                                        ? "bg-warning"
                                                                        : "bg-error"
                                                                }`}
                                                            style={{
                                                                width: `${getStockPercentage(
                                                                    item.currentStock,
                                                                    item.maxStock
                                                                )}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-semibold text-foreground">
                                                        {item.currentStock}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm text-muted-foreground">
                                                {item.minStock} / {item.maxStock}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-medium text-foreground">
                                                ₹{item.unitPrice}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-semibold text-foreground">
                                                ₹{item.totalValue.toLocaleString()}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    item.status === "in-stock"
                                                        ? "success"
                                                        : item.status === "low-stock"
                                                            ? "warning"
                                                            : "error"
                                                }
                                                className="rounded-full"
                                            >
                                                {item.status === "in-stock"
                                                    ? "In Stock"
                                                    : item.status === "low-stock"
                                                        ? "Low Stock"
                                                        : "Out of Stock"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-end">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="rounded-lg"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-xl">
                                                        <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                                                            <Eye className="h-4 w-4" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                                                            <Edit className="h-4 w-4" />
                                                            Edit Item
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                                                            <Package className="h-4 w-4" />
                                                            Restock
                                                        </DropdownMenuItem>
                                                        {item.status !== "in-stock" && (
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-error">
                                                                <AlertCircle className="h-4 w-4" />
                                                                Report Issue
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};
