import { Zap, Search, Wallet, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const QuickActions = () => {
  return (
    <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Zap className="h-5 w-5 text-primary" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 rounded-xl"
        >
          <Search className="h-4 w-4" />
          Find Customer
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start gap-2 rounded-xl"
        >
          <Wallet className="h-4 w-4" />
          Check Credit Limit
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start gap-2 rounded-xl"
        >
          <FileText className="h-4 w-4" />
          Download Template
        </Button>
      </CardContent>
    </Card>
  );
};
