"use client";

import { useState, useEffect } from "react";
import RolesHeader from "./RolesHeader";
import RolesStats from "./RolesStats";
import RolesList from "./RolesList";
import RoleForm from "./RoleForm";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Shield, X } from "lucide-react";
import { PermissionMatrixView } from "./PermissionMatrixView";
import { Role } from "./types";


const RolesManagement = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewRole, setViewRole] = useState<Role | null>(null);
  const [seeUsersRole, setSeeUsersRole] = useState<Role | null>(null);
  const [roleUsers, setRoleUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await fetch('/api/rbac/roles', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        const mapped: Role[] = data.map((r: any) => ({
          id: r._id,
          _id: r._id,
          name: r.name,
          displayName: r.displayName || r.name,
          description: r.description || '',
          userCount: r.userCount || 0,
          isSystem: r.isSystem,
          createdAt: r.createdAt || new Date().toISOString(),
          permissions: r.permissions ? r.permissions.map((p: any) => `${p.resource}.${p.action}`) : []
        }));
        setRoles(mapped);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to load roles");
    } finally {
      setLoading(false);
    }
  };

  const handleAddRole = () => {
    setSelectedRole(null);
    setShowForm(true);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setShowForm(true);
  };

  const handleSaveRole = async (formData: any) => {
    const isEdit = !!selectedRole;
    const url = isEdit ? `/api/rbac/roles/${selectedRole.id}` : '/api/rbac/roles';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success(`Role ${isEdit ? 'updated' : 'created'}`);
        setShowForm(false);
        fetchRoles();
      } else {
        const err = await res.json();
        toast.error(err.message || "Operation failed");
      }
    } catch (e) {
      console.error(e);
      toast.error("Network error");
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/rbac/roles/${roleId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.ok) {
        toast.success("Role deleted");
        fetchRoles();
      } else {
        toast.error("Failed to delete role");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSeeUsers = async (role: Role) => {
    setSeeUsersRole(role);
    try {
      const res = await fetch(`/api/rbac/roles/${role.id}/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRoleUsers(data);
      } else {
        toast.error("Failed to load users");
      }
    } catch (e) {
      console.error(e);
      toast.error("Network error");
    }
  };

  if (loading) return <div>Loading roles...</div>;

  return (
    <div className="space-y-6 p-6">
      <RolesHeader onAddRole={handleAddRole} roleCount={roles.length} />

      <RolesStats roles={roles} />

      <RolesList
        roles={roles}
        onEditRole={handleEditRole}
        onDeleteRole={handleDeleteRole}
        onViewRole={setViewRole}
        onSeeUsers={handleSeeUsers}
      />

      {showForm && (
        <RoleForm
          role={selectedRole}
          onSave={handleSaveRole}
          onCancel={() => {
            setShowForm(false);
            setSelectedRole(null);
          }}
        />
      )}

      {/* View Role Permissions Dialog */}
      {viewRole && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl max-h-[90vh] bg-card border border-border/70 rounded-2xl shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border/70">
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  {viewRole.name}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">{viewRole.description}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setViewRole(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-0 flex-1 overflow-hidden">
              <PermissionMatrixView role={viewRole} />
            </div>
            <div className="p-4 border-t border-border/70 bg-muted/20 flex justify-end">
              <Button onClick={() => setViewRole(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* See Users Dialog */}
      {seeUsersRole && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] bg-card border border-border/70 rounded-2xl shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border/70">
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Users with {seeUsersRole.name} Role
                </h2>
                <p className="text-sm text-muted-foreground mt-1">{roleUsers.length} users found</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSeeUsersRole(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto">
              {roleUsers.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  No users assigned to this role yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {roleUsers.map((user: any) => (
                    <div key={user._id} className="flex items-center justify-between p-4 rounded-lg border border-border/40 bg-card/50 hover:bg-card transition-colors">
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Status: <span className={user.status === 'active' ? 'text-green-600' : 'text-gray-600'}>{user.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-border/70 bg-muted/20 flex justify-end">
              <Button onClick={() => setSeeUsersRole(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesManagement;
