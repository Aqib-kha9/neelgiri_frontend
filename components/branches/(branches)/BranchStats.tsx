import { Building, Activity, Shield, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { branchesData } from "./data/mockData";

type Branch = typeof branchesData[0];

interface BranchStatsProps {
    branches: Branch[];
}

export const BranchStats = ({ branches }: BranchStatsProps) => {
    const totalBranches = branches.length;
    const activeBranches = branches.filter((b) => b.status === "active").length;
    const companyBranches = branches.filter((b) => b.type === "company").length;
    const partnerBranches = branches.filter((b) => b.type === "partner").length;

    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card className="rounded-3xl border-border/70 bg-card shadow-card">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Total Branches
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="text-3xl font-bold text-foreground">
                                        {totalBranches}
                                    </span>
                                    <Badge
                                        variant="secondary"
                                        className="rounded-lg bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-500 hover:bg-blue-500/20"
                                    >
                                        Network
                                    </Badge>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total locations
                            </p>
                        </div>
                        <div className="rounded-2xl bg-blue-500/10 p-3.5">
                            <Building className="h-6 w-6 text-blue-500" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-3xl border-border/70 bg-card shadow-card">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Active Branches
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="text-3xl font-bold text-foreground">
                                        {activeBranches}
                                    </span>
                                    <Badge
                                        variant="secondary"
                                        className="rounded-lg bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500 hover:bg-green-500/20"
                                    >
                                        Operational
                                    </Badge>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">Currently live</p>
                        </div>
                        <div className="rounded-2xl bg-green-500/10 p-3.5">
                            <Activity className="h-6 w-6 text-green-500" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-3xl border-border/70 bg-card shadow-card">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Company Owned
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="text-3xl font-bold text-foreground">
                                        {companyBranches}
                                    </span>
                                    <Badge
                                        variant="secondary"
                                        className="rounded-lg bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-500 hover:bg-indigo-500/20"
                                    >
                                        Direct
                                    </Badge>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Managed by us
                            </p>
                        </div>
                        <div className="rounded-2xl bg-indigo-500/10 p-3.5">
                            <Shield className="h-6 w-6 text-indigo-500" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-3xl border-border/70 bg-card shadow-card">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Partner Branches
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="text-3xl font-bold text-foreground">
                                        {partnerBranches}
                                    </span>
                                    <Badge
                                        variant="secondary"
                                        className="rounded-lg bg-orange-500/10 px-2 py-0.5 text-xs font-medium text-orange-500 hover:bg-orange-500/20"
                                    >
                                        Franchise
                                    </Badge>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Partner network
                            </p>
                        </div>
                        <div className="rounded-2xl bg-orange-500/10 p-3.5">
                            <Users className="h-6 w-6 text-orange-500" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
