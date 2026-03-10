"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { mockCustomers } from "@/components/master/(customers)/mockData";
import { Customer } from "@/components/master/(customers)/types";
import CustomerDetailView from "@/components/master/(customers)/details/CustomerDetailView";

export default function CustomerDetailPage({
    params,
}: {
    params: Promise<{ customerId: string }>;
}) {
    // Unwrap params using React.use()
    const resolvedParams = use(params);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API fetch
        const foundCustomer = mockCustomers.find(
            (c) => c.id === resolvedParams.customerId
        );
        setCustomer(foundCustomer || null);
        setLoading(false);
    }, [resolvedParams.customerId]);

    if (loading) {
        return <div className="p-6">Loading customer details...</div>;
    }

    if (!customer) {
        notFound();
    }

    return <CustomerDetailView customer={customer} />;
}
