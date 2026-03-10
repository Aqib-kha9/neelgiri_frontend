"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockRevenue } from "./mockData";
import { DollarSign, Wallet, CreditCard, TrendingUp } from "lucide-react";

const RevenueReports = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Revenue Reports</h1>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹15.4L</div>
                        <p className="text-xs text-muted-foreground">Current Month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">COD Collected</CardTitle>
                        <Wallet className="h-4 w-4 text-success" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹8.0L</div>
                        <p className="text-xs text-muted-foreground">Cash handling</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Online Payments</CardTitle>
                        <CreditCard className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹7.4L</div>
                        <p className="text-xs text-muted-foreground">Digital transfers</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">MoM Growth</CardTitle>
                        <TrendingUp className="h-4 w-4 text-warning" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+12.5%</div>
                        <p className="text-xs text-muted-foreground">vs November</p>
                    </CardContent>
                </Card>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Period</TableHead>
                            <TableHead>Total Revenue</TableHead>
                            <TableHead>COD Collected</TableHead>
                            <TableHead>Online Payments</TableHead>
                            <TableHead>Pending COD</TableHead>
                            <TableHead>Growth %</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockRevenue.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.period}</TableCell>
                                <TableCell>₹{item.totalRevenue.toLocaleString()}</TableCell>
                                <TableCell>₹{item.codCollected.toLocaleString()}</TableCell>
                                <TableCell>₹{item.onlinePayments.toLocaleString()}</TableCell>
                                <TableCell className="text-error">₹{item.pendingcod.toLocaleString()}</TableCell>
                                <TableCell className="text-success">+{item.growth}%</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default RevenueReports;
