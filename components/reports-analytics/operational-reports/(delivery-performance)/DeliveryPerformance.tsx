"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockDeliveryMetrics } from "./mockData";
import { BarChart3, TrendingUp, Clock, AlertTriangle } from "lucide-react";

const DeliveryPerformance = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Delivery Performance</h1>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Delivered</CardTitle>
                        <BarChart3 className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4,500</div>
                        <p className="text-xs text-muted-foreground">+12% this week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">SLA Breach</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-warning" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">140</div>
                        <p className="text-xs text-muted-foreground">3.1% of orders</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Time</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">29m</div>
                        <p className="text-xs text-muted-foreground">-2m from last week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-success" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">94.2%</div>
                        <p className="text-xs text-muted-foreground">Target: 95%</p>
                    </CardContent>
                </Card>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Zone</TableHead>
                            <TableHead>Total Orders</TableHead>
                            <TableHead>Delivered</TableHead>
                            <TableHead>Failed</TableHead>
                            <TableHead>SLA Breach</TableHead>
                            <TableHead>Avg Time</TableHead>
                            <TableHead>Score</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockDeliveryMetrics.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.zone}</TableCell>
                                <TableCell>{item.totalOrders}</TableCell>
                                <TableCell>{item.delivered}</TableCell>
                                <TableCell className="text-error">{item.failed}</TableCell>
                                <TableCell className="text-warning">{item.slaBreached}</TableCell>
                                <TableCell>{item.avgTime}</TableCell>
                                <TableCell>
                                    <Badge variant={item.performanceScore >= 95 ? 'success' : item.performanceScore >= 90 ? 'warning' : 'destructive'}>
                                        {item.performanceScore}%
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default DeliveryPerformance;
