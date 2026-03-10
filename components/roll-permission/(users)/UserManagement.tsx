"use client";

import { useState, useEffect } from "react";
import UserHeader from "./UserHeader";
import UserStats from "./UserStats";
import UserFilters from "./UserFilters";
import UserList from "./UserList";
import UserForm from "./UserForm";
// import { User, CreateUserData } from "./types"; // We will redefine types or import adapted ones
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

// Define local types to match backend response/expectation
interface User {
  id: string; // Map _id to id in component or use _id
  _id?: string;
  name: string;
  email: string;
  role: string; // ID or Name? Backend "getUsers" populates role. So it's an object. 
  // We need to handle this.
  // The UserList component likely expects specific shape.
  // Let's adapt data.
  status: string;
  phone?: string;
  branchId?: string;
  branchName?: string;
  partnerName?: string;
  createdAt: string;
  roleName?: string; // Derived for display
  isPaused?: boolean;
}

interface CreateUserData {
  name: string;
  email: string;
  role: string; // Role ID
  branchId?: string;
  phone?: string;
  password?: string;
  status: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { session, refreshSession } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/rbac/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Transform backend data to frontend model
        // Backend Returns: { _id, name, email, role: { _id, name, displayName }, status, phone... }
        const mapped: User[] = data.map((u: any) => ({
          id: u._id,
          _id: u._id,
          name: u.name,
          email: u.email,
          role: u.role?._id || '', // Store ID for form
          roleName: u.role?.displayName || u.role?.name || 'Unknown', // For display
          status: u.status,
          phone: u.phone,
          branchId: u.branchId?._id || u.branchId, // Handle populated object or string ID
          branchName: u.branchId?.name || undefined, // Real Branch Name
          partnerName: u.parentPartner?.name || undefined, // New Partner Name
          createdAt: u.createdAt,
          isPaused: u.isPaused, // Map Pause Status
          createdBy: u.createdBy ? {
            name: u.createdBy.name,
            email: u.createdBy.email,
            role: u.createdBy.role
          } : undefined
        }));
        setUsers(mapped);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setShowForm(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleSaveUser = async (formData: any) => {
    const isEdit = !!selectedUser;
    const url = isEdit ? `/api/rbac/users/${selectedUser.id}` : '/api/rbac/users';

    // Note: Now fully supported by /api/rbac/users/:id PUT
    try {
      let body = {};

      // Clean up body (remove confirmPassword if present, etc)
      // If editing, send all fields including optional password
      // If creating, send all fields + default password if missing

      if (isEdit) {
        body = {
          name: formData.name,
          email: formData.email,
          role: formData.role, // ID or name
          branchId: formData.branchId,
          status: formData.status,
          phone: formData.phone,
          password: formData.password // Only send if user typed something
        };
      } else {
        body = { ...formData, password: formData.password || 'password123' };
      }

      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        toast.success(`User ${isEdit ? 'updated' : 'created'}`);
        setShowForm(false);
        await fetchUsers();

        // CRITICAL: If we just edited the currently logged-in user, refresh their session
        // so their permissions and role are updated immediately
        if (isEdit && session?.user?.id === selectedUser.id) {
          console.log('🔄 Refreshing session for edited user...');
          await refreshSession();
          toast.info('Your permissions have been updated. Please refresh if needed.');
        }
      } else {
        const err = await res.json();
        toast.error(err.message || 'Operation failed');
      }
    } catch (e) {
      console.error(e);
      toast.error("Network error");
    }
  };

  const handleTogglePause = async (userId: string) => {
    try {
      const res = await fetch(`/api/rbac/users/${userId}/toggle-pause`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(data.message);
        // Optimized: Update local state instead of full fetch
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, isPaused: data.isPaused } : u));
      } else {
        const err = await res.json();
        toast.error(err.message || 'Operation failed');
      }
    } catch (e) {
      console.error(e);
      toast.error("Network error");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

    try {
      const res = await fetch(`/api/rbac/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.ok) {
        toast.success("User deleted successfully");
        fetchUsers(); // Refresh the list
      } else {
        const err = await res.json();
        toast.error(err.message || 'Failed to delete user');
      }
    } catch (e) {
      console.error(e);
      toast.error("Network error while deleting user");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter; // This might need check against roleName or ID
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="space-y-6 p-6">
      <UserHeader onAddUser={handleAddUser} userCount={users.length} />

      <UserStats users={users} />

      <UserFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* We need to pass users with roleName aliased to role if UserList expects string role */}
      <UserList
        users={filteredUsers.map(u => ({ ...u, role: u.roleName || u.role }))}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        onTogglePause={handleTogglePause}
      />

      {showForm && (
        <UserForm
          user={selectedUser}
          onSave={handleSaveUser}
          onCancel={() => {
            setShowForm(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};

export default UserManagement;
