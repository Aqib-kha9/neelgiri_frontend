// ===================== QuickActionsPanel.tsx =====================
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, MapPin, BarChart3, Settings } from "lucide-react";
import Link from "next/link";

export function QuickActionsPanel() {
  return (
    <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        <Button asChild variant="outline" size="sm" className="justify-start">
          <Link href="/dashboard/booking/create">
            <Plus className="mr-2 h-4 w-4" /> Create Booking
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="justify-start">
          <Link href="/dashboard/orders">
            <Eye className="mr-2 h-4 w-4" /> View Orders
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="justify-start">
          <Link href="/dashboard/tracking">
            <MapPin className="mr-2 h-4 w-4" /> Track Order
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="justify-start">
          <Link href="/dashboard/reports">
            <BarChart3 className="mr-2 h-4 w-4" /> View Reports
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="justify-start">
          <Link href="/dashboard/admin/settings">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

