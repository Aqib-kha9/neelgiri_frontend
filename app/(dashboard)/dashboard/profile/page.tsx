"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import HierarchyVisualizer from "@/components/profile/HierarchyVisualizer";
import { Mail, Shield, MapPin } from "lucide-react";

export default function ProfilePage() {
    const { session } = useAuth();
    const user = session?.user;

    if (!user) return <div>Loading...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">User Profile</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Personal Info */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="shadow-lg border-border overflow-hidden">
                        {/* Header Background */}
                        <div className="h-32 bg-primary/10 relative border-b border-border">
                            <div className="absolute -bottom-10 left-6">
                                <div className="h-20 w-20 rounded-full bg-background p-1 shadow-md ring-1 ring-border">
                                    <div className="h-full w-full rounded-full bg-muted flex items-center justify-center text-primary font-bold text-2xl">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <CardContent className="pt-12 pb-6 px-6 bg-card text-card-foreground">
                            <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
                            <p className="text-primary font-medium mb-4">{user.roleDisplayName || user.role}</p>

                            <div className="space-y-3 pt-4 border-t border-border">
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <Mail className="h-4 w-4 text-primary/70" />
                                    <span className="text-foreground">{user.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <Shield className="h-4 w-4 text-primary/70" />
                                    <span className="capitalize text-foreground">{user.role.replace('_', ' ')}</span>
                                </div>
                                {user.branchId && (
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4 text-primary/70" />
                                        <span className="text-foreground">Branch ID: {user.branchId}</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Hierarchy & Stats */}
                <div className="lg:col-span-2 space-y-6">
                    <HierarchyVisualizer />
                </div>
            </div>
        </div>
    );
}
