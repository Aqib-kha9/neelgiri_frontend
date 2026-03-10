"use client";

import { Customer } from "../types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DetailHeader from "./DetailHeader";
import OverviewTab from "./OverviewTab";
import OrdersTab from "./OrdersTab";
import LedgerTab from "./LedgerTab";

interface CustomerDetailViewProps {
    customer: Customer;
}

const CustomerDetailView = ({ customer }: CustomerDetailViewProps) => {
    const router = useRouter();

    return (
        <div className="space-y-6 p-6">
            {/* Back Button */}
            <div>
                <Button
                    variant="ghost"
                    className="gap-2 pl-0 hover:bg-transparent hover:text-primary"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Customers
                </Button>
            </div>

            <DetailHeader customer={customer} />

            <Tabs defaultValue="overview" className="w-full space-y-6">
                <TabsList className="w-full justify-start border-b border-border/40 bg-transparent p-0 rounded-none h-auto">
                    <TabsTrigger
                        value="overview"
                        className="rounded-t-lg border-b-2 border-transparent px-6 py-3 data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary"
                    >
                        Overview
                    </TabsTrigger>
                    <TabsTrigger
                        value="orders"
                        className="rounded-t-lg border-b-2 border-transparent px-6 py-3 data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary"
                    >
                        Orders & Bookings
                    </TabsTrigger>
                    <TabsTrigger
                        value="ledger"
                        className="rounded-t-lg border-b-2 border-transparent px-6 py-3 data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary"
                    >
                        Financial Ledger
                    </TabsTrigger>
                    <TabsTrigger
                        value="settings"
                        className="rounded-t-lg border-b-2 border-transparent px-6 py-3 data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary"
                    >
                        Settings
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 focus-visible:ring-0">
                    <OverviewTab customer={customer} />
                </TabsContent>
                <TabsContent value="orders" className="space-y-6 focus-visible:ring-0">
                    <OrdersTab customer={customer} />
                </TabsContent>
                <TabsContent value="ledger" className="space-y-6 focus-visible:ring-0">
                    <LedgerTab customer={customer} />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default CustomerDetailView;
