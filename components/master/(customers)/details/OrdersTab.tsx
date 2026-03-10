import { Card, CardContent } from "@/components/ui/card";
import { Customer } from "../types";
import { PackageOpen } from "lucide-react";

interface OrdersTabProps {
    customer: Customer;
}

const OrdersTab = ({ customer }: OrdersTabProps) => {
    return (
        <Card className="rounded-2xl border-border/70 shadow-card min-h-[400px] flex items-center justify-center">
            <CardContent className="text-center space-y-4">
                <div className="bg-muted rounded-full p-4 inline-flex">
                    <PackageOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">No Recent Orders</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                        This customer hasn't placed any orders recently. Check the filter settings or create a new booking.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

export default OrdersTab;
