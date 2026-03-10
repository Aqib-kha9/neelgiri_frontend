"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
    description: string;
    isSystem: boolean;
    permissions: any[];
}

export default function RolesPage() {
    const { can, session } = useAuth();
    const router = useRouter();
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // If not authorized, redirect
        /* 
        // Commented out for now to ensure visibility during dev, 
        // but in production this should be active:
        if (session && !can('roles', 'read')) {
            router.push('/dashboard');
            return;
        }
        */

        fetchRoles();
    }, [session]);

    const fetchRoles = async () => {
        try {
            const res = await fetch("/api/rbac/roles", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setRoles(data);
            }
        } catch (error) {
            console.error("Failed to fetch roles", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            const res = await fetch(`/api/rbac/roles/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.ok) {
                fetchRoles();
            } else {
                alert("Failed to delete role");
            }
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">System Roles</h1>
                    <p className="text-muted-foreground">
                        Manage roles and their permissions to control access.
                    </p>
                </div>
                {can('roles', 'create') && (
                    <Button onClick={() => router.push("/admin/roles/new")}>
                        <Plus className="mr-2 h-4 w-4" /> Create Role
                    </Button>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Existing Roles</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Role Name</TableHead>
                                <TableHead>Display Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>System Role</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={5}>Loading...</TableCell></TableRow>
                            ) : roles.map((role) => (
                                <TableRow key={role._id}>
                                    <TableCell className="font-medium">{role.name}</TableCell>
                                    <TableCell>{role.displayName}</TableCell>
                                    <TableCell>{role.description}</TableCell>
                                    <TableCell>
                                        {role.isSystem ? (
                                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                                                System
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
                                                Custom
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        {can('roles', 'update') && (
                                            <Button variant="outline" size="sm" onClick={() => router.push(`/admin/roles/${role._id}`)}>
                                                Edit Permissions
                                            </Button>
                                        )}
                                        {!role.isSystem && can('roles', 'delete') && (
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(role._id)}>Delete</Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
