import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";
import { BookingTemplate } from "./types";
import { bookingTemplates } from "./config";

interface TemplateSelectorProps {
  isOpen: boolean;
  selectedTemplate: string | null;
  onTemplateSelect: (templateId: string) => void;
  onClose: () => void;
}

export const TemplateSelector = ({
  isOpen,
  selectedTemplate,
  onTemplateSelect,
  onClose,
}: TemplateSelectorProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl rounded-2xl border-border/70 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Select Booking Template
          </CardTitle>
          <CardDescription>
            Choose a template to quickly start your bulk shipment process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookingTemplates.map((template: BookingTemplate) => {
              const IconComponent = template.icon;
              return (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all hover:shadow-md border-2 ${
                    selectedTemplate === template.id
                      ? "border-primary"
                      : "border-border/70"
                  } rounded-xl`}
                  onClick={() => onTemplateSelect(template.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`rounded-lg p-2 ${template.color}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="space-y-2">
                        <p className="font-semibold text-foreground">
                          {template.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {template.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Service: {template.defaultService}</span>
                          <span>•</span>
                          <span>Payment: {template.defaultPayment}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="flex gap-3 mt-6 pt-4 border-t border-border/70">
            <Button
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 rounded-xl bg-primary text-primary-foreground"
              disabled={!selectedTemplate}
              onClick={() =>
                selectedTemplate && onTemplateSelect(selectedTemplate)
              }
            >
              Continue with Template
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
