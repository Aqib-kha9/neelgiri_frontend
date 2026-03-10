import { BranchTable } from "./BranchTable";
import { branchesData } from "./data/mockData";

type Branch = typeof branchesData[0];

interface BranchListProps {
  branches: Branch[];
  onEditBranch: (branch: Branch) => void;
  onDeleteBranch: (branchId: string) => void;
}

export const BranchList = (props: BranchListProps) => {
  return (
    <BranchTable {...props} />
  );
};
