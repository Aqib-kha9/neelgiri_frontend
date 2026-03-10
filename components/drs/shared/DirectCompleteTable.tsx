import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Search, Scan, Package, Calendar, Clock, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DirectCompleteTableProps {
    onRefreshTrigger?: number; // Used to trigger refresh from parent
}

export const DirectCompleteTable = ({ onRefreshTrigger }: DirectCompleteTableProps) => {
    const [shipments, setShipments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchDirectCompleteShipments = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/shipments?status=complete", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            if (res.ok) {
                const data = await res.json();
                setShipments(data);
            }
        } catch (e) {
            console.error("Failed to fetch direct complete shipments", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDirectCompleteShipments();
    }, [onRefreshTrigger]);

    const filtered = shipments.filter(
        (s) =>
            s.awb.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.receiver?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    return (
        <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card overflow-hidden">
            <CardHeader className="border-b bg-muted/30 pb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                            <Package className="h-6 w-6 text-primary" />
                            Direct Complete Shipments
                        </CardTitle>
                        <CardDescription className="text-sm">
                            Shipments completed directly by the branch
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search AWB or Receiver..."
                                className="pl-10 h-10 rounded-xl bg-background border-border/60 focus:ring-primary/20"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 rounded-xl"
                            onClick={fetchDirectCompleteShipments}
                            disabled={loading}
                        >
                            <RotateCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow className="hover:bg-transparent border-b border-border/60">
                                <TableHead className="font-semibold py-4 px-6">AWB Number</TableHead>
                                <TableHead className="font-semibold py-4">Receiver</TableHead>
                                <TableHead className="font-semibold py-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-3.5 w-3.5" />
                                        Inward Date & Time
                                    </div>
                                </TableHead>
                                <TableHead className="font-semibold py-4">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-3.5 w-3.5" />
                                        Completion Date & Time
                                    </div>
                                </TableHead>
                                <TableHead className="font-semibold py-4">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center">
                                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                            <RotateCw className="h-5 w-5 animate-spin" />
                                            <span>Loading shipments...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-40 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                            <Package className="h-10 w-10 opacity-20" />
                                            <p>No completed shipments found</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((shipment) => (
                                    <TableRow key={shipment._id} className="group hover:bg-muted/30 transition-colors border-b border-border/40">
                                        <TableCell className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                    <Scan className="h-4 w-4 text-primary" />
                                                </div>
                                                <span className="font-mono font-bold text-foreground">
                                                    {shipment.awb}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div>
                                                <div className="text-sm font-medium text-foreground">
                                                    {shipment.receiver?.name || "-"}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {shipment.receiver?.phone || "-"}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 text-sm text-muted-foreground">
                                            {formatDate(shipment.createdAt)}
                                        </TableCell>
                                        <TableCell className="py-4 text-sm text-foreground font-medium">
                                            {shipment.deliveredAt ? formatDate(shipment.deliveredAt) : formatDate(shipment.updatedAt)}
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <Badge variant="success" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold">
                                                Direct Complete
                                            </Badge>
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
