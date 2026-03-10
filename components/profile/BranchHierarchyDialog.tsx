"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { User, Shield, Building2, Truck, Box, Users } from "lucide-react";
import { toast } from "sonner";

interface BranchHierarchyDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    branchId: string | null;
}

interface HierarchyData {
    branch: any;
    tree: any[];
    orphans: {
        dispatchers: any[];
        riders: any[];
        customers: any[];
        others: any[];
    };
    customers?: any[]; // New field for all branch customers
}

export default function BranchHierarchyDialog({ open, onOpenChange, branchId }: BranchHierarchyDialogProps) {
    const [data, setData] = useState<HierarchyData | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && branchId) {
            fetchHierarchy();
        } else {
            setData(null);
        }
    }, [open, branchId]);

    const fetchHierarchy = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/branches/${branchId}/hierarchy`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                const json = await res.json();
                setData(json);
            } else {
                toast.error("Failed to load branch details");
                onOpenChange(false);
            }
        } catch (error) {
            console.error(error);
            toast.error("Network error");
        } finally {
            setLoading(false);
        }
    };

    if (!branchId) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto w-full">
                <DialogHeader className="border-b border-border pb-4 mb-4">
                    <DialogTitle className="flex items-center gap-3 text-2xl text-foreground">
                        <div className="bg-primary/10 p-2 rounded-lg">
                            <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        {loading ? 'Loading...' : data?.branch?.name}
                    </DialogTitle>
                    <DialogDescription className="hidden" />
                    <div className="text-sm text-muted-foreground flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                        <span>Branch Code: <Badge variant="outline" className="font-mono ml-1 border-border text-foreground">{data?.branch?.code}</Badge></span>
                        {data?.branch?.partnerId?.name && (
                            <>
                                <span className="hidden sm:inline text-muted-foreground">•</span>
                                <span className="flex items-center gap-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded text-xs font-medium border border-blue-500/20">
                                    <Building2 className="h-3 w-3" />
                                    Created by: {data.branch.partnerId.name}
                                </span>
                            </>
                        )}
                    </div>
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    </div>
                ) : data ? (
                    <div className="space-y-8">
                        {/* 1. Main Hierarchy Tree (Admin -> Dispatcher -> Riders) */}
                        <section className="relative pl-4 border-l-2 border-dashed border-border ml-2 space-y-8">

                            {data.tree.length === 0 && (
                                <div className="text-muted-foreground italic pl-4">No Branch Admins assigned yet.</div>
                            )}

                            {data.tree.map((admin: any) => (
                                <div key={admin._id} className="relative">
                                    {/* Admin Node */}
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4">
                                        <div className="absolute -left-[21px] top-3 h-3 w-3 rounded-full bg-orange-500 ring-4 ring-background"></div>
                                        <div className="bg-card border border-border p-3 sm:p-4 rounded-xl flex-1 shadow-sm w-full hover:border-primary/50 transition-colors">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <Shield className="h-4 w-4 text-orange-500 shrink-0" />
                                                <h3 className="font-bold text-foreground text-sm sm:text-base">{admin.name}</h3>
                                                <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 text-[10px] sm:text-xs hover:bg-orange-500/20">Branch Admin</Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground break-all sm:break-normal">{admin.email}</p>
                                        </div>
                                    </div>

                                    {/* Admin's Children Container */}
                                    <div className="pl-12 space-y-6">

                                        {/* Direct Riders by Admin */}
                                        {admin.directRiders?.length > 0 && (
                                            <div className="space-y-3">
                                                <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                                    <Truck className="h-3 w-3" /> Direct Riders
                                                </h5>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {admin.directRiders.map((rider: any) => (
                                                        <UserCard key={rider._id} user={rider} icon={<Truck className="h-4 w-4 text-blue-500" />} color="bg-card border-border" />
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Dispatchers */}
                                        {admin.dispatchers?.map((dispatcher: any) => (
                                            <div key={dispatcher._id} className="relative pl-4 sm:pl-6 border-l-2 border-indigo-500/20 ml-2">
                                                {/* Dispatcher Node */}
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="absolute -left-[5px] top-1/2 -mt-1 h-2 w-2 rounded-full bg-indigo-400"></span>
                                                    <div className="bg-card border border-border p-3 rounded-lg flex-1 hover:border-indigo-500/30 transition-colors">
                                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                                                            <div className="flex items-center gap-2">
                                                                <Box className="h-4 w-4 text-indigo-500 shrink-0" />
                                                                <span className="font-semibold text-foreground text-sm sm:text-base">{dispatcher.name}</span>
                                                                <span className="text-[10px] sm:text-xs text-indigo-500 font-medium">(Dispatcher)</span>
                                                            </div>
                                                            <span className="text-xs text-muted-foreground break-all sm:break-normal">{dispatcher.email}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Dispatcher's Riders */}
                                                {dispatcher.riders?.length > 0 ? (
                                                    <div className="pl-8 grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                                        {dispatcher.riders.map((rider: any) => (
                                                            <div key={rider._id} className="bg-muted/30 border border-border p-2 rounded flex items-center gap-2 shadow-sm text-sm">
                                                                <Truck className="h-3 w-3 text-muted-foreground" />
                                                                <span className="text-foreground">{rider.name}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="pl-8 text-xs text-muted-foreground italic">No riders assigned</div>
                                                )}
                                            </div>
                                        ))}

                                        {admin.dispatchers?.length === 0 && admin.directRiders?.length === 0 && (
                                            <div className="text-xs text-muted-foreground italic">No team members created yet.</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </section>

                        {/* 2. Partner Direct Creations (Orphans) */}
                        {hasOrphans(data.orphans) && (
                            <section className="bg-muted/30 rounded-xl p-6 border border-border">
                                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                    <Users className="h-5 w-5 text-muted-foreground" />
                                    Created by Partner (Directly Assigned)
                                </h3>
                                <p className="text-sm text-muted-foreground mb-6">
                                    Users assigned to this branch but created directly by Partner Admin, not linked to a specific Branch Admin or Dispatcher hierarchy.
                                </p>

                                <div className="space-y-6">
                                    {data.orphans.dispatchers.length > 0 && (
                                        <OrphanGroup title="Dispatchers" users={data.orphans.dispatchers} icon={<Box className="text-indigo-500" />} />
                                    )}
                                    {data.orphans.riders.length > 0 && (
                                        <OrphanGroup title="Riders" users={data.orphans.riders} icon={<Truck className="text-blue-500" />} />
                                    )}
                                    {data.orphans.customers.length > 0 && (
                                        <OrphanGroup title="Customers" users={data.orphans.customers} icon={<User className="text-green-500" />} />
                                    )}
                                    {data.orphans.others.length > 0 && (
                                        <OrphanGroup title="Others" users={data.orphans.others} icon={<User className="text-muted-foreground" />} />
                                    )}
                                </div>
                            </section>
                        )}

                        {/* 3. All Branch Customers (New Section for Dispatchers/Admins) */}
                        {data.customers && data.customers.length > 0 && (
                            <section className="bg-blue-500/5 rounded-xl p-6 border border-blue-500/20 mt-8">
                                <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                                    <User className="h-5 w-5 text-blue-500" />
                                    All Branch Customers ({data.customers.length})
                                </h3>
                                <p className="text-sm text-muted-foreground mb-6">
                                    Complete list of customers registered with this branch, including their creator information.
                                </p>
                                <OrphanGroup title="" users={data.customers} icon={<User className="h-4 w-4 text-blue-500" />} />
                            </section>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">No data available</div>
                )}
            </DialogContent>
        </Dialog>
    );
}

const UserCard = ({ user, icon, color = "bg-card border-border", showCreator = true }: { user: any, icon: any, color?: string, showCreator?: boolean }) => (
    <div className={`p-3 rounded-lg border flex flex-col gap-2 ${color} hover:border-primary/30 transition-all`}>
        <div className="flex items-start gap-3">
            <div className="opacity-75 shrink-0 mt-0.5">{icon}</div>
            <div className="min-w-0 flex-1">
                <div className="font-medium text-sm text-foreground truncate">{user.name}</div>
                <div className="text-xs text-muted-foreground truncate">{user.email}</div>
            </div>
        </div>
        {showCreator && (user.createdBy || user.createdAt) && (
            <div className="pt-2 border-t border-border flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
                {user.createdBy && (
                    <span className="flex items-center gap-1 truncate" title={`Created by ${user.createdBy.name}`}>
                        <User className="h-3 w-3 opacity-50" />
                        By: <span className="font-medium text-foreground">{user.createdBy.name}</span>
                    </span>
                )}
                {user.createdAt && (
                    <span className="opacity-75 ml-auto">
                        {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                )}
            </div>
        )}
    </div>
);

const OrphanGroup = ({ title, users, icon }: { title: string, users: any[], icon: any }) => (
    <div>
        {title && (
            <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide flex items-center gap-2">
                {icon} {title}
            </h4>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {users.map(u => (
                <UserCard key={u._id} user={u} icon={icon} />
            ))}
        </div>
    </div>
);

const hasOrphans = (orphans: any) => {
    return (
        orphans.dispatchers.length > 0 ||
        orphans.riders.length > 0 ||
        orphans.customers.length > 0 ||
        orphans.others.length > 0
    );
};
