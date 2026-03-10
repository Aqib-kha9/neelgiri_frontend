import { Badge } from "@/components/ui/badge";
import { Building, Users } from "lucide-react";

const allocationTypeConfig = {
  branch: {
    label: "Branch",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Building,
  },
  partner: {
    label: "Partner",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    icon: Users,
  },
};

interface AllocationTypeBadgeProps {
  type: keyof typeof allocationTypeConfig;
}

export const AllocationTypeBadge = ({ type }: AllocationTypeBadgeProps) => {
  const config = allocationTypeConfig[type];
  const IconComponent = config.icon;

  return (
    <Badge
      className={`rounded-full border ${config.color} px-3 py-1.5 flex items-center gap-1.5`}
    >
      <IconComponent className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};
