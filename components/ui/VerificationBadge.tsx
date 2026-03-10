import { Badge } from "@/components/ui/badge";
import { verificationConfig } from "@/components/booking/(delivered)/data/mockData";
import { VerificationConfig } from "@/components/booking/(delivered)/types/index";

interface VerificationBadgeProps {
  status: keyof typeof verificationConfig;
}

const VerificationBadge = ({ status }: VerificationBadgeProps) => {
  const config: VerificationConfig = verificationConfig[status];

  if (!config || !config.icon) {
    console.error(`Invalid verification config for: ${status}`);
    return null;
  }

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

export default VerificationBadge;
