import { BranchTable } from "./BranchTable";
import type { Branch } from "./types";

interface BranchListProps {
  branches: Branch[];
  onEditBranch: (branch: Branch) => void;
  onDeactivateBranch: (branchId: string) => void;
  onPermanentDelete: (branchId: string) => Promise<boolean>;
}

export const BranchList = (props: BranchListProps) => {
  return (
    <BranchTable {...props} />
  );
};
