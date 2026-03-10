import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FinancialConfigData } from "./types";

interface FinancialSettingsProps {
  data: FinancialConfigData;
  onChange: (data: FinancialConfigData) => void;
}

const FinancialSettings = ({ data, onChange }: FinancialSettingsProps) => {
  const handleChange = (field: keyof FinancialConfigData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Currency & Tax Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Select
                value={data.currency}
                onValueChange={(value) => handleChange("currency", value)}
              >
                <SelectTrigger className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                  <SelectItem value="USD">US Dollar ($)</SelectItem>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                  <SelectItem value="GBP">British Pound (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={data.taxRate}
                onChange={(e) =>
                  handleChange("taxRate", parseFloat(e.target.value))
                }
                className="rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <Label htmlFor="gstEnabled" className="text-sm font-medium">
                  GST Enabled
                </Label>
                <p className="text-xs text-muted-foreground">
                  Enable GST tax calculation
                </p>
              </div>
              <Switch
                id="gstEnabled"
                checked={data.gstEnabled}
                onCheckedChange={(checked) =>
                  handleChange("gstEnabled", checked)
                }
              />
            </div>
          </div>

          {data.gstEnabled && (
            <div className="space-y-2">
              <Label htmlFor="gstNumber">GST Number</Label>
              <Input
                id="gstNumber"
                value={data.gstNumber}
                onChange={(e) => handleChange("gstNumber", e.target.value)}
                className="rounded-lg"
                placeholder="GSTIN123456789"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Invoice Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
              <Input
                id="invoicePrefix"
                value={data.invoicePrefix}
                onChange={(e) => handleChange("invoicePrefix", e.target.value)}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoiceStartingNumber">
                Starting Invoice Number
              </Label>
              <Input
                id="invoiceStartingNumber"
                type="number"
                min="1"
                value={data.invoiceStartingNumber}
                onChange={(e) =>
                  handleChange(
                    "invoiceStartingNumber",
                    parseInt(e.target.value)
                  )
                }
                className="rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentTerms">Payment Terms</Label>
            <Select
              value={data.paymentTerms}
              onValueChange={(value) => handleChange("paymentTerms", value)}
            >
              <SelectTrigger className="rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Net 15">Net 15</SelectItem>
                <SelectItem value="Net 30">Net 30</SelectItem>
                <SelectItem value="Net 45">Net 45</SelectItem>
                <SelectItem value="Due on receipt">Due on receipt</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lateFeePercentage">Late Fee Percentage (%)</Label>
            <Input
              id="lateFeePercentage"
              type="number"
              min="0"
              max="50"
              step="0.1"
              value={data.lateFeePercentage}
              onChange={(e) =>
                handleChange("lateFeePercentage", parseFloat(e.target.value))
              }
              className="rounded-lg"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Credit & Automation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="creditLimit">Default Credit Limit (₹)</Label>
            <Input
              id="creditLimit"
              type="number"
              min="0"
              step="1000"
              value={data.creditLimit}
              onChange={(e) =>
                handleChange("creditLimit", parseInt(e.target.value))
              }
              className="rounded-lg"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <Label
                  htmlFor="autoInvoiceGeneration"
                  className="text-sm font-medium"
                >
                  Auto Invoice Generation
                </Label>
                <p className="text-xs text-muted-foreground">
                  Automatically generate invoices
                </p>
              </div>
              <Switch
                id="autoInvoiceGeneration"
                checked={data.autoInvoiceGeneration}
                onCheckedChange={(checked) =>
                  handleChange("autoInvoiceGeneration", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <Label
                  htmlFor="revenueRecognition"
                  className="text-sm font-medium"
                >
                  Revenue Recognition
                </Label>
                <p className="text-xs text-muted-foreground">
                  Enable revenue recognition rules
                </p>
              </div>
              <Switch
                id="revenueRecognition"
                checked={data.revenueRecognition}
                onCheckedChange={(checked) =>
                  handleChange("revenueRecognition", checked)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialSettings;
