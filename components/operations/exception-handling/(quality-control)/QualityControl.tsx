"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { mockQuality } from "./mockData";
import {
    CheckCircle,
    XCircle,
    AlertTriangle,
    ShieldCheck,
    FileText,
    UserCheck,
    Thermometer,
    Award,
    History
} from "lucide-react";

const QualityControl = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Quality Assurance & Control</h1>
                    <p className="text-sm text-muted-foreground">Monitor compliance, audit scores, and operational standards.</p>
                </div>
                <Button className="gap-2">
                    <History className="h-4 w-4" /> View Audit Logs
                </Button>
            </div>

            {/* Top Scorecard */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-success shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Overall Safety Score</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-success" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">98.5%</div>
                        <p className="text-xs text-muted-foreground mt-1">Excellent (Top 5% in industry)</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-warning shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">SOP Adherence</CardTitle>
                        <FileText className="h-4 w-4 text-warning" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">92.0%</div>
                        <p className="text-xs text-muted-foreground mt-1">Requires improvement in 'Returns'</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-primary shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Docs Validation</CardTitle>
                        <UserCheck className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">100%</div>
                        <p className="text-xs text-muted-foreground mt-1">All rider licenses valid</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500 shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Customer Feedback</CardTitle>
                        <Award className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">4.8/5</div>
                        <p className="text-xs text-muted-foreground mt-1">Based on 1.2k reviews</p>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Metric Cards */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Key Performance Indicators (KPIs)</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {mockQuality.map(item => (
                        <Card key={item.id} className="relative overflow-hidden group hover:border-primary/50 transition-colors">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <CardTitle className="text-base font-medium">{item.metric}</CardTitle>
                                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                                            Last checked: {item.lastChecked}
                                        </div>
                                    </div>
                                    {item.status === 'pass' ? <CheckCircle className="text-success h-5 w-5" /> :
                                        item.status === 'fail' ? <XCircle className="text-error h-5 w-5" /> :
                                            <AlertTriangle className="text-warning h-5 w-5" />}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-foreground">{item.score}% Current</span>
                                        <span className="text-muted-foreground">Target: {item.target}%</span>
                                    </div>
                                    <Progress value={item.score} className={item.score >= item.target ? "bg-success/20 [&>*]:bg-success" : "bg-warning/20 [&>*]:bg-warning"} />
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t">
                                    <Badge variant={item.status === 'pass' ? 'outline' : item.status === 'fail' ? 'destructive' : 'secondary'} className={item.status === 'pass' ? 'border-success text-success' : ''}>
                                        {item.status.toUpperCase()}
                                    </Badge>
                                    <Button variant="ghost" size="sm" className="h-7 text-xs">Details</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Bottom Section: Recent Audits & Alerts */}
            <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Recent Audit Findings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { title: "Temperature Control Breach", loc: "Zone A - Van 4", risk: "Medium", time: "2h ago" },
                                { title: "Unmarked Vehicle", loc: "Zone B - Login Check", risk: "Low", time: "5h ago" },
                                { title: "Missing PPE Gear", loc: "Hub 12 - Morning Shift", risk: "High", time: "Yesterday" }
                            ].map((audit, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
                                    <div className="flex items-start gap-3">
                                        <div className={`mt-1 h-2 w-2 rounded-full ${audit.risk === 'High' ? 'bg-error' : audit.risk === 'Medium' ? 'bg-warning' : 'bg-blue-500'}`} />
                                        <div>
                                            <p className="font-medium text-sm">{audit.title}</p>
                                            <p className="text-xs text-muted-foreground">{audit.loc}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant="outline" className="mb-1">{audit.risk} Risk</Badge>
                                        <p className="text-[10px] text-muted-foreground">{audit.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                        <CardTitle className="text-primary flex items-center gap-2">
                            <Thermometer className="h-5 w-5" />
                            Cold Chain Status
                        </CardTitle>
                        <CardDescription>Live monitoring of refrigerated units</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-6">
                            <div className="text-4xl font-bold text-foreground">3.4°C</div>
                            <p className="text-sm text-green-600 font-medium mt-2 flex items-center justify-center gap-1">
                                <CheckCircle className="h-3 w-3" /> Optimal Range
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Min: 2.1°C</span>
                                <span>Max: 4.5°C</span>
                            </div>
                            <Progress value={60} className="h-2" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default QualityControl;
