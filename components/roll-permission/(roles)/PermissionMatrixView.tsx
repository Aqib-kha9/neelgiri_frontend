import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, X } from "lucide-react";
import { Permission, Role } from "./types";
import { PERMISSION_MODULES } from "@/lib/permission-structure"; // We will create this

interface PermissionMatrixViewProps {
    role: Role;
}

export const PermissionMatrixView = ({ role }: PermissionMatrixViewProps) => {
    // Parse role permissions: "resource.action" -> Map<resource, Set<action>>
    const permissionMap = new Map<string, Set<string>>();

    if (role.permissions) {
        role.permissions.forEach(p => {
            const [resource, action] = p.split('.');
            if (!permissionMap.has(resource)) {
                permissionMap.set(resource, new Set());
            }
            permissionMap.get(resource)?.add(action);
        });
    }

    const hasAccess = (resource: string, action: string) => {
        // Check specific permission or wildcards could be handled here
        const resourcePerms = permissionMap.get(resource);
        return resourcePerms?.has(action) || resourcePerms?.has('manage') || role.isSystem && role.name === 'super_admin';
    };

    return (
        <ScrollArea className="h-[500px] w-full p-4">
            <div className="space-y-8">
                {PERMISSION_MODULES.map((module) => {
                    // Filter resources: only show those that have AT LEAST ONE permission or if it's super admin
                    const relevantResources = module.resources.filter(res => {
                        if (role.isSystem && role.name === 'super_admin') return true;
                        // Check if ANY action exists for this resource
                        const resourcePerms = permissionMap.get(res.key);
                        return resourcePerms && resourcePerms.size > 0;
                    });

                    if (relevantResources.length === 0) return null;

                    return (
                        <div key={module.key} className="space-y-4">
                            <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 rounded-md">
                                    {module.label}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {relevantResources.map((res: any) => (
                                    <div key={res.key} className="flex items-center justify-between py-3 px-4 rounded-lg border border-border/40 bg-card/50 hover:bg-card transition-colors">
                                        <span className="text-sm font-medium text-foreground w-1/3 min-w-[150px]">{res.label}</span>

                                        <div className="flex items-center gap-2 flex-1 justify-end flex-wrap">
                                            {['create', 'read', 'update', 'delete'].map((action) => {
                                                const enabled = hasAccess(res.key, action);
                                                const label = action.charAt(0).toUpperCase() + action.slice(1);

                                                return (
                                                    <div
                                                        key={action}
                                                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border transition-all ${enabled
                                                            ? "bg-green-500/10 border-green-500/20 text-green-700 font-medium"
                                                            : "bg-muted/20 border-transparent text-muted-foreground/40 grayscale opacity-40 hidden md:flex"
                                                            }`}
                                                    >
                                                        {enabled && <Check className="h-3 w-3" />}
                                                        <span>{label}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {role.permissions.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground">
                        No specific permissions assigned to this role.
                    </div>
                )}
            </div>
        </ScrollArea>
    );
};
