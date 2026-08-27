import { Badge } from "@/components/ui/badge";
import { Building2, CircleSlash2, User } from "lucide-react";

interface AllocationTypeBadgeProps {
  type: string;
}

const AllocationTypeBadge = ({ type }: AllocationTypeBadgeProps) => {
  const normalized = type.toLowerCase();
  const config = normalized === "branch"
    ? { label: "Branch", color: "border-blue-200 bg-blue-50 text-blue-700", icon: Building2 }
    : normalized === "customer"
      ? { label: "Customer", color: "border-green-200 bg-green-50 text-green-700", icon: User }
      : normalized === "partner"
        ? { label: "Partner", color: "border-purple-200 bg-purple-50 text-purple-700", icon: User }
        : { label: "Unallocated", color: "border-gray-200 bg-gray-50 text-gray-700", icon: CircleSlash2 };
  const Icon = config.icon;

  return (
    <Badge className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 ${config.color}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

export default AllocationTypeBadge;
