"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockBIInsights } from "./mockData";
import { Lightbulb, TrendingUp, AlertTriangle, Target } from "lucide-react";

const BIReports = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Business Intelligence</h1>
            <p className="text-muted-foreground">AI-driven insights and strategic recommendations.</p>

            <div className="grid gap-6 md:grid-cols-2">
                {mockBIInsights.map(item => (
                    <Card key={item.id} className="relative overflow-hidden">
                        <div className={`absolute top-0 left-0 w-1 h-full ${item.impact === 'High' ? 'bg-error' : item.impact === 'Medium' ? 'bg-warning' : 'bg-primary'
                            }`} />
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    {item.category === 'Growth' ? <TrendingUp className="h-5 w-5 text-success" /> :
                                        item.category === 'Efficiency' ? <Target className="h-5 w-5 text-primary" /> :
                                            item.category === 'Risk' ? <AlertTriangle className="h-5 w-5 text-error" /> :
                                                <Lightbulb className="h-5 w-5 text-warning" />}
                                    <CardTitle className="text-lg">{item.category} Insight</CardTitle>
                                </div>
                                <Badge variant={item.impact === 'High' ? 'destructive' : 'secondary'}>{item.impact} Impact</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="font-medium text-lg mb-2">{item.insight}</p>
                            <div className="bg-muted p-3 rounded-lg mt-4">
                                <p className="text-sm text-foreground font-semibold mb-1">Recommendation:</p>
                                <p className="text-sm text-muted-foreground">{item.recommendation}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default BIReports;
