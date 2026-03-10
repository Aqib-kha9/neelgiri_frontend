// components/master/rates/RatesList.tsx
import {
    Tag,
    Eye,
    Edit,
    Trash2,
    Package,
    Map,
    Percent,
    Calendar,
    CheckCircle2,
    AlertCircle,
    X,
    MoreHorizontal,
    TrendingUp,
    Wallet,
    Truck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { RateRule } from "./types";

interface RatesListProps {
    rates: RateRule[];
    onEdit: (rate: RateRule) => void;
    onDelete: (id: string) => void;
    onShowDetails: (rate: RateRule) => void;
    onCreate: () => void;
    expandedRates: string[];
    toggleExpand: (id: string) => void;
}

const RatesList = ({
    rates,
    onEdit,
    onDelete,
    onShowDetails,
    onCreate,
}: RatesListProps) => {

    if (rates.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center rounded-3xl border border-border/60 bg-card/50 border-dashed">
                <div className="p-4 rounded-full bg-muted/50 mb-4">
                    <Tag className="h-10 w-10 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">No rate rules found</h3>
                <p className="text-muted-foreground max-w-sm mt-1">
                    Try adjusting your search criteria or create a new rate rule.
                </p>
                <Button onClick={onCreate} className="mt-4 gap-2">
                    Create Rate Rule
                </Button>
            </div>
        );
    }

    const getStatusBadge = (rate: RateRule) => {
        if (!rate.isActive) {
            return (
                <Badge variant="secondary" className="gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-none border-slate-200 bg-slate-100 text-slate-700">
                    <X className="h-3 w-3" /> Inactive
                </Badge>
            );
        }

        const today = new Date();
        const validTo = new Date(rate.validTo);

        if (validTo < today) {
            return (
                <Badge variant="destructive" className="gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-none border-red-200 bg-red-100 text-red-700">
                    <AlertCircle className="h-3 w-3" /> Expired
                </Badge>
            );
        }

        const daysToExpiry = Math.ceil(
            (validTo.getTime() - today.getTime()) / (1000 * 3600 * 24)
        );

        if (daysToExpiry <= 7) {
            return (
                <Badge variant="warning" className="gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-none border-amber-200 bg-amber-100 text-amber-700">
                    <AlertCircle className="h-3 w-3" /> Expiring
                </Badge>
            );
        }

        return (
            <Badge variant="success" className="gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-none border-green-200 bg-green-100 text-green-700">
                <CheckCircle2 className="h-3 w-3" /> Active
            </Badge>
        );
    };

    return (
        <div className="rounded-3xl border border-border/60 bg-card/95 shadow-sm overflow-hidden relative flex flex-col">
            <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent pb-2">
                <Table className="min-w-[1200px]">
                    <TableHeader className="bg-muted/40">
                        <TableRow className="hover:bg-transparent border-border/60">
                            <TableHead className="w-[220px] pl-6 font-semibold text-muted-foreground whitespace-nowrap">Rule Name & ID</TableHead>
                            <TableHead className="w-[200px] font-semibold text-muted-foreground whitespace-nowrap">Configuration</TableHead>
                            <TableHead className="w-[240px] font-semibold text-muted-foreground whitespace-nowrap">Rates & Charges</TableHead>
                            <TableHead className="w-[200px] font-semibold text-muted-foreground whitespace-nowrap">Validity</TableHead>
                            <TableHead className="w-[120px] font-semibold text-muted-foreground whitespace-nowrap">Status</TableHead>
                            <TableHead className="w-[60px] text-right font-semibold text-muted-foreground pr-6 whitespace-nowrap">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rates.map((rate) => (
                            <TableRow key={rate.id} className="group hover:bg-muted/30 border-border/50">
                                <TableCell className="pl-6 font-medium text-foreground align-top py-4">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                                <Tag className="h-4 w-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm whitespace-nowrap">{rate.name}</span>
                                                <span className="text-[10px] text-muted-foreground font-mono">ID: {rate.id}</span>
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="align-top py-4">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="text-[10px] px-1.5 h-5 font-medium border-border/50 whitespace-nowrap">
                                                {rate.customerType}
                                            </Badge>
                                            <Badge variant="outline" className="text-[10px] px-1.5 h-5 font-medium border-blue-200 bg-blue-50 text-blue-700 whitespace-nowrap">
                                                {rate.serviceType}
                                            </Badge>
                                            {rate.vehicleType && (
                                                <Badge variant="outline" className="text-[10px] px-1.5 h-5 font-medium border-orange-200 bg-orange-50 text-orange-700 whitespace-nowrap flex items-center gap-1">
                                                    <Truck className="h-3 w-3" />
                                                    {rate.vehicleType}
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <Wallet className="h-3 w-3" />
                                            <span>{rate.paymentMode === 'ALL' ? 'All Modes' : rate.paymentMode}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="align-top py-4">
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap" title="Slabs Configured">
                                            <Package className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                                            <span className="font-medium text-foreground">{rate.slabs.length} Slabs</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap" title="Zones Configured">
                                            <Map className="h-3.5 w-3.5 text-green-600/70 shrink-0" />
                                            <span>{rate.zones.length} Zones</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap" title="Min Charge">
                                            <TrendingUp className="h-3.5 w-3.5 text-orange-500/70 shrink-0" />
                                            <span className="font-medium text-foreground">Min ₹{rate.minCharge.amount}</span>
                                        </div>
                                        {rate.additionalCharges.length > 0 && (
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap" title="Additional Charges">
                                                <Percent className="h-3.5 w-3.5 text-purple-500/70 shrink-0" />
                                                <span>{rate.additionalCharges.length} Extras</span>
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="align-top py-4">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="text-muted-foreground">From:</span>
                                            <span className="font-medium font-mono">{new Date(rate.validFrom).toLocaleDateString("en-IN")}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="text-muted-foreground w-[30px]">To:</span>
                                            <span className="font-medium font-mono">{new Date(rate.validTo).toLocaleDateString("en-IN")}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="align-top py-4">
                                    {getStatusBadge(rate)}
                                </TableCell>
                                <TableCell className="text-right pr-6 align-top py-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-[160px] rounded-xl">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => onShowDetails(rate)}>
                                                <Eye className="mr-2 h-4 w-4" /> View Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onEdit(rate)}>
                                                <Edit className="mr-2 h-4 w-4" /> Edit Rule
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                onClick={() => onDelete(rate.id)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
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
    );
};

export default RatesList;
