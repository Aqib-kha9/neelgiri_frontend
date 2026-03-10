"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockRCA } from "./mockData";
import { TrendingUp, TrendingDown, Minus, ArrowUpRight, AlertCircle, PieChart, BarChart } from "lucide-react";

// Mock data for charts
const distributionData = [
    { name: "Address Issue", value: 35, color: "bg-blue-500" },
    { name: "Recipient Unavailable", value: 25, color: "bg-orange-500" },
    { name: "Rider Delay", value: 20, color: "bg-yellow-500" },
    { name: "Vehicle Issue", value: 10, color: "bg-red-500" },
    { name: "Other", value: 10, color: "bg-slate-500" },
];

const RootCauseAnalysis = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Root Cause Analysis</h1>
                    <p className="text-sm text-muted-foreground">Deep dive into delivery failure reasons and impact analysis.</p>
                </div>
                <div className="flex gap-2">
                    <Select defaultValue="this-month">
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="this-week">This Week</SelectItem>
                            <SelectItem value="this-month">This Month</SelectItem>
                            <SelectItem value="last-quarter">Last Quarter</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline">Download Report</Button>
                </div>
            </div>

            {/* Top Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="bg-gradient-to-br from-red-50 to-white dark:from-red-950/20 dark:to-background border-red-100 dark:border-red-900/20">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-red-600 dark:text-red-400 font-medium">Top Failure Reason</CardDescription>
                        <CardTitle className="text-2xl">Invalid Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <ArrowUpRight className="h-4 w-4 text-red-500" />
                            <span className="font-medium text-foreground">32%</span> of all failures
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Incidents</CardDescription>
                        <CardTitle className="text-2xl">1,248</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-sm text-green-600">
                            <TrendingDown className="h-4 w-4" />
                            <span>-5% vs last month</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Resolution Time</CardDescription>
                        <CardTitle className="text-2xl">4.2 hrs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-sm text-yellow-600">
                            <TrendingUp className="h-4 w-4" />
                            <span>+12m vs average</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Recurring Issues</CardDescription>
                        <CardTitle className="text-2xl">15%</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">Customers with &gt;2 failures</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Visual Chart - Distribution */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Failure Distribution (Pareto)</CardTitle>
                        <CardDescription>Primary contributors to delivery exceptions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] w-full flex items-end gap-6 p-4 border rounded-xl bg-muted/10">
                            {distributionData.map((item) => (
                                <div key={item.name} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div className="relative w-full flex justify-center">
                                        <div
                                            className={`w-full max-w-[60px] rounded-t-lg transition-all duration-300 group-hover:opacity-80 ${item.color}`}
                                            style={{ height: `${item.value * 5}px` }}
                                        />
                                        <div className="absolute -top-8 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                            {item.value}% Impact
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium text-center text-muted-foreground line-clamp-1">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Impact By Zone */}
                <Card>
                    <CardHeader>
                        <CardTitle>Impact by Zone</CardTitle>
                        <CardDescription>High failure rate areas</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { zone: "North Delhi", val: 85, color: "bg-red-500" },
                            { zone: "Gurgaon Sec 29", val: 65, color: "bg-orange-500" },
                            { zone: "Noida Sec 62", val: 45, color: "bg-yellow-500" },
                            { zone: "West Pitampura", val: 30, color: "bg-blue-500" },
                        ].map((z, i) => (
                            <div key={i} className="space-y-1">
                                <div className="flex justify-between text-sm font-medium">
                                    <span>{z.zone}</span>
                                    <span>{z.val} incidents</span>
                                </div>
                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                    <div className={`h-full ${z.color}`} style={{ width: `${z.val}%` }} />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Table */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Detailed Causalty Report</CardTitle>
                        <CardDescription>Deep dive into specific failure categories.</CardDescription>
                    </div>
                    <Tabs defaultValue="all" className="w-[400px]">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="process">Process</TabsTrigger>
                            <TabsTrigger value="tech">Tech</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Category</TableHead>
                                <TableHead>Specific Issue</TableHead>
                                <TableHead className="text-right">Frequency</TableHead>
                                <TableHead className="text-center">Impact Level</TableHead>
                                <TableHead className="text-center">Trend</TableHead>
                                <TableHead className="text-right">Action Plan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockRCA.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.category}</TableCell>
                                    <TableCell>{item.issue}</TableCell>
                                    <TableCell className="text-right font-mono">{item.frequency}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={item.impact === 'High' ? 'destructive' : 'secondary'} className="w-20 justify-center">
                                            {item.impact}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center flex justify-center py-4">
                                        {item.trend === 'up' ? <TrendingUp className="text-red-500 h-4 w-4" /> :
                                            item.trend === 'down' ? <TrendingDown className="text-green-500 h-4 w-4" /> :
                                                <Minus className="text-muted-foreground h-4 w-4" />}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="link" size="sm" className="h-auto p-0 text-primary">View Plan</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default RootCauseAnalysis;
