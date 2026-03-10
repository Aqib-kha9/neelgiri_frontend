import { Badge } from "@/components/ui/badge";
import { User, Building, Shield, Ban } from "lucide-react";
import { allocationTypeConfig } from "./data/mockData";

interface AllocationTypeBadgeProps {
  type: string;
}

const AllocationTypeBadge = ({ type }: AllocationTypeBadgeProps) => {
  const config =
    allocationTypeConfig[type as keyof typeof allocationTypeConfig];
  if (!config) return null;

  const IconComponent = () => {
    switch (config.icon) {
      case "User":
        return <User className="h-3 w-3" />;
      case "Building":
        return <Building className="h-3 w-3" />;
      case "Shield":
        return <Shield className="h-3 w-3" />;
      case "Ban":
        return <Ban className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  return (
    <Badge
      className={`rounded-full border ${config.color} px-3 py-1.5 flex items-center gap-1.5`}
    >
      <IconComponent />
      {config.label}
    </Badge>
  );
};

export default AllocationTypeBadge;
