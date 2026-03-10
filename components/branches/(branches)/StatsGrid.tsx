import { branchStats } from "./data/mockData";
import { StatsCard } from "./StatsCard";
import { Building, Activity, Shield, Users } from "lucide-react";

const iconMap = {
  Building,
  Activity,
  Shield,
  Users,
};

export const StatsGrid = () => {
  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {branchStats.map((stat) => {
        const Icon = iconMap[stat.icon as keyof typeof iconMap];
        return (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            description={stat.description}
            icon={Icon}
            color={stat.color}
          />
        );
      })}
    </section>
  );
};
