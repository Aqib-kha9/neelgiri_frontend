import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LogisticsConfigData } from "./types";

interface LogisticsSettingsProps {
  data: LogisticsConfigData;
  onChange: (data: LogisticsConfigData) => void;
}

const LogisticsSettings = ({ data, onChange }: LogisticsSettingsProps) => {
  const handleChange = (field: keyof LogisticsConfigData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Delivery Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="defaultWeightUnit">Weight Unit</Label>
              <Select
                value={data.defaultWeightUnit}
                onValueChange={(value) =>
                  handleChange("defaultWeightUnit", value)
                }
              >
                <SelectTrigger className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilograms (kg)</SelectItem>
                  <SelectItem value="g">Grams (g)</SelectItem>
                  <SelectItem value="lb">Pounds (lb)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultDistanceUnit">Distance Unit</Label>
              <Select
                value={data.defaultDistanceUnit}
                onValueChange={(value) =>
                  handleChange("defaultDistanceUnit", value)
                }
              >
                <SelectTrigger className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="km">Kilometers (km)</SelectItem>
                  <SelectItem value="m">Meters (m)</SelectItem>
                  <SelectItem value="mi">Miles (mi)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultDeliveryTime">Default Delivery Time</Label>
              <Input
                id="defaultDeliveryTime"
                value={data.defaultDeliveryTime}
                onChange={(e) =>
                  handleChange("defaultDeliveryTime", e.target.value)
                }
                className="rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxDeliveryAttempts">Max Delivery Attempts</Label>
            <Input
              id="maxDeliveryAttempts"
              type="number"
              min="1"
              max="10"
              value={data.maxDeliveryAttempts}
              onChange={(e) =>
                handleChange("maxDeliveryAttempts", parseInt(e.target.value))
              }
              className="rounded-lg"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <Label
                  htmlFor="autoRouteOptimization"
                  className="text-sm font-medium"
                >
                  Auto Route Optimization
                </Label>
                <p className="text-xs text-muted-foreground">
                  Automatically optimize delivery routes
                </p>
              </div>
              <Switch
                id="autoRouteOptimization"
                checked={data.autoRouteOptimization}
                onCheckedChange={(checked) =>
                  handleChange("autoRouteOptimization", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <Label
                  htmlFor="temperatureControl"
                  className="text-sm font-medium"
                >
                  Temperature Control
                </Label>
                <p className="text-xs text-muted-foreground">
                  Enable temperature monitoring
                </p>
              </div>
              <Switch
                id="temperatureControl"
                checked={data.temperatureControl}
                onCheckedChange={(checked) =>
                  handleChange("temperatureControl", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <Label
                  htmlFor="signatureRequired"
                  className="text-sm font-medium"
                >
                  Signature Required
                </Label>
                <p className="text-xs text-muted-foreground">
                  Require recipient signature
                </p>
              </div>
              <Switch
                id="signatureRequired"
                checked={data.signatureRequired}
                onCheckedChange={(checked) =>
                  handleChange("signatureRequired", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <Label
                  htmlFor="photoProofRequired"
                  className="text-sm font-medium"
                >
                  Photo Proof Required
                </Label>
                <p className="text-xs text-muted-foreground">
                  Require delivery photo proof
                </p>
              </div>
              <Switch
                id="photoProofRequired"
                checked={data.photoProofRequired}
                onCheckedChange={(checked) =>
                  handleChange("photoProofRequired", checked)
                }
              />
            </div>
          </div>

          {data.temperatureControl && (
            <div className="space-y-2">
              <Label htmlFor="defaultTemperature">
                Default Temperature (°C)
              </Label>
              <Input
                id="defaultTemperature"
                type="number"
                value={data.defaultTemperature}
                onChange={(e) =>
                  handleChange("defaultTemperature", parseInt(e.target.value))
                }
                className="rounded-lg"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Policies & Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="returnPolicy">Return Policy</Label>
            <Textarea
              id="returnPolicy"
              value={data.returnPolicy}
              onChange={(e) => handleChange("returnPolicy", e.target.value)}
              className="rounded-lg min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="packagingRules">Packaging Rules</Label>
            <Textarea
              id="packagingRules"
              value={data.packagingRules}
              onChange={(e) => handleChange("packagingRules", e.target.value)}
              className="rounded-lg min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hazardousHandling">
              Hazardous Material Handling
            </Label>
            <Textarea
              id="hazardousHandling"
              value={data.hazardousHandling}
              onChange={(e) =>
                handleChange("hazardousHandling", e.target.value)
              }
              className="rounded-lg min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogisticsSettings;
