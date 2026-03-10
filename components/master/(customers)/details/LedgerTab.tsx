import { Card, CardContent } from "@/components/ui/card";
import { Customer } from "../types";
import { Receipt } from "lucide-react";

interface LedgerTabProps {
    customer: Customer;
}

const LedgerTab = ({ customer }: LedgerTabProps) => {
    return (
        <Card className="rounded-2xl border-border/70 shadow-card min-h-[400px] flex items-center justify-center">
            <CardContent className="text-center space-y-4">
                <div className="bg-muted rounded-full p-4 inline-flex">
                    <Receipt className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">No Ledger Entries</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                        There are no recent financial transactions or invoices generated for this customer account.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

export default LedgerTab;
