"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PackagePlus, Send, ArrowRight, Truck } from "lucide-react";
import { toast } from "sonner";

export default function CreateManifestPage() {
    const [step, setStep] = useState(1);

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Create Manifest</h1>
                    <p className="text-muted-foreground">Bulk manifest creation for inter-branch forwarding.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="hover:border-primary cursor-pointer transition-all border-2" onClick={() => window.location.href = '/dashboard/manifest/counter'}>
                    <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                            <Send className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>Direct Forwarding</CardTitle>
                        <CardDescription>Send individual shipments directly to another branch.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="ghost" className="p-0 text-primary">Open Counter Manifest <ArrowRight className="ml-2 h-4 w-4" /></Button>
                    </CardContent>
                </Card>

                <Card className="hover:border-primary cursor-pointer transition-all border-2" onClick={() => window.location.href = '/dashboard/manifest/forwarding/bag'}>
                    <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-2">
                            <Truck className="h-6 w-6 text-orange-600" />
                        </div>
                        <CardTitle>Bag Manifest</CardTitle>
                        <CardDescription>Consolidate multiple shipments into bags before manifest.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="ghost" className="p-0 text-orange-600 hover:text-orange-700">Open Bag Management <ArrowRight className="ml-2 h-4 w-4" /></Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
