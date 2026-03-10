"use client";

import { useState, useEffect } from "react";
import { usePermissions } from "@/hooks/usePermissions";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Shield, Plus, Edit, Trash2 } from "lucide-react";
import { mockApi } from "@/mock-api/api";
import type { CustomRole, Resource, Action } from "@/types";

export default function RolesPage() {
  const { can } = usePermissions();
  const [roles, setRoles] = useState<CustomRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<CustomRole | null>(null);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    // TODO: Replace with real API
    // Mock data for now
    setRoles([
      {
        id: "role-1",
        name: "Custom Manager",
        description: "Custom role for branch managers",
        permissions: {} as Record<Resource, Action[]>,
        isSystem: false,
        createdAt: new Date().toISOString(),
        createdBy: "user-1",
      },
    ]);
    setLoading(false);
  };

  const handleCreateRole = () => {
    setEditingRole(null);
    setOpen(true);
  };

  const handleEditRole = (role: CustomRole) => {
    setEditingRole(role);
    setOpen(true);
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Roles</h1>
          <p className="text-muted-foreground">
            Manage roles and their permissions
          </p>
        </div>
        <PermissionGate action="create" resource="user">
          <Button onClick={handleCreateRole}>
            <Plus className="mr-2 h-4 w-4" />
            Create Role
          </Button>
        </PermissionGate>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* System Roles */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Super Admin
              </CardTitle>
              <Badge variant="secondary">System</Badge>
            </div>
            <CardDescription>Full system access</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              All permissions on all resources
            </p>
            <Button variant="outline" size="sm" className="w-full">
              View Permissions
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Partner Admin</CardTitle>
              <Badge variant="secondary">System</Badge>
            </div>
            <CardDescription>Partner management</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage partners, branches, and operations
            </p>
            <Button variant="outline" size="sm" className="w-full">
              View Permissions
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Branch Admin</CardTitle>
              <Badge variant="secondary">System</Badge>
            </div>
            <CardDescription>Branch operations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage branch orders and riders
            </p>
            <Button variant="outline" size="sm" className="w-full">
              View Permissions
            </Button>
          </CardContent>
        </Card>

        {/* Custom Roles */}
        {roles.map((role) => (
          <Card key={role.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{role.name}</CardTitle>
                <Badge variant="outline">Custom</Badge>
              </div>
              <CardDescription>{role.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditRole(role)}
                  className="flex-1"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {open && (
        <RoleDialog
          open={open}
          onOpenChange={setOpen}
          role={editingRole}
          onSuccess={loadRoles}
        />
      )}
    </div>
  );
}

function RoleDialog({
  open,
  onOpenChange,
  role,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: CustomRole | null;
  onSuccess: () => void;
}) {
  const [name, setName] = useState(role?.name || "");
  const [description, setDescription] = useState(role?.description || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Replace with real API
    console.log("Creating/updating role:", { name, description });
    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{role ? "Edit Role" : "Create Role"}</DialogTitle>
          <DialogDescription>
            {role
              ? "Update role details and permissions"
              : "Create a new custom role with specific permissions"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Role Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Permissions</Label>
            <p className="text-sm text-muted-foreground">
              TODO: Add permission matrix UI here
            </p>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">
                Permission selection interface will be implemented here
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{role ? "Update" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

