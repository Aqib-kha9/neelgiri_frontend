import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DeliveryNotesProps {
  selectedPOD: any;
}

const DeliveryNotes = ({ selectedPOD }: DeliveryNotesProps) => {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-5 w-5 text-primary" />
          Delivery Notes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/30 rounded-xl p-4">
          <p className="text-sm text-foreground">{selectedPOD.capture.notes}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryNotes;
