import { Badge } from "@/components/ui/badge";

const serviceTypeConfig = {
  Surface: {
    label: "Surface",
    color: "bg-green-50 text-green-700 border-green-200",
  },
  Air: { label: "Air", color: "bg-blue-50 text-blue-700 border-blue-200" },
  Express: {
    label: "Express",
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
  International: {
    label: "International",
    color: "bg-orange-50 text-orange-700 border-orange-200",
  },
};

interface ServiceTypeBadgeProps {
  type: string;
}

export const ServiceTypeBadge = ({ type }: ServiceTypeBadgeProps) => {
  const config = serviceTypeConfig[type as keyof typeof serviceTypeConfig];

  if (!config) {
    return (
      <Badge variant="outline" className="rounded-full px-2 py-1 text-xs">
        {type}
      </Badge>
    );
  }

  return (
    <Badge className={`rounded-full border ${config.color} px-2 py-1 text-xs`}>
      {config.label}
    </Badge>
  );
};
