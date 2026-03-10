import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BusinessConfigData } from "./types";

interface BusinessSettingsProps {
  data: BusinessConfigData;
  onChange: (data: BusinessConfigData) => void;
}

const BusinessSettings = ({ data, onChange }: BusinessSettingsProps) => {
  const handleChange = (field: keyof BusinessConfigData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleBusinessHoursChange = (field: "start" | "end", value: string) => {
    onChange({
      ...data,
      businessHours: { ...data.businessHours, [field]: value },
    });
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Company Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type</Label>
              <Input
                id="businessType"
                value={data.businessType}
                onChange={(e) => handleChange("businessType", e.target.value)}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={data.industry}
                onChange={(e) => handleChange("industry", e.target.value)}
                className="rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID</Label>
              <Input
                id="taxId"
                value={data.taxId}
                onChange={(e) => handleChange("taxId", e.target.value)}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registrationNumber">Registration Number</Label>
              <Input
                id="registrationNumber"
                value={data.registrationNumber}
                onChange={(e) =>
                  handleChange("registrationNumber", e.target.value)
                }
                className="rounded-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Operational Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fiscalYearStart">Fiscal Year Start</Label>
              <Input
                id="fiscalYearStart"
                type="date"
                value={data.fiscalYearStart}
                onChange={(e) =>
                  handleChange("fiscalYearStart", e.target.value)
                }
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fiscalYearEnd">Fiscal Year End</Label>
              <Input
                id="fiscalYearEnd"
                type="date"
                value={data.fiscalYearEnd}
                onChange={(e) => handleChange("fiscalYearEnd", e.target.value)}
                className="rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessStart">Business Hours Start</Label>
              <Input
                id="businessStart"
                type="time"
                value={data.businessHours.start}
                onChange={(e) =>
                  handleBusinessHoursChange("start", e.target.value)
                }
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessEnd">Business Hours End</Label>
              <Input
                id="businessEnd"
                type="time"
                value={data.businessHours.end}
                onChange={(e) =>
                  handleBusinessHoursChange("end", e.target.value)
                }
                className="rounded-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Support Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={data.supportEmail}
                onChange={(e) => handleChange("supportEmail", e.target.value)}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportPhone">Support Phone</Label>
              <Input
                id="supportPhone"
                value={data.supportPhone}
                onChange={(e) => handleChange("supportPhone", e.target.value)}
                className="rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supportHours">Support Hours</Label>
            <Input
              id="supportHours"
              value={data.supportHours}
              onChange={(e) => handleChange("supportHours", e.target.value)}
              className="rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="holidayCalendar">
              Holiday Calendar (Comma separated dates)
            </Label>
            <Textarea
              id="holidayCalendar"
              value={data.holidayCalendar.join(", ")}
              onChange={(e) =>
                handleChange(
                  "holidayCalendar",
                  e.target.value.split(",").map((d) => d.trim())
                )
              }
              className="rounded-lg min-h-[80px]"
              placeholder="2024-01-26, 2024-08-15, 2024-10-02"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessSettings;
 