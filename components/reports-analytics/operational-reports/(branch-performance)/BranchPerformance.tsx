"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockBranchMetrics } from "./mockData";
import { DollarSign, BarChart, Users, TrendingUp } from "lucide-react";

const BranchPerformance = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Branch Performance</h1>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Daily Orders</CardTitle>
                        <BarChart className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">550</div>
                        <p className="text-xs text-muted-foreground">Across all branches</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-success" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹1,60,000</div>
                        <p className="text-xs text-muted-foreground">Daily average</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Efficiency</CardTitle>
                        <TrendingUp className="h-4 w-4 text-warning" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">90%</div>
                        <p className="text-xs text-muted-foreground">+2% vs last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">45</div>
                        <p className="text-xs text-muted-foreground">Active Employees</p>
                    </CardContent>
                </Card>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Branch Name</TableHead>
                            <TableHead>Daily Orders</TableHead>
                            <TableHead>Revenue</TableHead>
                            <TableHead>Expenses</TableHead>
                            <TableHead>Efficiency</TableHead>
                            <TableHead>Staff</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockBranchMetrics.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.branchName}</TableCell>
                                <TableCell>{item.dailyOrders}</TableCell>
                                <TableCell>₹{item.revenue.toLocaleString()}</TableCell>
                                <TableCell>₹{item.expenses.toLocaleString()}</TableCell>
                                <TableCell>{item.efficiency}%</TableCell>
                                <TableCell>{item.staffCount}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default BranchPerformance;
