"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, CheckCircle2, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function RiderPODPage() {
  const [awbNumber, setAwbNumber] = useState("");
  const [podType, setPodType] = useState("signature");

  const handleCapturePOD = () => {
    // TODO: Replace with real API
    console.log("Capturing POD:", { awbNumber, podType });
    alert("POD captured successfully! (Mock)");
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">POD Capture</h1>
        <p className="text-muted-foreground">
          Capture proof of delivery for completed shipments
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Capture POD
            </CardTitle>
            <CardDescription>Enter AWB and capture proof</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="awb">AWB Number *</Label>
                <Input
                  id="awb"
                  value={awbNumber}
                  onChange={(e) => setAwbNumber(e.target.value)}
                  placeholder="Enter or scan AWB"
                />
              </div>
              <div className="space-y-2">
                <Label>POD Type *</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={podType === "signature" ? "default" : "outline"}
                    onClick={() => setPodType("signature")}
                  >
                    Signature
                  </Button>
                  <Button
                    type="button"
                    variant={podType === "photo" ? "default" : "outline"}
                    onClick={() => setPodType("photo")}
                  >
                    Photo
                  </Button>
                </div>
              </div>
              <Button
                onClick={handleCapturePOD}
                className="w-full"
                disabled={!awbNumber}
              >
                <Camera className="mr-2 h-4 w-4" />
                Capture POD
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Recent PODs
            </CardTitle>
            <CardDescription>Last 5 captured PODs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">ORD-2024-001</p>
                  <p className="text-sm text-muted-foreground">2 mins ago</p>
                </div>
                <Badge variant="outline">Signature</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">ORD-2024-002</p>
                  <p className="text-sm text-muted-foreground">15 mins ago</p>
                </div>
                <Badge variant="outline">Photo</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

