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
import { Asset } from "./types";
import {
    MoreHorizontal,
    Eye,
    Edit,
    Wrench,
    UserPlus,
    Box,
} from "lucide-react";

interface AssetTableProps {
    data: Asset[];
}

export const AssetTable = ({ data }: AssetTableProps) => {
    const getConditionColor = (condition: string) => {
        switch (condition) {
            case "excellent":
                return "text-success";
            case "good":
                return "text-primary";
            case "fair":
                return "text-warning";
            case "poor":
                return "text-error";
            default:
                return "text-muted-foreground";
        }
    };

    return (
        <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-base font-semibold text-foreground">
                        Asset Registry
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                        Complete asset inventory with maintenance tracking
                    </p>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[280px]">Asset Details</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Condition</TableHead>
                                <TableHead>Value</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Assigned To</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-24 text-center">
                                        No assets found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((asset) => (
                                    <TableRow key={asset.id} className="group hover:bg-muted/20">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-2xl p-2 bg-primary/10 text-primary">
                                                    <Box className="h-5 w-5" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-semibold text-foreground">
                                                        {asset.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        ID: {asset.assetId}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Purchased: {new Date(asset.purchaseDate).toLocaleDateString("en-IN")}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="rounded-full text-xs">
                                                {asset.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-foreground line-clamp-2">
                                                {asset.location}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`font-medium capitalize ${getConditionColor(asset.condition)}`}>
                                                {asset.condition}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <span className="font-semibold text-foreground">
                                                    ₹{(asset.currentValue / 1000).toFixed(1)}K
                                                </span>
                                                <p className="text-xs text-muted-foreground">
                                                    Original: ₹{(asset.purchaseValue / 1000).toFixed(1)}K
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    asset.status === "active"
                                                        ? "success"
                                                        : asset.status === "maintenance"
                                                            ? "warning"
                                                            : "secondary"
                                                }
                                                className="rounded-full"
                                            >
                                                {asset.status === "active"
                                                    ? "Active"
                                                    : asset.status === "maintenance"
                                                        ? "Maintenance"
                                                        : "Retired"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-foreground">
                                                {asset.assignedTo}
                                            </span>
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
                                                            Edit Asset
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                                                            <UserPlus className="h-4 w-4" />
                                                            Assign
                                                        </DropdownMenuItem>
                                                        {asset.status !== "maintenance" && (
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-warning">
                                                                <Wrench className="h-4 w-4" />
                                                                Schedule Maintenance
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
