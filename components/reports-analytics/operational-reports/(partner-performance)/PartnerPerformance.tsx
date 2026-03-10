"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockPartnerMetrics } from "./mockData";
import { Users, TrendingUp, Clock, Star } from "lucide-react";

const PartnerPerformance = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Partner Performance</h1>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Partners</CardTitle>
                        <Users className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">+2 this month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Success Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-success" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">94%</div>
                        <p className="text-xs text-muted-foreground">Across all zones</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Pickup Time</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">18m</div>
                        <p className="text-xs text-muted-foreground">Target: 20m</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
                        <Star className="h-4 w-4 text-warning" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4.6</div>
                        <p className="text-xs text-muted-foreground">Upper quartile</p>
                    </CardContent>
                </Card>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Partner Name</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Total Orders</TableHead>
                            <TableHead>Success Rate</TableHead>
                            <TableHead>Avg Pickup</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockPartnerMetrics.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.partnerName}</TableCell>
                                <TableCell>{item.location}</TableCell>
                                <TableCell>{item.totalOrders}</TableCell>
                                <TableCell>
                                    <span className={item.deliverySuccessRate < 90 ? "text-error" : "text-success"}>
                                        {item.deliverySuccessRate}%
                                    </span>
                                </TableCell>
                                <TableCell>{item.avgPickupTime}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1">
                                        <Star className="h-3 w-3 fill-warning text-warning" />
                                        {item.rating}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={item.status === 'active' ? 'success' : 'secondary'}>
                                        {item.status}
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

export default PartnerPerformance;
