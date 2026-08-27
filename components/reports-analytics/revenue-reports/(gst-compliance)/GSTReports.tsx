"use client";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, AlertCircle, CheckCircle2, DollarSign, Loader2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

interface GstSummary {
    totalTaxableValue: number;
    totalTaxAmount: number;
    totalInvoiceValue: number;
    totalShipments: number;
    cgst: number;
    sgst: number;
    igst: number;
}

interface GstMonthlyBreakdown {
    month: string;
    taxableValue: number;
    taxAmount: number;
    invoiceValue: number;
    shipments: number;
    cgst: number;
    sgst: number;
    igst: number;
}

const GSTReports = () => {
    const [summary, setSummary] = useState<GstSummary | null>(null);
    const [monthly, setMonthly] = useState<GstMonthlyBreakdown[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${API_BASE}/api/reports/gst`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSummary(data.summary || null);
            setMonthly(Array.isArray(data.monthlyBreakdown) ? data.monthlyBreakdown : []);
        } catch (error) {
            console.error("Failed to load GST report", error);
            toast.error("Failed to load GST compliance data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const formatCurrency = (val: number) => {
        if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
        if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
        if (val >= 1000) return `₹${(val / 1000).toFixed(1)}k`;
        return `₹${(val || 0).toLocaleString()}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">GST Compliance</h1>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Taxable Value</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-success" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(summary?.totalTaxableValue || 0)}</div>
                        <p className="text-xs text-muted-foreground">{summary?.totalShipments || 0} shipments</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Tax Amount</CardTitle>
                        <AlertCircle className="h-4 w-4 text-warning" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(summary?.totalTaxAmount || 0)}</div>
                        <p className="text-xs text-muted-foreground">CGST + SGST + IGST</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Input Credit (IGST)</CardTitle>
                        <DollarSign className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(summary?.igst || 0)}</div>
                        <p className="text-xs text-muted-foreground">Available currently</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Invoice Value</CardTitle>
                        <FileText className="h-4 w-4 text-error" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(summary?.totalInvoiceValue || 0)}</div>
                        <p className="text-xs text-muted-foreground">Gross billing</p>
                    </CardContent>
                </Card>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Month</TableHead>
                            <TableHead>Taxable Value</TableHead>
                            <TableHead>CGST</TableHead>
                            <TableHead>SGST</TableHead>
                            <TableHead>IGST</TableHead>
                            <TableHead>Total Tax</TableHead>
                            <TableHead>Invoice Value</TableHead>
                            <TableHead>Shipments</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {monthly.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                                    No GST data available
                                </TableCell>
                            </TableRow>
                        ) : (
                            monthly.map((item, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="font-medium">{item.month || "—"}</TableCell>
                                    <TableCell>₹{(item.taxableValue || 0).toLocaleString()}</TableCell>
                                    <TableCell>₹{(item.cgst || 0).toLocaleString()}</TableCell>
                                    <TableCell>₹{(item.sgst || 0).toLocaleString()}</TableCell>
                                    <TableCell>₹{(item.igst || 0).toLocaleString()}</TableCell>
                                    <TableCell className="font-bold">₹{(item.taxAmount || 0).toLocaleString()}</TableCell>
                                    <TableCell>₹{(item.invoiceValue || 0).toLocaleString()}</TableCell>
                                    <TableCell>{item.shipments || 0}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default GSTReports;
