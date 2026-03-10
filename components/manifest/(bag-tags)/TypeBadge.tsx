// app/dashboard/manifest/bag-tags/components/TypeBadge.tsx
import { Badge } from "@/components/ui/badge";

const typeConfig = {
  consolidation: {
    label: "Consolidation",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  express: {
    label: "Express",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  surface: {
    label: "Surface",
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  air: {
    label: "Air",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  cod: { label: "COD", color: "bg-red-100 text-red-800 border-red-200" },
};

const TypeBadge = ({ type }: { type: keyof typeof typeConfig }) => {
  const config = typeConfig[type];

  return (
    <Badge className={`rounded-full border ${config.color} px-2 py-1 text-xs`}>
      {config.label}
    </Badge>
  );
};

export default TypeBadge;
