import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { NotificationConfigData } from "./types";

interface NotificationSettingsProps {
  data: NotificationConfigData;
  onChange: (data: NotificationConfigData) => void;
}

const NotificationSettings = ({
  data,
  onChange,
}: NotificationSettingsProps) => {
  const handleChange = (field: keyof NotificationConfigData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Notification Channels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <Label
                  htmlFor="emailNotifications"
                  className="text-sm font-medium"
                >
                  Email Notifications
                </Label>
                <p className="text-xs text-muted-foreground">
                  Send notifications via email
                </p>
              </div>
              <Switch
                id="emailNotifications"
                checked={data.emailNotifications}
                onCheckedChange={(checked) =>
                  handleChange("emailNotifications", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <Label
                  htmlFor="smsNotifications"
                  className="text-sm font-medium"
                >
                  SMS Notifications
                </Label>
                <p className="text-xs text-muted-foreground">
                  Send notifications via SMS
                </p>
              </div>
              <Switch
                id="smsNotifications"
                checked={data.smsNotifications}
                onCheckedChange={(checked) =>
                  handleChange("smsNotifications", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <Label
                  htmlFor="pushNotifications"
                  className="text-sm font-medium"
                >
                  Push Notifications
                </Label>
                <p className="text-xs text-muted-foreground">
                  Send push notifications to mobile app
                </p>
              </div>
              <Switch
                id="pushNotifications"
                checked={data.pushNotifications}
                onCheckedChange={(checked) =>
                  handleChange("pushNotifications", checked)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Alert Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="customerAlerts" className="text-sm font-medium">
                  Customer Alerts
                </Label>
                <Switch
                  id="customerAlerts"
                  checked={data.customerAlerts}
                  onCheckedChange={(checked) =>
                    handleChange("customerAlerts", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="riderAlerts" className="text-sm font-medium">
                  Rider Alerts
                </Label>
                <Switch
                  id="riderAlerts"
                  checked={data.riderAlerts}
                  onCheckedChange={(checked) =>
                    handleChange("riderAlerts", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="adminAlerts" className="text-sm font-medium">
                  Admin Alerts
                </Label>
                <Switch
                  id="adminAlerts"
                  checked={data.adminAlerts}
                  onCheckedChange={(checked) =>
                    handleChange("adminAlerts", checked)
                  }
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="lowStockAlerts" className="text-sm font-medium">
                  Low Stock Alerts
                </Label>
                <Switch
                  id="lowStockAlerts"
                  checked={data.lowStockAlerts}
                  onCheckedChange={(checked) =>
                    handleChange("lowStockAlerts", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="delayAlerts" className="text-sm font-medium">
                  Delay Alerts
                </Label>
                <Switch
                  id="delayAlerts"
                  checked={data.delayAlerts}
                  onCheckedChange={(checked) =>
                    handleChange("delayAlerts", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="paymentAlerts" className="text-sm font-medium">
                  Payment Alerts
                </Label>
                <Switch
                  id="paymentAlerts"
                  checked={data.paymentAlerts}
                  onCheckedChange={(checked) =>
                    handleChange("paymentAlerts", checked)
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div>
              <Label htmlFor="systemAlerts" className="text-sm font-medium">
                System Alerts
              </Label>
              <p className="text-xs text-muted-foreground">
                Critical system notifications
              </p>
            </div>
            <Switch
              id="systemAlerts"
              checked={data.systemAlerts}
              onCheckedChange={(checked) =>
                handleChange("systemAlerts", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Alert Contacts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="alertEmail">Alert Email Address</Label>
              <Input
                id="alertEmail"
                type="email"
                value={data.alertEmail}
                onChange={(e) => handleChange("alertEmail", e.target.value)}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alertPhone">Alert Phone Number</Label>
              <Input
                id="alertPhone"
                value={data.alertPhone}
                onChange={(e) => handleChange("alertPhone", e.target.value)}
                className="rounded-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;
