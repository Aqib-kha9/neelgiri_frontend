import {
    Building2,
    Users,
    MapPin,
    Mail,
    Phone,
    Edit,
    MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Customer } from "../types";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DetailHeaderProps {
    customer: Customer;
}

const DetailHeader = ({ customer }: DetailHeaderProps) => {
    return (
        <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
            <div className="flex items-start gap-5">
                <div className="rounded-3xl bg-primary/10 p-4 text-primary">
                    {customer.customerType === "REGULAR" || Boolean(customer.gstin) ? (
                        <Building2 className="h-8 w-8" />
                    ) : (
                        <Users className="h-8 w-8" />
                    )}
                </div>
                <div className="space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-3xl font-bold text-foreground">
                            {customer.name}
                        </h1>
                        <Badge variant="secondary" className="font-mono">
                            {customer.code}
                        </Badge>
                        <Badge
                            variant={customer.status === "active" ? "success" : "secondary"}
                            className="rounded-full capitalize"
                        >
                            {customer.status}
                        </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {customer.email}
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {customer.phoneO || customer.mobileNo}
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {customer.city}, {customer.station}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Button variant="outline" className="gap-2 rounded-xl border-border/70">
                    <Edit className="h-4 w-4" />
                    Edit Profile
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-xl">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Suspend Account</DropdownMenuItem>
                        <DropdownMenuItem className="text-error">
                            Delete Account
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

export default DetailHeader;
