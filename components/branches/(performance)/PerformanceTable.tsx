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
import { BranchPerformance } from "./types";
import {
    MoreHorizontal,
    Eye,
    FileText,
    AlertCircle,
    TrendingDown,
    TrendingUp,
    Minus,
} from "lucide-react";

interface PerformanceTableProps {
    data: BranchPerformance[];
}

export const PerformanceTable = ({ data }: PerformanceTableProps) => {
    return (
        <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-base font-semibold text-foreground">
                        Performance Metrics
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                        Detailed breakdown by branch
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg border-border/70"
                    >
                        Download CSV
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[250px]">Branch</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Performance Score</TableHead>
                            <TableHead>Delivery Success</TableHead>
                            <TableHead>Cust. Satisfaction</TableHead>
                            <TableHead>Avg. Time</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center">
                                    No results found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((branch) => (
                                <TableRow key={branch.id} className="group hover:bg-muted/20">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`rounded-2xl p-2 ${branch.type === "company"
                                                    ? "bg-primary/10 text-primary"
                                                    : "bg-warning/10 text-warning"
                                                    }`}
                                            >
                                                {branch.trend === "up" ? (
                                                    <TrendingUp className="h-5 w-5" />
                                                ) : branch.trend === "down" ? (
                                                    <TrendingDown className="h-5 w-5" />
                                                ) : (
                                                    <Minus className="h-5 w-5" />
                                                )}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-semibold text-foreground">
                                                    {branch.name}
                                                </p>
                                                <Badge
                                                    variant={
                                                        branch.type === "company" ? "secondary" : "warning"
                                                    }
                                                    className="rounded-full text-xs"
                                                >
                                                    {branch.type === "company" ? "Company" : "Partner"}
                                                </Badge>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm text-foreground">{branch.location}</div>
                                        <div className="text-xs text-muted-foreground">
                                            Code: {branch.code}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-2 w-24 overflow-hidden rounded-full bg-muted/40">
                                                    <div
                                                        className={`h-full rounded-full ${branch.performanceScore >= 90
                                                            ? "bg-success"
                                                            : branch.performanceScore >= 80
                                                                ? "bg-warning"
                                                                : "bg-error"
                                                            }`}
                                                        style={{ width: `${branch.performanceScore}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-semibold text-foreground">
                                                    {branch.performanceScore}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-medium text-foreground">
                                            {branch.deliverySuccessRate}%
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <span className="font-medium text-foreground">
                                                {branch.customerSatisfaction}
                                            </span>
                                            <span className="text-muted-foreground">/ 5.0</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <span className="font-medium text-foreground">
                                                {branch.avgDeliveryTime}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                branch.status === "active"
                                                    ? "success"
                                                    : branch.status === "warning"
                                                        ? "warning"
                                                        : "error"
                                            }
                                            className="rounded-full"
                                        >
                                            {branch.status === "active"
                                                ? "On Track"
                                                : branch.status === "warning"
                                                    ? "Warning"
                                                    : "Critical"}
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
                                                        <FileText className="h-4 w-4" />
                                                        Full Report
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="flex items-center gap-2 rounded-lg text-error">
                                                        <AlertCircle className="h-4 w-4" />
                                                        Report Issue
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};
