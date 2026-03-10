"use client";

import { useState, useEffect } from "react";
import {
  X,
  User,
  Building,
  Mail,
  Phone,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Check,
  ChevronsUpDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { User as UserType, CreateUserData, UserRole } from "./types";
import { CreateBranchDialog } from "./CreateBranchDialog";

interface UserFormProps {
  user: UserType | null;
  onSave: (data: CreateUserData) => void;
  onCancel: () => void;
}

const UserForm = ({ user, onSave, onCancel }: UserFormProps) => {
  const { session } = useAuth();
  const currentUserRole = session?.user?.role || "";
  const currentUserName = session?.user?.name || "Admin";

  const [formData, setFormData] = useState<CreateUserData>({
    email: "",
    name: "",
    role: "",
    branchId: "",
    password: "",
    phone: "",
    status: "active"
  });

  const [showBranchSelect, setShowBranchSelect] = useState(false);
  const [openBranchCombobox, setOpenBranchCombobox] = useState(false);
  const [roles, setRoles] = useState<Array<{ id: string; name: string; displayName: string }>>([]);
  const [branches, setBranches] = useState<Array<{ _id: string; name: string; code: string }>>([]);
  const [loadingBranches, setLoadingBranches] = useState(false);

  const [showBranchDialog, setShowBranchDialog] = useState(false);

  // New Context State
  const [contextInfo, setContextInfo] = useState({ partnerName: '', branchName: '', branchAdminName: '' });

  // Fetch Roles, Branches & Context
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // 0. Fetch Context (My Profile)
        const meRes = await fetch('/api/auth/me', { headers });
        if (meRes.ok) {
          const meData = await meRes.json();
          setContextInfo({
            partnerName: meData.partnerName || 'N/A',
            branchName: meData.branchName || '',
            branchAdminName: meData.branchAdminName || ''
          });
        }

        // 1. Fetch Roles
        const roleRes = await fetch('/api/rbac/roles', { headers });
        if (roleRes.ok) {
          const allRoles = await roleRes.json();
          let filteredRoles = allRoles.map((r: any) => ({
            id: r._id,
            name: r.name,
            displayName: r.displayName
          })).filter((r: any) => r.name !== 'customer');

          // HIERARCHY FILTERING
          // Logic: Creator can only see roles strictly BELOW them.
          if (currentUserRole === 'partner_admin' || currentUserRole === 'partner') {
            // Partner can create: Branch Admin, Dispatcher, Rider AND Custom Roles
            // Allow anything that is NOT Super Admin, Partner Admin/Partner, or Customer
            filteredRoles = filteredRoles.filter((r: any) =>
              !['super_admin', 'partner_admin', 'partner', 'customer'].includes(r.name)
            );
          } else if (currentUserRole === 'branch_admin' || currentUserRole === 'branch') {
            // Branch Admin can create: Dispatcher, Rider
            // Exclude: Branch Admin, Partner, Super Admin, Customer
            filteredRoles = filteredRoles.filter((r: any) =>
              ['dispatcher', 'rider'].includes(r.name)
            );
          } else if (currentUserRole === 'dispatcher') {
            // Dispatcher can create: Rider
            filteredRoles = filteredRoles.filter((r: any) =>
              ['rider'].includes(r.name)
            );
          }

          setRoles(filteredRoles);
        }

        // 2. Fetch Branches (if relevant)
        if (['super_admin', 'partner_admin', 'partner'].includes(currentUserRole)) {
          setLoadingBranches(true);
          const branchRes = await fetch('/api/branches', { headers });
          if (branchRes.ok) {
            const branchData = await branchRes.json();
            setBranches(branchData);
          }
          setLoadingBranches(false);
        }
      } catch (e) {
        console.error('Failed to load form data:', e);
        toast.error("Failed to load dependency data");
      }
    };
    fetchData();
  }, [currentUserRole]);

  // Pre-fill form when editing existing user
  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || "",
        name: user.name || "",
        role: user.role || "",
        branchId: user.branchId || "",
        password: "", // Never pre-fill password
        phone: user.phone || "",
        status: user.status || "active"
      });

      // Check if branch select should be shown for this role
      if (user.role) {
        checkBranchRequirement(user.role);
      }
    }
  }, [user]);

  // ... (handleEditMode useEffect) ...

  const checkBranchRequirement = (roleName: string) => {
    // Roles that need explicitly assigned branch (if creator has choice)
    // Custom roles should NOT seek branch if we want Partner-Level scope (Global)
    const standardBranchRoles = ["branch_admin", "branch", "dispatcher", "rider"];

    // Only show branch select for these specific standard roles. 
    // Custom roles will default to FALSE (No branch), giving them Partner Scope.
    const needsBranch = standardBranchRoles.includes(roleName);

    // If I am Branch Admin, I can't select branch (it's forced to mine), so hide UI?
    // OR show UI disabled?
    // Let's hide if forced.
    if (['branch_admin', 'branch', 'dispatcher'].includes(currentUserRole)) {
      setShowBranchSelect(false); // Forced in backend
    } else {
      setShowBranchSelect(needsBranch);
    }
  };

  const handleRoleChange = (roleName: string) => {
    setFormData((prev) => {
      // CRITICAL FIX: When editing existing user, preserve their branchId
      // Only clear branchId when creating NEW user or if role doesn't need branch
      const shouldPreserveBranch = !!user && prev.branchId;

      return {
        ...prev,
        role: roleName,
        branchId: shouldPreserveBranch ? prev.branchId : ""
      };
    });
    checkBranchRequirement(roleName);
  };

  const handleInputChange = (field: keyof CreateUserData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (showBranchSelect && !formData.branchId) {
      // Check if branches loaded
      if (branches.length === 0) {
        toast.error("No branches available to assign. Create a branch first.");
        return;
      }
      toast.error("Please select a branch for this role");
      return;
    }

    onSave(formData);
  };

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, password }));
  };

  const handleBranchCreated = (newBranch: any) => {
    // Add to list
    setBranches(prev => [...prev, newBranch]);
    // Auto Select
    setFormData(prev => ({ ...prev, branchId: newBranch._id }));
    setOpenBranchCombobox(false);
    toast.success(`Selected new branch: ${newBranch.name}`);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border-border shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30 pb-4">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl">
              <User className="h-5 w-5 text-primary" />
              {user ? "Edit User" : "Add New User"}
            </CardTitle>
            <CardDescription className="flex flex-col gap-1">
              <span>Creating under <strong>{contextInfo.partnerName || currentUserName}</strong></span>
              {contextInfo.branchName && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Building className="h-3 w-3" /> Branch: {contextInfo.branchName}
                </span>
              )}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel} className="rounded-full hover:bg-muted">
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  className="rounded-lg"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  disabled={!!user} // Email immutable on edit usually
                  className="rounded-lg"
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="rounded-lg"
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            {/* Role & Branch */}
            <div className="rounded-xl border bg-card p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Building className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-sm">Role & Assignment</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label>Assign Role *</Label>
                  <Select value={formData.role} onValueChange={handleRoleChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.length > 0 ? (
                        roles.map(role => (
                          <SelectItem key={role.id} value={role.name}>
                            {role.displayName}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-xs text-muted-foreground text-center">Loading roles...</div>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {showBranchSelect && (
                  <div className="space-y-2">
                    <Label className="flex justify-between items-center">
                      Assign Branch *
                      <span
                        className="text-xs text-primary cursor-pointer hover:underline flex items-center gap-1"
                        onClick={() => setShowBranchDialog(true)}
                      >
                        <Plus className="h-3 w-3" /> Add Branch
                      </span>
                    </Label>
                    <div className="flex gap-2">
                      <Popover open={openBranchCombobox} onOpenChange={setOpenBranchCombobox}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" role="combobox" className="w-full justify-between">
                            {formData.branchId
                              ? branches.find(b => b._id === formData.branchId)?.name
                              : (loadingBranches ? "Loading branches..." : "Select branch...")}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                          <Command>
                            <CommandInput placeholder="Search branch..." />
                            <CommandList>
                              <CommandEmpty>No branch found.</CommandEmpty>
                              <CommandGroup>
                                {branches.map((branch) => (
                                  <CommandItem
                                    key={branch._id}
                                    value={branch.name}
                                    onSelect={() => {
                                      handleInputChange("branchId", branch._id);
                                      setOpenBranchCombobox(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        formData.branchId === branch._id ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {branch.name}
                                    <span className="ml-auto text-xs text-muted-foreground">{branch.code}</span>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Security */}
            <div className="space-y-4">
              <Label>Password {user ? '(Leave blank to keep current)' : '*'}</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder={user ? "********" : "Enter secure password"}
                  className="flex-1"
                  required={!user}
                />
                <Button type="button" variant="outline" onClick={generatePassword} className="gap-2">
                  <Lock className="h-3 w-3" /> Generate
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                {user ? 'Update User' : 'Create User'}
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>

      <CreateBranchDialog
        open={showBranchDialog}
        onOpenChange={setShowBranchDialog}
        onSuccess={handleBranchCreated}
      />
    </div>
  );
};

export default UserForm;
