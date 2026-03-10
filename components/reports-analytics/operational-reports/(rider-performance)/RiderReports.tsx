"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockRiderMetrics } from "./mockData";
import { Bike, Navigation, Award, AlertTriangle } from "lucide-react";

const RiderReports = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Rider Performance Reports</h1>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
                        <Navigation className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,530 km</div>
                        <p className="text-xs text-muted-foreground">Fleet total this week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <Bike className="h-4 w-4 text-success" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">405</div>
                        <p className="text-xs text-muted-foreground">Delivered successfully</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Incentives Paid</CardTitle>
                        <Award className="h-4 w-4 text-warning" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹4,300</div>
                        <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Complaints</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-error" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">Pending resolution</p>
                    </CardContent>
                </Card>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Rider Name</TableHead>
                            <TableHead>Distance</TableHead>
                            <TableHead>Orders</TableHead>
                            <TableHead>Complaints</TableHead>
                            <TableHead>Fuel Allow.</TableHead>
                            <TableHead>Incentives</TableHead>
                            <TableHead>Score</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockRiderMetrics.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.riderName}</TableCell>
                                <TableCell>{item.totalDistance}</TableCell>
                                <TableCell>{item.ordersCompleted}</TableCell>
                                <TableCell className={item.customerComplaints > 0 ? "text-error font-medium" : "text-muted-foreground"}>
                                    {item.customerComplaints}
                                </TableCell>
                                <TableCell>₹{item.fuelAllowance}</TableCell>
                                <TableCell>₹{item.incentivesEarned}</TableCell>
                                <TableCell>
                                    <Badge variant={item.overallScore >= 95 ? 'success' : 'secondary'}>
                                        {item.overallScore}
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

export default RiderReports;
