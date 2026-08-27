import { Badge } from "@/components/ui/badge";

interface ServiceTypeBadgeProps {
  type: string;
}

const ServiceTypeBadge = ({ type }: ServiceTypeBadgeProps) => (
  <Badge className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700">
    {type || "All services"}
  </Badge>
);

export default ServiceTypeBadge;
