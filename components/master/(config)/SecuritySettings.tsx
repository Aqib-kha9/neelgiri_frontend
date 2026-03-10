import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { SecurityConfigData } from "./types";

interface SecuritySettingsProps {
  data: SecurityConfigData;
  onChange: (data: SecurityConfigData) => void;
}

const SecuritySettings = ({ data, onChange }: SecuritySettingsProps) => {
  const handleChange = (field: keyof SecurityConfigData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handlePasswordPolicyChange = (
    field: keyof SecurityConfigData["passwordPolicy"],
    value: any
  ) => {
    onChange({
      ...data,
      passwordPolicy: { ...data.passwordPolicy, [field]: value },
    });
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Password Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minLength">Minimum Password Length</Label>
              <Input
                id="minLength"
                type="number"
                min="6"
                max="20"
                value={data.passwordPolicy.minLength}
                onChange={(e) =>
                  handlePasswordPolicyChange(
                    "minLength",
                    parseInt(e.target.value)
                  )
                }
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDays">Password Expiry (Days)</Label>
              <Input
                id="expiryDays"
                type="number"
                min="0"
                max="365"
                value={data.passwordPolicy.expiryDays}
                onChange={(e) =>
                  handlePasswordPolicyChange(
                    "expiryDays",
                    parseInt(e.target.value)
                  )
                }
                className="rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <Label
                  htmlFor="requireUppercase"
                  className="text-sm font-medium"
                >
                  Require Uppercase
                </Label>
                <p className="text-xs text-muted-foreground">
                  At least one uppercase letter
                </p>
              </div>
              <Switch
                id="requireUppercase"
                checked={data.passwordPolicy.requireUppercase}
                onCheckedChange={(checked) =>
                  handlePasswordPolicyChange("requireUppercase", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <Label
                  htmlFor="requireLowercase"
                  className="text-sm font-medium"
                >
                  Require Lowercase
                </Label>
                <p className="text-xs text-muted-foreground">
                  At least one lowercase letter
                </p>
              </div>
              <Switch
                id="requireLowercase"
                checked={data.passwordPolicy.requireLowercase}
                onCheckedChange={(checked) =>
                  handlePasswordPolicyChange("requireLowercase", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <Label htmlFor="requireNumbers" className="text-sm font-medium">
                  Require Numbers
                </Label>
                <p className="text-xs text-muted-foreground">
                  At least one number
                </p>
              </div>
              <Switch
                id="requireNumbers"
                checked={data.passwordPolicy.requireNumbers}
                onCheckedChange={(checked) =>
                  handlePasswordPolicyChange("requireNumbers", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <Label
                  htmlFor="requireSpecialChars"
                  className="text-sm font-medium"
                >
                  Require Special Characters
                </Label>
                <p className="text-xs text-muted-foreground">
                  At least one special character
                </p>
              </div>
              <Switch
                id="requireSpecialChars"
                checked={data.passwordPolicy.requireSpecialChars}
                onCheckedChange={(checked) =>
                  handlePasswordPolicyChange("requireSpecialChars", checked)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Authentication & Access</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <Label htmlFor="twoFactorAuth" className="text-sm font-medium">
                  Two-Factor Authentication
                </Label>
                <p className="text-xs text-muted-foreground">
                  Require 2FA for all users
                </p>
              </div>
              <Switch
                id="twoFactorAuth"
                checked={data.twoFactorAuth}
                onCheckedChange={(checked) =>
                  handleChange("twoFactorAuth", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <Label htmlFor="dataEncryption" className="text-sm font-medium">
                  Data Encryption
                </Label>
                <p className="text-xs text-muted-foreground">
                  Encrypt sensitive data at rest
                </p>
              </div>
              <Switch
                id="dataEncryption"
                checked={data.dataEncryption}
                onCheckedChange={(checked) =>
                  handleChange("dataEncryption", checked)
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (Minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                min="5"
                max="480"
                value={data.sessionTimeout}
                onChange={(e) =>
                  handleChange("sessionTimeout", parseInt(e.target.value))
                }
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                min="1"
                max="10"
                value={data.maxLoginAttempts}
                onChange={(e) =>
                  handleChange("maxLoginAttempts", parseInt(e.target.value))
                }
                className="rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="auditLogRetention">
              Audit Log Retention (Days)
            </Label>
            <Input
              id="auditLogRetention"
              type="number"
              min="30"
              max="1095"
              value={data.auditLogRetention}
              onChange={(e) =>
                handleChange("auditLogRetention", parseInt(e.target.value))
              }
              className="rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiRateLimit">
              API Rate Limit (Requests/Minute)
            </Label>
            <Input
              id="apiRateLimit"
              type="number"
              min="10"
              max="10000"
              value={data.apiRateLimit}
              onChange={(e) =>
                handleChange("apiRateLimit", parseInt(e.target.value))
              }
              className="rounded-lg"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">IP Whitelist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ipWhitelist">Allowed IP Addresses</Label>
            <Textarea
              id="ipWhitelist"
              value={data.ipWhitelist.join(", ")}
              onChange={(e) =>
                handleChange(
                  "ipWhitelist",
                  e.target.value.split(",").map((ip) => ip.trim())
                )
              }
              className="rounded-lg min-h-[80px]"
              placeholder="192.168.1.1, 10.0.0.1, 172.16.0.1"
            />
            <p className="text-xs text-muted-foreground">
              Enter comma-separated IP addresses that are allowed to access the
              system
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;
