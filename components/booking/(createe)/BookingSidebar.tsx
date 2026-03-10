"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, Shield, Map, Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const BookingSidebar = () => {
  return (
    <div className="space-y-5">
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">
            Charges Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Base Fare: ₹220</p>
          <p>GST: ₹45</p>
          <p className="text-foreground font-semibold">Total: ₹265</p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Shield className="h-4 w-4 text-primary" /> Service Coverage
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>Available in 420+ cities across India.</p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Package className="h-4 w-4 text-success" /> Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button size="sm" className="w-full gap-2 rounded-lg">
            <Plus className="h-4 w-4" /> Add New Package Type
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingSidebar;
