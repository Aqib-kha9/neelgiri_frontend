import { QrCode } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AWBGeneration = () => {
  return (
    <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <QrCode className="h-5 w-5 text-primary" />
          AWB Generation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-2xl bg-muted/40 p-6 text-center">
          <div className="text-2xl font-bold text-muted-foreground font-mono">
            HJDXXXXXX
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            AWB number will be generated automatically upon booking confirmation
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
