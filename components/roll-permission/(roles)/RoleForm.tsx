import { useState, useEffect } from "react";
import { X, Shield, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Role } from "./types";
import { PERMISSION_MODULES } from "@/lib/permission-structure";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RoleFormProps {
  role: Role | null;
  onSave: (
    data: Omit<Role, "id" | "createdAt" | "userCount" | "isSystem">
  ) => void;
  onCancel: () => void;
}

const RoleForm = ({ role, onSave, onCancel }: RoleFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    description: "",
    permissions: [] as string[],
  });

  const [activeTab, setActiveTab] = useState(PERMISSION_MODULES[0].key);

  useEffect(() => {
    const mandatory = ['dashboard_main.create', 'dashboard_main.read', 'dashboard_main.update', 'dashboard_main.delete'];

    if (role) {
      // Ensure existing roles also get the mandatory permissions if missing
      const existing = role.permissions || [];
      const combined = Array.from(new Set([...existing, ...mandatory]));

      setFormData({
        name: role.name,
        displayName: role.displayName || role.name,
        description: role.description || "",
        permissions: combined,
      });
    } else {
      // New role defaults
      setFormData(prev => ({
        ...prev,
        permissions: mandatory
      }));
    }
  }, [role]);

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const togglePermission = (resourceKey: string, action: string) => {
    // Prevent disabling mandatory dashboard permissions
    if (resourceKey === 'dashboard_main') return;

    const permString = `${resourceKey}.${action}`;
    setFormData((prev) => {
      const exists = prev.permissions.includes(permString);
      let newPermissions = [...prev.permissions];

      if (exists) {
        // Toggling OFF
        newPermissions = newPermissions.filter((p) => p !== permString);

        // If turning off READ, must turn off EVERYTHING else for this resource
        if (action === 'read') {
          newPermissions = newPermissions.filter(p => !p.startsWith(`${resourceKey}.`));
        }
      } else {
        // Toggling ON
        newPermissions.push(permString);

        // If turning on CREATE/UPDATE/DELETE, must ensure READ is on
        if (action !== 'read') {
          const readPerm = `${resourceKey}.read`;
          if (!newPermissions.includes(readPerm)) {
            newPermissions.push(readPerm);
          }
        }
      }
      return { ...prev, permissions: newPermissions };
    });
  };

  const toggleResourceAll = (resourceKey: string, checked: boolean) => {
    const actions = ['create', 'read', 'update', 'delete'];
    const newPerms = actions.map(a => `${resourceKey}.${a}`);

    setFormData(prev => {
      let filtered = prev.permissions.filter(p => !p.startsWith(`${resourceKey}.`));
      if (checked) {
        return { ...prev, permissions: [...filtered, ...newPerms] };
      } else {
        return { ...prev, permissions: filtered };
      }
    });
  };

  const isResourceFullySelected = (resourceKey: string) => {
    const actions = ['create', 'read', 'update', 'delete'];
    return actions.every(a => formData.permissions.includes(`${resourceKey}.${a}`));
  };

  const hasAnyResourcePermission = (resourceKey: string) => {
    return formData.permissions.some(p => p.startsWith(`${resourceKey}.`));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl border-border/70 shadow-2xl">
        <CardHeader className="flex-none flex flex-row items-center justify-between border-b border-border/70 py-4">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {role ? "Edit Role & Permissions" : "Create New Role"}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="rounded-full h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Sidebar / Form Basics */}
          <div className="w-full md:w-1/3 border-r border-border/40 bg-muted/10 p-6 space-y-6 overflow-y-auto">
            <div className="space-y-4">
              <div>
                <Label htmlFor="displayName">Role Name</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => {
                    const disp = e.target.value;
                    // Auto-generate internal name: lowercase, replace spaces with underscores, remove special chars
                    const slug = disp.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '_');
                    setFormData(prev => ({
                      ...prev,
                      displayName: disp,
                      name: slug
                    }));
                  }}
                  required
                  placeholder="e.g. Operations Manager"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  System ID: <span className="font-mono bg-muted px-1 rounded">{formData.name || '...'}</span>
                </p>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  required
                  placeholder="What is this role for?"
                  className="mt-1 min-h-[100px]"
                />
              </div>
            </div>

            <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-4 text-sm text-blue-800">
              <p className="font-semibold mb-1">Note on Users</p>
              <p>This form creates a <strong>Role Definition</strong> (rules). To give a person access, go to the <strong>User Management</strong> page and assign this role to them.</p>
            </div>
          </div>

          {/* Matrix Area */}
          <div className="flex-1 flex flex-col min-h-0 bg-background">
            <div className="p-4 border-b border-border/40 bg-muted/5">
              <h3 className="font-semibold text-sm">Access Control Matrix</h3>
              <p className="text-xs text-muted-foreground">Select detailed permissions for each module.</p>
            </div>

            <div className="flex-1 overflow-hidden flex">
              <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="flex-1 flex flex-col md:flex-row">
                <ScrollArea className="w-full md:w-48 border-r border-border/40 bg-muted/20">
                  <TabsList className="flex flex-col h-full w-full justify-start rounded-none bg-transparent p-0">
                    {PERMISSION_MODULES.map((module) => {
                      const isActive = activeTab === module.key;
                      return (
                        <TabsTrigger
                          key={module.key}
                          value={module.key}
                          className={`w-full justify-start px-4 py-3 rounded-none border-l-2 transition-all ${isActive
                            ? "border-primary bg-background font-medium text-primary shadow-sm"
                            : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                            }`}
                        >
                          {module.label}
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                </ScrollArea>

                <div className="flex-1 overflow-y-auto bg-card">
                  {PERMISSION_MODULES.map((module) => (
                    <TabsContent key={module.key} value={module.key} className="m-0 p-6 space-y-6 animate-in fade-in-50 duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold tracking-tight">{module.label} Permissions</h4>
                      </div>

                      <div className="grid gap-4">
                        {module.resources.map(res => (
                          <div key={res.key} className="rounded-lg border border-border/60 p-4 hover:border-primary/20 transition-colors bg-card/50">
                            <div className="flex items-center justify-between mb-3 border-b border-border/40 pb-2">
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id={`all-${res.key}`}
                                  checked={isResourceFullySelected(res.key)}
                                  // Prevent unchecking for mandatory resource
                                  onCheckedChange={(c) => res.key !== 'dashboard_main' && toggleResourceAll(res.key, c as boolean)}
                                  disabled={res.key === 'dashboard_main'}
                                />
                                <Label htmlFor={`all-${res.key}`} className="font-medium cursor-pointer text-base">
                                  {res.label}
                                </Label>
                              </div>
                              <span className="text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                                key: {res.key}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {['read', 'create', 'update', 'delete'].map(action => { // Reordered: Read first
                                const isChecked = formData.permissions.includes(`${res.key}.${action}`);
                                const isRead = action === 'read';
                                const hasRead = formData.permissions.includes(`${res.key}.read`);
                                const isMandatory = res.key === 'dashboard_main';
                                const isDisabled = (!isRead && !hasRead) || isMandatory;

                                return (
                                  <div
                                    key={action}
                                    className={`flex items-center gap-2 p-2 rounded-md border text-sm transition-all cursor-pointer ${isDisabled
                                      ? 'opacity-50 cursor-not-allowed bg-muted'
                                      : isChecked
                                        ? 'bg-primary/5 border-primary/30 text-primary font-medium'
                                        : 'bg-transparent border-border/40 text-muted-foreground hover:bg-muted/30'
                                      }`}
                                    onClick={() => !isDisabled && togglePermission(res.key, action)}
                                  >
                                    <div className={`h-4 w-4 rounded-full border flex items-center justify-center transition-colors ${isChecked ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/30'
                                      }`}>
                                      {isChecked && <CheckCircle2 className="h-3 w-3" />}
                                    </div>
                                    <span className="capitalize">{action}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </div>
              </Tabs>
            </div>
          </div>
        </div>

        <div className="flex-none p-4 border-t border-border/70 bg-muted/20 flex justify-end gap-3 rounded-b-2xl">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!formData.name} className="min-w-[120px]">
            {role ? "Update Role" : "Create Role"}
          </Button>
        </div>

      </Card>
    </div>
  );
};

export default RoleForm;
