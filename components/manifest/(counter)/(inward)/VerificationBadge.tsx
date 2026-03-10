import { Badge } from "@/components/ui/badge";

const verificationConfig = {
  passed: {
    label: "Passed",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  failed: { label: "Failed", color: "bg-red-100 text-red-800 border-red-200" },
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  in_progress: {
    label: "In Progress",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
};

interface VerificationBadgeProps {
  status: keyof typeof verificationConfig;
}

const VerificationBadge = ({ status }: VerificationBadgeProps) => {
  const config = verificationConfig[status];

  return (
    <Badge className={`rounded-full border ${config.color} px-2 py-1 text-xs`}>
      {config.label}
    </Badge>
  );
};

export default VerificationBadge;
