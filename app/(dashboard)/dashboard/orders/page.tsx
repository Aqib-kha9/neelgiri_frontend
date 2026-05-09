"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Package,
    Search,
    MapPin,
    Calendar,
    RefreshCcw,
    Loader2,
    ArrowRight,
    Truck,
    CheckCircle2,
    Clock,
    XCircle,
    InboxIcon,
} from "lucide-react";
import Link from "next/link";

interface Shipment {
    _id: string;
    awb: string;
    status: string;
    sender: { name: string; address: string; city: string; pincode: string };
    receiver: { name: string; address: string; city: string; pincode: string };
    weight: number;
    mode: string;
    paymentMode: string;
    totalAmount: number;
    createdAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
    not_scheduled: { label: "Booked", color: "bg-blue-50 text-blue-700 border-blue-200", icon: Clock },
    scheduled:     { label: "Scheduled", color: "bg-purple-50 text-purple-700 border-purple-200", icon: Truck },
    in_progress:   { label: "In Transit", color: "bg-amber-50 text-amber-700 border-amber-200", icon: Truck },
    complete:      { label: "Delivered", color: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle2 },
    delivered:     { label: "Delivered", color: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle2 },
    cancelled:     { label: "Cancelled", color: "bg-red-50 text-red-700 border-red-200", icon: XCircle },
};

export default function OrdersPage() {
    const { session } = useAuth();
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [error, setError] = useState<string | null>(null);

    const fetchShipments = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const params = search ? `?awb=${search}` : "";
            const res = await fetch(`/api/shipments${params}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch orders");
            const data = await res.json();
            setShipments(data);
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session) fetchShipments();
    }, [session]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchShipments();
    };

    const filtered = shipments.filter(s =>
        !search ||
        s.awb?.toLowerCase().includes(search.toLowerCase()) ||
        s.receiver?.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">All Orders</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        View and track all your shipments
                    </p>
                </div>
                <Button variant="outline" size="sm" onClick={fetchShipments} disabled={loading}>
                    <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        className="pl-9"
                        placeholder="Search by AWB or Receiver name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button type="submit" variant="outline">Search</Button>
            </form>

            {/* Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p className="text-sm">Loading your orders...</p>
                </div>
            ) : error ? (
                <Card className="border-destructive/30 bg-destructive/5">
                    <CardContent className="py-10 text-center text-destructive text-sm">
                        {error}
                    </CardContent>
                </Card>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                        <InboxIcon className="h-8 w-8" />
                    </div>
                    <div className="text-center">
                        <p className="font-medium text-foreground">No orders found</p>
                        <p className="text-sm mt-1">Your bookings will appear here once created</p>
                    </div>
                    <Button asChild size="sm">
                        <Link href="/dashboard/create-booking">Create First Booking</Link>
                    </Button>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((shipment) => {
                        const statusInfo = STATUS_CONFIG[shipment.status] || {
                            label: shipment.status,
                            color: "bg-muted text-muted-foreground border-border",
                            icon: Package,
                        };
                        const StatusIcon = statusInfo.icon;

                        return (
                            <Card key={shipment._id} className="hover:border-primary/30 transition-colors">
                                <CardHeader className="px-5 py-4 pb-0">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center shrink-0">
                                                <Package className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="font-mono font-semibold text-sm tracking-wide">
                                                    {shipment.awb}
                                                </p>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(shipment.createdAt).toLocaleDateString("en-IN", {
                                                        day: "numeric", month: "short", year: "numeric"
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${statusInfo.color}`}>
                                            <StatusIcon className="h-3 w-3" />
                                            {statusInfo.label}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="px-5 py-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-muted-foreground mb-0.5">From</p>
                                            <p className="font-medium truncate">{shipment.sender?.name || "—"}</p>
                                            <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                                                <MapPin className="h-3 w-3 shrink-0" />
                                                {shipment.sender?.city || shipment.sender?.pincode || "—"}
                                            </p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-muted-foreground mb-0.5">To</p>
                                            <p className="font-medium truncate">{shipment.receiver?.name || "—"}</p>
                                            <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                                                <MapPin className="h-3 w-3 shrink-0" />
                                                {shipment.receiver?.city || shipment.receiver?.pincode || "—"}
                                            </p>
                                        </div>
                                        <div className="hidden sm:block text-right shrink-0">
                                            <p className="text-xs text-muted-foreground mb-0.5">Weight</p>
                                            <p className="font-medium">{shipment.weight ? `${shipment.weight} kg` : "—"}</p>
                                            <p className="text-xs text-muted-foreground capitalize">
                                                {shipment.paymentMode || "—"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-4 pt-3 border-t">
                                        {shipment.totalAmount ? (
                                            <p className="text-sm font-semibold">₹{shipment.totalAmount.toFixed(2)}</p>
                                        ) : (
                                            <span />
                                        )}
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/dashboard/tracking?awb=${shipment.awb}`}>
                                                Track Shipment
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
