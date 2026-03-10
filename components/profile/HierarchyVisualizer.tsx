"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Shield, Building2, Truck, Box } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import BranchHierarchyDialog from "./BranchHierarchyDialog";

export default function HierarchyVisualizer() {
    const { session } = useAuth();
    const user = session?.user;
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
    const [systemBranches, setSystemBranches] = useState<any[]>([]);
    const [loadingBranches, setLoadingBranches] = useState(false);
    // Helper to check if user is a Branch Admin type
    const isBranchAdmin = user?.role.includes('branch') && (user?.role.includes('admin') || user?.role === 'branch');
    const isSuperAdmin = user?.role === 'super_admin';
    const isDispatcher = user?.role === 'dispatcher';

    useEffect(() => {
        if (isSuperAdmin || isBranchAdmin || isDispatcher) {
            fetchBranches();
        }
    }, [user, isSuperAdmin, isBranchAdmin, isDispatcher]);

    const fetchBranches = async () => {
        setLoadingBranches(true);
        try {
            const res = await fetch('/api/branches', { // Endpoint returns all for super, own for branch_admin/dispatcher
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                const data = await res.json();
                setSystemBranches(data);
            }
        } catch (error) {
            console.error("Failed to fetch branches", error);
        } finally {
            setLoadingBranches(false);
        }
    };

    const handleBranchClick = (branchId: string) => {
        setSelectedBranchId(branchId);
        setDialogOpen(true);
    };

    if (!user) return null;

    // Helper to determine icon based on role (approximate)
    const getIcon = (roleName: string) => {
        if (roleName?.includes('super_admin')) return <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />;
        if (roleName?.includes('partner')) return <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
        if (roleName?.includes('branch')) return <Building2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />;
        if (roleName?.includes('dispatcher')) return <Box className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />;
        return <User className="h-5 w-5 text-foreground" />;
    };

    return (
        <Card className="shadow-lg border-border">
            <CardHeader className="bg-muted/30 pb-3 sm:pb-4 border-b px-4 sm:px-6">
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                    <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    Role Hierarchy
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Your position in the organization structure</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6 relative px-3 sm:px-6">
                {/* Hierarchy Tree Visualization */}
                <div className="flex flex-col gap-4 sm:gap-6 relative pl-3 sm:pl-4 border-l-2 border-dashed border-border ml-2 sm:ml-4">

                    {/* 1. Root / Super Admin (Hidden for Branch Admin) */}
                    {!isBranchAdmin && user.roleDisplayName !== 'Super Admin' && (
                        <div className="relative group">
                            <span className="absolute -left-[17px] sm:-left-[21px] top-3 sm:top-4 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-purple-500 ring-2 sm:ring-4 ring-background"></span>
                            <div className="ml-4 sm:ml-6 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-card border border-border shadow-sm flex items-center gap-2 sm:gap-3 opacity-80 hover:opacity-100 transition-opacity">
                                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500 shrink-0" />
                                <div>
                                    <h4 className="text-xs sm:text-sm font-semibold text-foreground">Super Admin</h4>
                                    <p className="text-[10px] sm:text-xs text-muted-foreground">Platform Owner</p>
                                </div>
                            </div>
                            {/* Connector Line */}
                            <div className="absolute -left-[16px] top-8 h-8 w-0.5 bg-border -z-10"></div>
                        </div>
                    )}

                    {/* 2. Partner Level (Hidden for Branch Admin) */}
                    {!isBranchAdmin && user.partnerName && !['partner_admin', 'partner'].includes(user.role) && (
                        <div className="relative group">
                            <span className="absolute -left-[21px] top-4 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-background"></span>
                            <div className="ml-6 p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex items-center gap-3">
                                <Building2 className="h-5 w-5 text-blue-600" />
                                <div>
                                    <h4 className="text-sm font-semibold text-foreground">{user.partnerName}</h4>
                                    <p className="text-xs text-muted-foreground">Partner Organization</p>
                                </div>
                            </div>
                            <div className="absolute -left-[16px] top-8 h-8 w-0.5 bg-border -z-10"></div>
                        </div>
                    )}

                    {/* 3. Branch Level (For roles BELOW Branch Admin) */}
                    {user.branchName && ['rider', 'customer'].includes(user.role) && (
                        <div className="relative group">
                            {/* ... existing code ... */}
                            <span className="absolute -left-[21px] top-4 h-3 w-3 rounded-full bg-orange-500 ring-4 ring-background"></span>
                            <div className="ml-6 p-4 rounded-xl bg-orange-50/50 border border-orange-100 flex items-center gap-3">
                                {user.branchAdminName ? (
                                    <User className="h-5 w-5 text-orange-600" />
                                ) : (
                                    <Building2 className="h-5 w-5 text-orange-600" />
                                )}
                                <div>
                                    <h4 className="text-sm font-semibold text-foreground">
                                        {user.branchAdminName || 'Branch Office'}
                                    </h4>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <span className="font-medium">({user.branchName})</span>
                                        {!user.branchAdminName && "- No Admin Assigned"}
                                    </p>
                                </div>
                            </div>
                            <div className="absolute -left-[16px] top-8 h-8 w-0.5 bg-border -z-10"></div>
                        </div>
                    )}

                    {/* Current User Node */}
                    <div className="relative">
                        <span className="absolute -left-[23px] top-1/2 -mt-1.5 h-4 w-4 rounded-full bg-primary ring-4 ring-background shadow-sm"></span>
                        <div className="ml-6 p-5 rounded-xl bg-card border border-primary/20 shadow-sm ring-1 ring-black/5 dark:ring-white/10">
                            {/* ... existing user card content ... */}
                            <div className="flex justify-between items-start mb-2">
                                <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">You</Badge>
                                <span className="text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-0.5 rounded">
                                    ID: {user.id.slice(-6)}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center border border-border">
                                    {getIcon(user.role)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-foreground">{user.name}</h3>
                                    <p className="text-sm text-primary font-medium">{user.roleDisplayName || user.role}</p>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-muted-foreground">Branch ID</p>
                                    <p className="text-sm font-mono font-medium text-foreground">{user.branchId || 'Not Assigned'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Email</p>
                                    <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Downstream Context: Children Branches (For Partner) */}
                    {(user.role === 'partner_admin' || user.role === 'partner') && (
                        <div className="relative">
                            <div className="absolute -left-[16px] -top-6 h-8 w-0.5 bg-border -z-10"></div>
                            {/* ... existing Partner logic ... */}
                            {/* Shortened for replacement */}
                            <div className="absolute -left-[16px] -top-6 h-8 w-0.5 bg-border -z-10"></div>
                            <span className="absolute -left-[21px] top-6 h-3 w-3 rounded-full bg-orange-500 ring-4 ring-background"></span>

                            <div className="ml-6 space-y-4">
                                <div className="p-5 rounded-xl border border-dashed border-border bg-card/50">
                                    <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <Building2 className="h-4 w-4 text-orange-500" />
                                        My Branches ({user.childrenBranches?.length || 0})
                                    </h4>

                                    {user.childrenBranches && user.childrenBranches.length > 0 ? (
                                        <div className="grid gap-3">
                                            {user.childrenBranches.map((branch) => (
                                                <BranchCard key={branch.id} branch={branch} onClick={() => handleBranchClick(branch.id)} />
                                            ))}
                                        </div>
                                    ) : (
                                        <EmptyBranchState />
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Shared Branch View for Super Admin OR Branch Admin OR Dispatcher */}
                    {(isSuperAdmin || isBranchAdmin || isDispatcher) && (
                        <div className="relative">
                            <div className="absolute -left-[16px] -top-6 h-8 w-0.5 bg-border -z-10"></div>
                            <span className="absolute -left-[21px] top-6 h-3 w-3 rounded-full bg-orange-500 ring-4 ring-background"></span>

                            <div className="ml-6 space-y-4">
                                <div className="p-5 rounded-xl border border-dashed border-border bg-card/50">
                                    <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <Building2 className="h-4 w-4 text-orange-500" />
                                        {(isBranchAdmin || isDispatcher) ? 'My Branch' : `All System Branches (${systemBranches.length})`}
                                    </h4>

                                    {systemBranches.length > 0 ? (
                                        <div className="grid gap-3">
                                            {systemBranches.map((branch) => (
                                                <BranchCard
                                                    key={branch._id}
                                                    branch={{
                                                        id: branch._id,
                                                        name: branch.name,
                                                        code: branch.code,
                                                        // For Branch Admin: Show Self as Admin (or real admin if diff)
                                                        // For Dispatcher: Show Real Branch Admin
                                                        admin: isBranchAdmin ? { name: user.name, email: user.email } : branch.admin,
                                                        partnerName: branch.partnerId?.name
                                                    }}
                                                    onClick={() => handleBranchClick(branch._id)}
                                                    showPartner={!isBranchAdmin && !isDispatcher}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border border-border">
                                            {loadingBranches ? (
                                                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                                            ) : (
                                                <>
                                                    <Building2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                                    <p className="text-sm">No branches found</p>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* General Management Capabilities (Always visible for relevant roles) */}
                    {(['partner_admin', 'partner', 'branch_admin', 'branch', 'super_admin', 'dispatcher'].includes(user.role)) && (
                        <div className="relative">
                            <span className="absolute -left-[21px] top-6 h-3 w-3 rounded-full bg-muted-foreground ring-4 ring-background"></span>
                            <div className="ml-6 p-4 rounded-xl border border-dashed border-border bg-muted/20">
                                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Can Manage</h4>
                                <div className="flex flex-wrap gap-2">
                                    {user.role === 'super_admin' && <Badge variant="outline" className="bg-background">All Roles</Badge>}
                                    {(user.role === 'partner_admin' || user.role === 'partner') && (
                                        <>
                                            <Badge variant="outline" className="bg-background">Branch Admins</Badge>
                                            <Badge variant="outline" className="bg-background">Dispatchers</Badge>
                                            <Badge variant="outline" className="bg-background">Riders</Badge>
                                            <Badge variant="outline" className="bg-background">Customers</Badge>
                                        </>
                                    )}
                                    {(user.role === 'branch_admin' || user.role === 'branch') && (
                                        <>
                                            <Badge variant="outline" className="bg-background">Dispatchers</Badge>
                                            <Badge variant="outline" className="bg-background">Riders</Badge>
                                            <Badge variant="outline" className="bg-background">Customers</Badge>
                                        </>
                                    )}
                                    {user.role === 'dispatcher' && (
                                        <>
                                            <Badge variant="outline" className="bg-background">Riders</Badge>
                                            <Badge variant="outline" className="bg-background">Customers</Badge>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
            {/* Dialog Integration */}
            <BranchHierarchyDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                branchId={selectedBranchId}
            />
        </Card>
    );
}

const BranchCard = ({ branch, onClick, showPartner = false }: { branch: any, onClick: () => void, showPartner?: boolean }) => (
    <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-card p-3 sm:p-4 rounded-lg sm:rounded-xl border border-border shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group/card gap-3 sm:gap-0"
        onClick={onClick}
    >
        <div className="flex items-center gap-3 sm:gap-4">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center shrink-0 border border-orange-200 dark:border-orange-800">
                <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
                <p className="text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors">{branch.name}</p>
                <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
                    <Badge variant="outline" className="font-mono text-[10px] sm:text-xs bg-muted/50 border-border text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20">
                        {branch.code}
                    </Badge>
                    {showPartner && branch.partnerName && (
                        <span className="text-[10px] text-muted-foreground">by {branch.partnerName}</span>
                    )}
                </div>
            </div>
        </div>
        <div className="text-left sm:text-right pl-11 sm:pl-0">
            <div className="flex flex-col sm:items-end">
                <div className="flex items-center gap-1.5 sm:justify-end text-xs sm:text-sm font-semibold text-foreground/80">
                    <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-orange-500 shrink-0" />
                    {branch.admin ? <span className="truncate">{branch.admin.name}</span> : <span className="text-muted-foreground italic">No Admin Assigned</span>}
                </div>
                {branch.admin?.email && (
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 truncate max-w-full sm:max-w-[200px]">{branch.admin.email}</p>
                )}
            </div>
        </div>
    </div>
);

const EmptyBranchState = () => (
    <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border border-border">
        <Building2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No branches created yet</p>
        <p className="text-xs opacity-70 mt-1">Create a branch to start managing your network</p>
    </div>
);
