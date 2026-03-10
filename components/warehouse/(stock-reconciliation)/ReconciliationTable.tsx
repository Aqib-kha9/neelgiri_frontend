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
import { ReconciliationRecord } from "./types";
import {
    MoreHorizontal,
    Eye,
    CheckCircle,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
} from "lucide-react";

interface ReconciliationTableProps {
    data: ReconciliationRecord[];
}

export const ReconciliationTable = ({ data }: ReconciliationTableProps) => {
    return (
        <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-base font-semibold text-foreground">
                        Reconciliation Records
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                        Stock verification and variance tracking
                    </p>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[250px]">Item Details</TableHead>
                                <TableHead>Expected Qty</TableHead>
                                <TableHead>Actual Qty</TableHead>
                                <TableHead>Variance</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Reconciled By</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-24 text-center">
                                        No reconciliation records found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((record) => (
                                    <TableRow key={record.id} className="group hover:bg-muted/20">
                                        <TableCell>
                                            <div className="space-y-1">
                                                <p className="font-semibold text-foreground">
                                                    {record.itemName}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    SKU: {record.sku}
                                                </p>
                                                <Badge variant="secondary" className="rounded-full text-xs">
                                                    {record.category}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-medium text-foreground">
                                                {record.expectedQty}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-medium text-foreground">
                                                {record.actualQty}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {record.variance !== 0 && (
                                                    record.variance > 0 ? (
                                                        <TrendingUp className="h-4 w-4 text-success" />
                                                    ) : (
                                                        <TrendingDown className="h-4 w-4 text-error" />
                                                    )
                                                )}
                                                <span
                                                    className={`font-semibold ${record.variance > 0
                                                            ? "text-success"
                                                            : record.variance < 0
                                                                ? "text-error"
                                                                : "text-muted-foreground"
                                                        }`}
                                                >
                                                    {record.variance > 0 ? "+" : ""}
                                                    {record.variance} ({record.variancePercent > 0 ? "+" : ""}
                                                    {record.variancePercent.toFixed(1)}%)
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    record.status === "resolved"
                                                        ? "success"
                                                        : record.status === "discrepancy"
                                                            ? "error"
                                                            : record.status === "in-progress"
                                                                ? "warning"
                                                                : "secondary"
                                                }
                                                className="rounded-full"
                                            >
                                                {record.status === "resolved"
                                                    ? "Resolved"
                                                    : record.status === "discrepancy"
                                                        ? "Discrepancy"
                                                        : record.status === "in-progress"
                                                            ? "In Progress"
                                                            : "Pending"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-foreground">
                                                {record.reconciledBy}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-muted-foreground">
                                                {new Date(record.reconciledDate).toLocaleDateString("en-IN")}
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
                                                        {record.status !== "resolved" && (
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-success">
                                                                <CheckCircle className="h-4 w-4" />
                                                                Mark Resolved
                                                            </DropdownMenuItem>
                                                        )}
                                                        {record.status === "discrepancy" && (
                                                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-error">
                                                                <AlertTriangle className="h-4 w-4" />
                                                                Escalate Issue
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
