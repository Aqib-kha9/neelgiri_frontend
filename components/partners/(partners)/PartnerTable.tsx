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
import { Partner } from "./types";
import {
    MoreHorizontal,
    Eye,
    Edit,
    Store,
    Phone,
    Mail,
} from "lucide-react";

interface PartnerTableProps {
    data: Partner[];
}

export const PartnerTable = ({ data }: PartnerTableProps) => {
    const getTypeColor = (type: string) => {
        switch (type) {
            case "restaurant":
                return "bg-orange-500/10 text-orange-500";
            case "grocery":
                return "bg-green-500/10 text-green-500";
            case "pharmacy":
                return "bg-blue-500/10 text-blue-500";
            case "retail":
                return "bg-purple-500/10 text-purple-500";
            default:
                return "bg-muted text-muted-foreground";
        }
    };

    return (
        <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-base font-semibold text-foreground">
                        Partner Directory
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                        Complete partner network with performance metrics
                    </p>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[280px]">Partner Details</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Performance</TableHead>
                                <TableHead>Revenue</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Rating</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-24 text-center">
                                        No partners found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((partner) => (
                                    <TableRow key={partner.id} className="group hover:bg-muted/20">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-2xl p-2 bg-primary/10 text-primary">
                                                    <Store className="h-5 w-5" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-semibold text-foreground">
                                                        {partner.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        ID: {partner.partnerId}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {partner.contactPerson}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`rounded-full text-xs capitalize ${getTypeColor(partner.type)}`}>
                                                {partner.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm text-foreground">{partner.location}</div>
                                            <div className="text-xs text-muted-foreground">{partner.city}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-2 w-24 overflow-hidden rounded-full bg-muted/40">
                                                        <div
                                                            className={`h-full rounded-full ${partner.performanceScore >= 90
                                                                    ? "bg-success"
                                                                    : partner.performanceScore >= 80
                                                                        ? "bg-warning"
                                                                        : "bg-error"
                                                                }`}
                                                            style={{ width: `${partner.performanceScore}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-semibold text-foreground">
                                                        {partner.performanceScore}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <span className="font-semibold text-foreground">
                                                    ₹{(partner.monthlyRevenue / 1000).toFixed(0)}K
                                                </span>
                                                <p className="text-xs text-muted-foreground">
                                                    /month
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    partner.status === "active"
                                                        ? "success"
                                                        : partner.status === "pending"
                                                            ? "warning"
                                                            : "secondary"
                                                }
                                                className="rounded-full"
                                            >
                                                {partner.status === "active"
                                                    ? "Active"
                                                    : partner.status === "pending"
                                                        ? "Pending"
                                                        : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <span className="font-medium text-foreground">
                                                    {partner.avgRating > 0 ? partner.avgRating.toFixed(1) : "N/A"}
                                                </span>
                                                {partner.avgRating > 0 && (
                                                    <span className="text-muted-foreground">/ 5.0</span>
                                                )}
                                            </div>
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
                                                            Edit Partner
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                                                            <Phone className="h-4 w-4" />
                                                            Contact
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                                                            <Mail className="h-4 w-4" />
                                                            Send Email
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
                </div>
            </CardContent>
        </Card>
    );
};
