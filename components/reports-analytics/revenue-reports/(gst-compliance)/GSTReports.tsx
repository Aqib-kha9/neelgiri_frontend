"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockGSTData } from "./mockData";
import { FileText, AlertCircle, CheckCircle2, DollarSign } from "lucide-react";

const GSTReports = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">GST Compliance</h1>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Last Filed</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-success" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Nov 2024</div>
                        <p className="text-xs text-muted-foreground">On time</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Next Due</CardTitle>
                        <AlertCircle className="h-4 w-4 text-warning" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">20 Dec</div>
                        <p className="text-xs text-muted-foreground">GSTR-3B</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Input Credit</CardTitle>
                        <DollarSign className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹45,000</div>
                        <p className="text-xs text-muted-foreground">Available currently</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tax Liability</CardTitle>
                        <FileText className="h-4 w-4 text-error" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹52,000</div>
                        <p className="text-xs text-muted-foreground">Estimated for Dec</p>
                    </CardContent>
                </Card>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Month</TableHead>
                            <TableHead>GSTR-1</TableHead>
                            <TableHead>GSTR-3B</TableHead>
                            <TableHead>Input Credit</TableHead>
                            <TableHead>Liability</TableHead>
                            <TableHead>Net Payable</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockGSTData.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.month}</TableCell>
                                <TableCell>
                                    <Badge variant={item.gstr1Status === 'Filed' ? 'success' : item.gstr1Status === 'Pending' ? 'warning' : 'destructive'}>
                                        {item.gstr1Status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={item.gstr3bStatus === 'Filed' ? 'success' : item.gstr3bStatus === 'Pending' ? 'warning' : 'destructive'}>
                                        {item.gstr3bStatus}
                                    </Badge>
                                </TableCell>
                                <TableCell>₹{item.inputCredit.toLocaleString()}</TableCell>
                                <TableCell>₹{item.taxLiability.toLocaleString()}</TableCell>
                                <TableCell className="font-bold">₹{item.netPayable.toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default GSTReports;
