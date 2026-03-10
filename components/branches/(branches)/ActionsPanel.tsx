import { PerformanceCard } from "./PerformanceCard";
import { AuditsCard } from "./AuditsCard";
import { QuickActionsCard } from "./QuickActionsCard";

export const ActionsPanel = () => {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <PerformanceCard />
      <AuditsCard />
      <QuickActionsCard />
    </div>
  );
};
