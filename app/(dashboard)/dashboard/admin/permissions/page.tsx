"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PERMISSION_MODULES } from "@/lib/permission-structure";
import { Shield, Users, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Role {
  _id: string;
  name: string;
  displayName: string;
  permissions: string[];
  isSystem: boolean;
  userCount: number;
}

export default function PermissionsPage() {
  const { session } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewUsersRole, setViewUsersRole] = useState<Role | null>(null);
  const [roleUsers, setRoleUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await fetch("/api/rbac/roles", {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map((r: any) => ({
          ...r,
          permissions: r.permissions ? r.permissions.map((p: any) => `${p.resource}.${p.action}`) : []
        }));
        mapped.sort((a: Role, b: Role) => {
          if (a.name === 'super_admin') return -1;
          if (b.name === 'super_admin') return 1;
          if (a.isSystem && !b.isSystem) return -1;
          if (!a.isSystem && b.isSystem) return 1;
          return a.name.localeCompare(b.name);
        });
        setRoles(mapped);
      }
    } catch (error) {
      toast.error("Failed to load roles");
    } finally {
      setLoading(false);
    }
  };

  const handleViewUsers = async (role: Role) => {
    setViewUsersRole(role);
    setUsersLoading(true);
    try {
      const res = await fetch(`/api/rbac/roles/${role._id}/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) setRoleUsers(await res.json());
    } catch (e) {
      toast.error("Failed to load users");
    } finally {
      setUsersLoading(false);
    }
  };

  const hasPermission = (role: Role, resourceKey: string, action: string) => {
    if (role.name === 'super_admin') return true;
    const exact = `${resourceKey}.${action}`;
    return role.permissions.includes(exact) ||
      role.permissions.includes(`${resourceKey}.*`) ||
      role.permissions.includes(`${resourceKey}.manage`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Permission Matrix
          </h1>
          <p className="text-muted-foreground mt-1">
            View all roles and their access permissions across the system
          </p>
        </div>
      </div>

      {/* Roles Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {roles.map((role) => (
          <Card key={role._id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>{role.displayName || role.name}</span>
                <Badge variant={role.isSystem ? "secondary" : "outline"}>
                  {role.isSystem ? "System" : "Custom"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Users:</span>
                  <span className="font-semibold">{role.userCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Permissions:</span>
                  <span className="font-semibold">{role.permissions.length}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => handleViewUsers(role)}
                >
                  <Users className="h-4 w-4 mr-2" />
                  View Users
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Permissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Permissions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead className="w-[250px] font-bold">Module / Resource</TableHead>
                  {roles.map((role) => (
                    <TableHead key={role._id} className="text-center min-w-[120px]">
                      <div className="font-semibold">{role.displayName || role.name}</div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {PERMISSION_MODULES.map((module) => (
                  <React.Fragment key={module.key}>
                    {/* Module Header */}
                    <TableRow className="bg-muted/50">
                      <TableCell colSpan={roles.length + 1} className="font-bold text-primary">
                        {module.label}
                      </TableCell>
                    </TableRow>

                    {/* Resources */}
                    {module.resources.map((resource) => (
                      <TableRow key={resource.key} className="hover:bg-muted/30">
                        <TableCell className="font-medium pl-8">
                          {resource.label}
                        </TableCell>
                        {roles.map((role) => {
                          const canCreate = hasPermission(role, resource.key, 'create');
                          const canRead = hasPermission(role, resource.key, 'read');
                          const canUpdate = hasPermission(role, resource.key, 'update');
                          const canDelete = hasPermission(role, resource.key, 'delete');
                          const hasAny = canCreate || canRead || canUpdate || canDelete;

                          return (
                            <TableCell key={role._id} className="text-center">
                              {hasAny ? (
                                <div className="flex items-center justify-center gap-1">
                                  {canCreate && (
                                    <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs px-1.5 py-0">
                                      C
                                    </Badge>
                                  )}
                                  {canRead && (
                                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs px-1.5 py-0">
                                      R
                                    </Badge>
                                  )}
                                  {canUpdate && (
                                    <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-xs px-1.5 py-0">
                                      U
                                    </Badge>
                                  )}
                                  {canDelete && (
                                    <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-xs px-1.5 py-0">
                                      D
                                    </Badge>
                                  )}
                                </div>
                              ) : (
                                <XCircle className="h-4 w-4 text-muted-foreground/30 mx-auto" />
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Users Dialog */}
      <Dialog open={!!viewUsersRole} onOpenChange={(open) => !open && setViewUsersRole(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Users with {viewUsersRole?.displayName} Role
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[400px] pr-4">
            {usersLoading ? (
              <div className="text-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
              </div>
            ) : roleUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No users assigned to this role
              </div>
            ) : (
              <div className="space-y-2">
                {roleUsers.map((user: any) => (
                  <div key={user._id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                      {user.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
