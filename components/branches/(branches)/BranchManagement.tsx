"use client";

import { useState } from "react";
import { BranchHeader } from "./BranchHeader";
import { BranchStats } from "./BranchStats";
import { BranchFilters } from "./BranchFilters";
import { BranchList } from "./BranchList";
import { branchesData } from "./data/mockData";

type Branch = typeof branchesData[0];

export const BranchManagement = () => {
    const [branches, setBranches] = useState<Branch[]>(branchesData);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const handleAddBranch = () => {
        // Logic to open Add Branch form (can be implemented later or redirect)
        console.log("Add Branch Clicked");
    };

    const handleEditBranch = (branch: Branch) => {
        console.log("Edit Branch", branch);
    };

    const handleDeleteBranch = (branchId: string) => {
        setBranches(branches.filter((b) => b.id !== branchId));
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

            <BranchList
                branches={filteredBranches}
                onEditBranch={handleEditBranch}
                onDeleteBranch={handleDeleteBranch}
            />
        </div>
    );
};
