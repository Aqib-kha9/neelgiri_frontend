import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, RefreshCw } from "lucide-react";
import { drsTemplates } from "./data/mockData";

interface QuickActionsProps {
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
}

const QuickActions = ({
  selectedTemplate,
  onTemplateChange,
}: QuickActionsProps) => {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">DRS Templates</p>
            <p className="text-xs text-muted-foreground">
              Apply pre-configured DRS templates
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Select value={selectedTemplate} onValueChange={onTemplateChange}>
              <SelectTrigger className="w-full sm:w-60 rounded-xl">
                <SelectValue placeholder="Select DRS Template" />
              </SelectTrigger>
              <SelectContent>
                {drsTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name} ({template.shipmentCount} shipments)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70"
            >
              <Upload className="h-4 w-4" />
              Bulk Upload
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70"
            >
              <RefreshCw className="h-4 w-4" />
              Auto Assign
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
