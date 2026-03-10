"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function RoleEditorPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const isNew = id === 'new';
    const router = useRouter();
    const { can } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        displayName: '',
        description: '',
        permissions: [] as string[] // Array of Permission IDs
    });

    const [availablePermissions, setAvailablePermissions] = useState<Record<string, any[]>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPermissions();
        if (!isNew) fetchRole();
    }, [id]);

    const fetchPermissions = async () => {
        const res = await fetch('/api/rbac/permissions', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
            setAvailablePermissions(await res.json());
        }
    };

    const fetchRole = async () => {
        // In a real app we'd fetch specific role by ID, but our list API populates fully, 
        // so for MVP we could just find from list or implement get-by-id.
        // Let's implement correct single fetch logic if the API supports it?
        // Our backend does: PUT /roles/:id update, but GET /roles returns all.
        // Let's use the list for now to save a round trip or implement GET /roles/:id in backend if needed.
        // Actually, let's just fetch all and find.
        // Optimization: Implement GET /roles/:id in backend properly.
        // For now, fetching list.
        const res = await fetch('/api/rbac/roles', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
            const roles = await res.json();
            const role = roles.find((r: any) => r._id === id);
            if (role) {
                setFormData({
                    name: role.name,
                    displayName: role.displayName,
                    description: role.description,
                    permissions: role.permissions.map((p: any) => p._id)
                });
            }
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const endpoint = isNew ? '/api/rbac/roles' : `/api/rbac/roles/${id}`;
        const method = isNew ? 'POST' : 'PUT';

        try {
            const res = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success(`Role ${isNew ? 'created' : 'updated'} successfully`);
                router.push('/admin/roles');
            } else {
                const err = await res.json();
                toast.error(err.message || "Operation failed");
            }
        } catch (e) {
            console.error(e);
            toast.error("Network error");
        }
    };

    const togglePermission = (permId: string) => {
        setFormData(prev => {
            const exists = prev.permissions.includes(permId);
            if (exists) {
                return { ...prev, permissions: prev.permissions.filter(p => p !== permId) };
            } else {
                return { ...prev, permissions: [...prev.permissions, permId] };
            }
        });
    };

    const toggleResource = (resource: string, allPerms: any[]) => {
        // Check if all are currently selected
        const allIds = allPerms.map(p => p._id);
        const isAllSelected = allIds.every((id: string) => formData.permissions.includes(id));

        if (isAllSelected) {
            // Deselect all
            setFormData(prev => ({
                ...prev,
                permissions: prev.permissions.filter(p => !allIds.includes(p))
            }));
        } else {
            // Select all
            setFormData(prev => ({
                ...prev,
                permissions: [...new Set([...prev.permissions, ...allIds])]
            }));
        }
    };

    if (loading && !isNew) return <div>Loading...</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">{isNew ? 'Create New Role' : 'Edit Role & Permissions'}</h1>
                <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Role Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="displayName">Display Name</Label>
                                <Input
                                    id="displayName"
                                    value={formData.displayName}
                                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                    required
                                    placeholder="e.g., Senior Dispatcher"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">System Name (Unique)</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    placeholder="e.g., senior_dispatcher"
                                    disabled={!isNew} // Lock system name after creation generally safer
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="What does this role do?"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Permissions Matrix</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {Object.entries(availablePermissions).map(([resource, perms]) => (
                            <div key={resource} className="border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold capitalize">{resource.replace('_', ' ')}</h3>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleResource(resource, perms)}
                                    >
                                        Toggle All
                                    </Button>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {perms.map((perm: any) => (
                                        <div key={perm._id} className="flex items-start space-x-2">
                                            <Checkbox
                                                id={perm._id}
                                                checked={formData.permissions.includes(perm._id)}
                                                onCheckedChange={() => togglePermission(perm._id)}
                                            />
                                            <div className="grid gap-1.5 leading-none">
                                                <Label
                                                    htmlFor={perm._id}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize cursor-pointer"
                                                >
                                                    {perm.action}
                                                </Label>
                                                <p className="text-xs text-muted-foreground">
                                                    {perm.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" size="lg">Save Changes</Button>
                </div>
            </form>
        </div>
    );
}
