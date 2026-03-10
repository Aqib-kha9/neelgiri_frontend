import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  BarChart3,
  Building,
  Users,
  CheckCircle2,
  TrendingUp,
  PieChart,
} from "lucide-react";

const reportTypeConfig = {
  monthly: {
    label: "Monthly Report",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Calendar,
  },
  quarterly: {
    label: "Quarterly Report",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    icon: BarChart3,
  },
  branch: {
    label: "Branch Report",
    color: "bg-green-50 text-green-700 border-green-200",
    icon: Building,
  },
  partner: {
    label: "Partner Report",
    color: "bg-orange-50 text-orange-700 border-orange-200",
    icon: Users,
  },
  reconciliation: {
    label: "Reconciliation",
    color: "bg-red-50 text-red-700 border-red-200",
    icon: CheckCircle2,
  },
  weekly: {
    label: "Weekly Report",
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: TrendingUp,
  },
  analytical: {
    label: "Analytical Report",
    color: "bg-cyan-50 text-cyan-700 border-cyan-200",
    icon: PieChart,
  },
};

interface ReportTypeBadgeProps {
  type: keyof typeof reportTypeConfig;
}

export const ReportTypeBadge = ({ type }: ReportTypeBadgeProps) => {
  const config = reportTypeConfig[type];
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
