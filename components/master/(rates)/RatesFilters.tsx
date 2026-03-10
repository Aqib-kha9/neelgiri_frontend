import { Search, RotateCcw, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RateRule } from "./types";

interface RatesFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    customerType: string;
    onCustomerTypeChange: (value: any) => void;
    serviceType: string;
    onServiceTypeChange: (value: any) => void;
    paymentMode: string;
    onPaymentModeChange: (value: any) => void;
    statusFilter: string;
    onStatusFilterChange: (value: any) => void;
    filteredCount: number;
}

const RatesFilters = ({
    searchTerm,
    onSearchChange,
    customerType,
    onCustomerTypeChange,
    serviceType,
    onServiceTypeChange,
    paymentMode,
    onPaymentModeChange,
    statusFilter,
    onStatusFilterChange,
    filteredCount,
}: RatesFiltersProps) => {
    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-3">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col md:flex-row gap-3">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name, ID..."
                                    className="pl-10 h-10 bg-background/50 border-border/60 focus:border-primary/50 transition-colors"
                                    value={searchTerm}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-2">
                            <Select value={customerType} onValueChange={onCustomerTypeChange}>
                                <SelectTrigger className="w-[140px] h-10 bg-background/50 border-border/60">
                                    <SelectValue placeholder="Customer" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Types</SelectItem>
                                    <SelectItem value="CUSTOMER">Customer</SelectItem>
                                    <SelectItem value="AGENT">Agent</SelectItem>
                                    <SelectItem value="VENDOR">Vendor</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={serviceType} onValueChange={onServiceTypeChange}>
                                <SelectTrigger className="w-[140px] h-10 bg-background/50 border-border/60">
                                    <SelectValue placeholder="Service" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Services</SelectItem>
                                    <SelectItem value="SURFACE">Surface</SelectItem>
                                    <SelectItem value="AIR">Air</SelectItem>
                                    <SelectItem value="EXPRESS">Express</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={paymentMode} onValueChange={onPaymentModeChange}>
                                <SelectTrigger className="w-[140px] h-10 bg-background/50 border-border/60">
                                    <SelectValue placeholder="Payment" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Modes</SelectItem>
                                    <SelectItem value="PREPAID">Prepaid</SelectItem>
                                    <SelectItem value="COD">COD</SelectItem>
                                    <SelectItem value="CREDIT">Credit</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                                <SelectTrigger className="w-[140px] h-10 bg-background/50 border-border/60">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Status</SelectItem>
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                    <SelectItem value="EXPIRED">Expired</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                variant="outline"
                                size="icon"
                                className="h-10 w-10 border-border/60"
                                onClick={() => {
                                    onSearchChange("");
                                    onCustomerTypeChange("ALL");
                                    onServiceTypeChange("ALL");
                                    onPaymentModeChange("ALL");
                                    onStatusFilterChange("ALL");
                                }}
                            >
                                <RotateCcw className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default RatesFilters;
