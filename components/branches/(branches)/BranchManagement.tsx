"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { BranchHeader } from "./BranchHeader";
import { BranchStats } from "./BranchStats";
import { BranchFilters } from "./BranchFilters";
import { BranchList } from "./BranchList";
import { mapBackendBranch, type Branch } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

export const BranchManagement = () => {
    const router = useRouter();
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const fetchBranches = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${API_BASE}/api/branches`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const list = Array.isArray(data) ? data : [];
            setBranches(list.map(mapBackendBranch));
        } catch (error) {
            console.error("Failed to load branches", error);
            toast.error("Failed to load branches. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    const handleAddBranch = () => {
        router.push("/dashboard/branches/add");
    };

    const handleEditBranch = (branch: Branch) => {
        router.push(`/dashboard/branches/add?edit=${branch.id}`);
    };

    const handleDeactivateBranch = async (branchId: string) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `${API_BASE}/api/branches/${branchId}`,
                { isActive: false },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Branch deactivated successfully");
            await fetchBranches();
        } catch (error) {
            console.error("Failed to deactivate branch", error);
            toast.error("Failed to deactivate branch");
        }
    };

    const handlePermanentDelete = async (branchId: string): Promise<boolean> => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_BASE}/api/branches/${branchId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Branch permanently deleted");
            await fetchBranches();
            return true;
        } catch (error) {
            console.error("Failed to permanently delete branch", error);
            const response = axios.isAxiosError(error) ? error.response?.data : null;
            const dependencies = response?.dependencies as Record<string, number> | undefined;
            const dependencyMessage = dependencies
                ? ` Linked records: ${Object.entries(dependencies)
                    .map(([label, count]) => `${label} (${count})`)
                    .join(", ")}.`
                : "";
            toast.error(
                `${response?.message || "Failed to permanently delete branch."}${dependencyMessage}`
            );
            return false;
        }
    };

    const filteredBranches = branches.filter((branch) => {
        const matchesSearch =
            branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            branch.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            branch.city.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "all" || branch.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-4 p-4">
            <BranchHeader
                onAddBranch={handleAddBranch}
                branchCount={branches.length}
            />

            <BranchStats branches={branches} />

            <BranchFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
            />

            {filteredBranches.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <p className="text-lg font-semibold text-foreground">No branches found</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        {branches.length === 0
                            ? "No branches have been created yet. Click 'Add New Branch' to get started."
                            : "Try adjusting your search or filter criteria."}
                    </p>
                </div>
            ) : (
                <BranchList
                    branches={filteredBranches}
                    onEditBranch={handleEditBranch}
                    onDeactivateBranch={handleDeactivateBranch}
                    onPermanentDelete={handlePermanentDelete}
                />
            )}
        </div>
    );
};
